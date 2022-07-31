const request = require("supertest");
const { con, server } = require("../users_server");
var { John_Doe, Joe_Shmoe } = require("..//test_vars");
const { achievement, fake_achievement } = require("../test_vars");


beforeAll(() => {
    con.query("USE testusersdb", function (err, result) {
        if (err) throw err;
    });
    con.query("TRUNCATE useraccounts", function (err) {
        if (err) throw err;
    });

    con.query("TRUNCATE friendships", function (err) {
        if (err) throw err;
    });

    con.query("TRUNCATE items", function (err) {
        if (err) throw err;
    });

    con.query("TRUNCATE achievements", function (err) {
        if (err) throw err;
    });

    con.query("TRUNCATE locations", function (err) {
        if (err) throw err;
    });
    con.query(`INSERT INTO useraccounts (user_id, displayName) VALUES ('1', 'John Doe')`, function (err) {
        if (err) throw err;
    });

    con.query(`INSERT INTO useraccounts (user_id, displayName) VALUES ('1234', 'Doe John')`, function (err) {
        if (err) throw err;
    });

    con.query(`INSERT INTO useraccounts (user_id, displayName) VALUES ('2', 'Joe Shmoe')`, function (err) {
        if (err) throw err;
    });
})


describe('Manage Profile: Changing name', () => {
    test('Avaliable name', async () => {
        const response = await request(server)
            .put('/1/displayName')
            .send({ displayName: "John Doe is cool" })
        John_Doe.displayName = "John Doe is cool";
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Same name', async () => {
        const response = await request(server)
            .put('/1/displayName')
            .send({ displayName: "John Doe is cool" })
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Taken name', async () => {
        const response = await request(server)
            .put('/1/displayName')
            .send({ displayName: "Doe John" })
        expect(response.text).toBe("Name taken");
        expect(response.statusCode).toBe(400);
    })

    test('Name too short', async () => {
        const response = await request(server)
            .put('/1/displayName')
            .send({ displayName: "A" })
        expect(response.text).toBe("Name is not between 3 and 45 characters");
        expect(response.statusCode).toBe(400);
    })

    test('Name too long', async () => {
        const response = await request(server)
            .put('/1/displayName')
            .send({ displayName: "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRST" })
        expect(response.text).toBe("Name is not between 3 and 45 characters");
        expect(response.statusCode).toBe(400);
    })

    test('User does not exist', async () => {
        const response = await request(server)
            .put('/-1/displayName')
            .send({ displayName: "John Doe" })
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Change name with no account id', async () => {
        const response = await request(server)
            .put('/ /displayName')
            .send({ displayName: "John Doe" })
        expect(response.text).toBe("No id provided");
        expect(response.statusCode).toBe(400);
    })

    test('Change name with no name', async () => {
        const response = await request(server)
            .put('/1/displayName')
            .send({})
        expect(response.text).toBe("No name provided");
        expect(response.statusCode).toBe(400);
    })
})

describe('Manage Profile: Sending requests', () => {
    test('Send request to existing user', async () => {
        const response = await request(server)
            .post('/1/friends')
            .send({ displayName: "Doe John" })
        John_Doe.outgoingRequests.push("Doe John");
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Send request to non-existing user', async () => {
        const response = await request(server)
            .post('/1/friends')
            .send({ displayName: "Nobody" })
        expect(response.text).toBe("Account with name does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Send request twice', async () => {
        const response = await request(server)
            .post('/1/friends')
            .send({ displayName: "Doe John" })
        expect(response.text).toBe("Already sent a request to this user");
        expect(response.statusCode).toBe(400);
    })

    test('Send request to friend', async () => {
        con.query('UPDATE friendships SET status = 1 WHERE send_id = 1 AND receiver_id = 1234', function (err) {
            if (err) throw err;
        })
        const response = await request(server)
            .post('/1/friends')
            .send({ displayName: "Doe John" })
        expect(response.text).toBe("Already friends with this user");
        expect(response.statusCode).toBe(400);
    })

    test('Send request to user that has sent a request', async () => {
        con.query('UPDATE friendships SET status = 0, send_id = 1234, receiver_id = 1 WHERE send_id = 1 AND receiver_id = 1234', function (err) {
            if (err) throw err;
        })
        const response = await request(server)
            .post('/1/friends')
            .send({ displayName: "Doe John" })
        expect(response.text).toBe("Already been sent a request by this user");
        expect(response.statusCode).toBe(400);
    })

    test('Send request to self', async () => {
        con.query(`UPDATE useraccounts SET displayName = 'John Doe' WHERE user_id = 1`, function (err) {
            if (err) throw err;
        })
        John_Doe.displayName = "John Doe";
        const response = await request(server)
            .post('/1/friends')
            .send({ displayName: "John Doe" })
        expect(response.text).toBe("Cannot send requests to self");
        expect(response.statusCode).toBe(400);
    })

    test('Send request from non-existing account', async () => {
        const response = await request(server)
            .post('/-1/friends')
            .send({ displayName: "John Doe" })
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Send request with no account id', async () => {
        const response = await request(server)
            .post('/ /friends')
            .send({ displayName: "John Doe" })
        expect(response.text).toBe("No id provided");
        expect(response.statusCode).toBe(400);
    })

    test('Send request with no name', async () => {
        const response = await request(server)
            .post('/1/friends')
            .send({})
        expect(response.text).toBe("No name provided");
        expect(response.statusCode).toBe(400);
    })

    test('Send request to empty string', async () => {
        const response = await request(server)
            .post('/1/friends')
            .send({ displayName: " " })
        expect(response.text).toBe("No name provided");
        expect(response.statusCode).toBe(400);
    })
})

describe('Manage Profile: Removing friends', () => {
    test('Remove an existing friend', async () => {
        con.query('UPDATE friendships SET status = 1 WHERE send_id = 1234 AND receiver_id = 1', function (err) {
            if (err) throw err;
        })
        const response = await request(server)
            .delete('/1/friends/Doe John')
        John_Doe.outgoingRequests = [];
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Remove an non-existing user', async () => {
        const response = await request(server)
            .delete('/1/friends/Nobody')
        expect(response.text).toBe("Account with name does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Remove an existing non-friend', async () => {
        const response = await request(server)
            .delete('/1/friends/Doe John')
        expect(response.text).toBe("User not on friends list");
        expect(response.statusCode).toBe(400);
    })

    test('Remove self', async () => {
        const response = await request(server)
            .delete('/1/friends/John Doe')
        expect(response.text).toBe("Cannot remove self");
        expect(response.statusCode).toBe(400);
    })

    test('Remove friend from non-existing user', async () => {
        const response = await request(server)
            .delete('/-1/friends/John Doe')
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Remove friend with no account id', async () => {
        const response = await request(server)
            .delete('/ /friends/John Doe')
        expect(response.text).toBe("No id provided");
        expect(response.statusCode).toBe(400);
    })

    test('Remove empty string', async () => {
        const response = await request(server)
            .delete('/1/friends/ /')
            .send({ displayName: " " })
        expect(response.text).toBe("No name provided");
        expect(response.statusCode).toBe(400);
    })
})

describe('Manage Profile: Accepting requests', () => {
    test('Accept an incoming request', async () => {
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1234', '1', '0')`, function (err) {
            if (err) throw err;
        })
        const response = await request(server)
            .put('/1/requests')
            .send({ displayName: "Doe John" })
        John_Doe.friends.push("Doe John");
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Accept a request from non-existing user', async () => {
        const response = await request(server)
            .put('/1/requests')
            .send({ displayName: "Nobody" })
        expect(response.text).toBe("Account with name does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Accept a request that does not exist', async () => {
        const response = await request(server)
            .put('/1/requests')
            .send({ displayName: "Joe Shmoe" })
        expect(response.text).toBe("No request from this user");
        expect(response.statusCode).toBe(404);
    })

    test('Accept a request from self', async () => {
        const response = await request(server)
            .put('/1/requests')
            .send({ displayName: "John Doe" })
        expect(response.text).toBe("Cannot accept a request from self");
        expect(response.statusCode).toBe(400);
    })

    test('Accept a request from friend', async () => {
        const response = await request(server)
            .put('/1/requests')
            .send({ displayName: "Doe John" })
        expect(response.text).toBe("Already friends with this user");
        expect(response.statusCode).toBe(400);
    })

    test('Accept an outgoing request', async () => {
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1', '2', '0')`, function (err) {
            if (err) throw err;
        })
        const response = await request(server)
            .put('/1/requests')
            .send({ displayName: "Joe Shmoe" })
        expect(response.text).toBe("Cannot accept outgoing requests");
        expect(response.statusCode).toBe(400);
    })

    test('Accept a request to non-existing user', async () => {
        const response = await request(server)
            .put('/-1/requests')
            .send({ displayName: "Joe Shmoe" })
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Accept request with no account id', async () => {
        const response = await request(server)
            .put('/ /requests')
            .send({ displayName: "Joe Shmoe" })
        expect(response.text).toBe("No id provided");
        expect(response.statusCode).toBe(400);
    })

    test('Accept a request with no name', async () => {
        const response = await request(server)
            .put('/1/requests')
            .send()
        expect(response.text).toBe("No name provided");
        expect(response.statusCode).toBe(400);
    })

    test('Accept a request from empty string', async () => {
        const response = await request(server)
            .put('/1/requests')
            .send({ displayName: " " })
        expect(response.text).toBe("No name provided");
        expect(response.statusCode).toBe(400);
    })
})

describe('Manage Profile: Denying requests', () => {
    test('Deny an incoming request', async () => {
        con.query(`TRUNCATE friendships`, function (err) {
            if (err) throw err;
        })
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1234', '1', '0')`, function (err) {
            if (err) throw err;
        })
        John_Doe.friends = [];
        const response = await request(server)
            .delete('/1/requests/Doe John')
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Deny a request from a non-existing user', async () => {
        const response = await request(server)
            .delete('/1/requests/Nobody')
        expect(response.text).toBe("Account with name does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Deny a request that does not exist', async () => {
        const response = await request(server)
            .delete('/1/requests/Doe John')
        expect(response.text).toBe("No request from this user");
        expect(response.statusCode).toBe(404);
    })

    test('Deny a request from self', async () => {
        const response = await request(server)
            .delete('/1/requests/John Doe')
        expect(response.text).toBe("Cannot deny a request from self");
        expect(response.statusCode).toBe(400);
    })

    test('Deny a request from a friend', async () => {
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1', '1234', '1')`, function (err) {
            if (err) throw err;
        })
        const response = await request(server)
            .delete('/1/requests/Doe John')
        expect(response.text).toBe("Already friends with this user");
        expect(response.statusCode).toBe(400);
    })

    test('Deny an outgoing request', async () => {
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1', '2', '0')`, function (err) {
            if (err) throw err;
        })
        const response = await request(server)
            .delete('/1/requests/Joe Shmoe')
        expect(response.text).toBe("Cannot deny outgoing requests");
        expect(response.statusCode).toBe(400);
    })

    test('Deny a request to a non-existing user', async () => {
        const response = await request(server)
            .delete('/-1/requests/Joe Shmoe')
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Deny request with no account id', async () => {
        const response = await request(server)
            .delete('/ /requests/Joe Shmoe')
        expect(response.text).toBe("No id provided");
        expect(response.statusCode).toBe(400);
    })

    test('Deny a request from empty string', async () => {
        const response = await request(server)
            .delete('/1/requests/ /')
        expect(response.text).toBe("No name provided");
        expect(response.statusCode).toBe(400);
    })
})

describe('Manage Profile: Unlock locations', () => {
    test('Unlocking a new location', async () => {
        con.query(`TRUNCATE friendships`, function (err) {
            if (err) throw err;
        })
        const response = await request(server)
            .post('/1/locations')
            .send({ location_name: "Secret Spot" })
        John_Doe.unlockedLocations.push("Secret Spot")
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Unlocking a previously unlocked location', async () => {
        const response = await request(server)
            .post('/1/locations')
            .send({ location_name: "Secret Spot" })
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Unlocking a location with empty body', async () => {
        const response = await request(server)
            .post('/1/locations')
            .send({})
        expect(response.text).toBe("Location missing fields");
        expect(response.statusCode).toBe(400);
    })

    test('Unlocking a location for an invalid id', async () => {
        const response = await request(server)
            .post('/-1/locations')
            .send({ location_name: "Secret Spot" })
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Unlock location with no account id', async () => {
        const response = await request(server)
            .post('/ /locations')
            .send({ location_name: "Secret Spot" })
        expect(response.text).toBe("No id provided");
        expect(response.statusCode).toBe(400);
    })

    //Need to make pass
    test('Unlocking a location that does not exist', async () => {
        const response = await request(server)
            .post('/1/locations')
            .send({ location_name: "Fake Spot" })
        expect(response.text).toBe("Location does not exist");
        expect(response.statusCode).toBe(404);
    })
})

describe('Manage Profile: Unlock items', () => {
    test('Unlocking a new item', async () => {
        con.query(`TRUNCATE locations`, function (err) {
            if (err) throw err;
        })
        John_Doe.unlockedLocations = [];
        const response = await request(server)
            .post('/1/items')
            .send({ id: "1" })

        John_Doe.collection.items.push("1");
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Unlocking an item that was previously unlocked', async () => {
        const response = await request(server)
            .post('/1/items')
            .send({ id: "1" })
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Unlocking an item with empty body', async () => {
        const response = await request(server)
            .post('/1/items')
            .send({})
        expect(response.text).toBe("Item missing fields");
        expect(response.statusCode).toBe(400);
    })

    test('Unlocking an item for an invalid id', async () => {
        const response = await request(server)
            .post('/-1/items')
            .send({ id: "1" })
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Unlock item with no account id', async () => {
        const response = await request(server)
            .post('/ /items')
            .send({ id: "1" })
        expect(response.text).toBe("No id provided");
        expect(response.statusCode).toBe(400);
    })

    //Need to make pass
    test('Unlocking an item that does not exist', async () => {
        const response = await request(server)
            .post('/1/items')
            .send({ id: "-1" })
        expect(response.text).toBe("Item does not exist");
        expect(response.statusCode).toBe(404);
    })
})

describe('Manage Profile: Updating Achievements', () => {
    test('Updating a new achievement', async () => {
        con.query(`TRUNCATE items`, function (err) {
            if (err) throw err;
        })
        John_Doe.collection.items = [];
        const response = await request(server)
            .put('/1/achievements')
            .send(achievement)
        John_Doe.collection.achievements.push(achievement);
        John_Doe.score = 1;
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Updating a previously collected achievment', async () => {
        const response = await request(server)
            .put('/1/achievements')
            .send(achievement)
        John_Doe.score = 2;
        John_Doe.collection.achievements[0].points = 2;
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Updating an achievement with empty body', async () => {
        const response = await request(server)
            .put('/1/achievements')
            .send({})
        expect(response.text).toBe("Achievement missing fields");
        expect(response.statusCode).toBe(400);
    })

    test('Updating an achievement for an invalid id', async () => {
        const response = await request(server)
            .put('/-1/achievements')
            .send(achievement)
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Updating an achievement with no account id', async () => {
        const response = await request(server)
            .put('/ /achievements')
            .send(achievement)
        expect(response.text).toBe("No id provided");
        expect(response.statusCode).toBe(400);
    })

    //Need to make pass
    test('Updating an achievement that does not exist', async () => {
        const response = await request(server)
            .put('/1/achievements')
            .send(fake_achievement)
        expect(response.text).toBe("Achievement does not exist");
        expect(response.statusCode).toBe(404);
    })
})

describe('Manage profile: Getting account', () => {
    test('Get existing account', async () => {
        const response = await request(server)
            .get('/2')
        expect(response.body).toMatchObject(Joe_Shmoe);
        expect(response.statusCode).toBe(200);
    })

    test('Get non-existing account', async () => {
        const response = await request(server)
            .get('/-1')
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('Get no id', async () => {
        const response = await request(server)
            .get('/ /')
        expect(response.text).toBe("No id provided");
        expect(response.statusCode).toBe(400);
    })
})

afterAll(() => {
    con.end();
    server.close();
})
