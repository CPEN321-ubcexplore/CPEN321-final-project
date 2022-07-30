const request = require("supertest");
const { con, server } = require("../users_server");
var { John_Doe } = require("./test_vars");
const { global_leaderboard, friend_leaderboard } = require("./test_vars");
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
    con.query(`INSERT INTO useraccounts (user_id, displayName, score) VALUES ('11', 'JohnDoe1', '20')`, function (err) {
        if (err) throw err;
    });
    con.query(`INSERT INTO useraccounts (user_id, displayName, score) VALUES ('12', 'JohnDoe2', '10')`, function (err) {
        if (err) throw err;
    });
    con.query(`INSERT INTO useraccounts (user_id, displayName, score) VALUES ('13', 'JohnDoe3', '5')`, function (err) {
        if (err) throw err;
    });

    con.query(`INSERT INTO useraccounts (user_id, displayName, score) VALUES ('21', 'Friend1', '6')`, function (err) {
        if (err) throw err;
    });
    con.query(`INSERT INTO useraccounts (user_id, displayName, score) VALUES ('22', 'Friend2', '5')`, function (err) {
        if (err) throw err;
    });
    con.query(`INSERT INTO useraccounts (user_id, displayName, score) VALUES ('23', 'Friend3', '7')`, function (err) {
        if (err) throw err;
    });
})

describe('Leaderboards: View global leaderboard', () => {
    test('View global leaderboard with no participants', async () => {
        const response = await request(server)
            .get('/leaderboard')
        expect(response.body).toMatchObject([]);
        expect(response.statusCode).toBe(200);
    })

    test('View global leaderboard with participants', async () => {
        con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 11`, function (err) {
            if (err) throw err;
        });
        con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 12`, function (err) {
            if (err) throw err;
        });
        con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 13`, function (err) {
            if (err) throw err;
        });
        const response = await request(server)
            .get('/leaderboard')
        expect(response.body).toMatchObject(global_leaderboard);
        expect(response.statusCode).toBe(200);
    })
})

describe('Leaderboards: View friend leaderboard', () => {
    test('View friend leaderboard with no friends', async () => {
        const response = await request(server)
            .get('/1/leaderboard')
        expect(response.body).toMatchObject([]);
        expect(response.statusCode).toBe(200);
    })

    test('View friend leaderboard with friends participating', async () => {
        con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 21`, function (err) {
            if (err) throw err;
        });
        con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 22`, function (err) {
            if (err) throw err;
        });
        con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 23`, function (err) {
            if (err) throw err;
        });
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1', '21', '1')`, function (err) {
            if (err) throw err;
        });
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1', '22', '1')`, function (err) {
            if (err) throw err;
        });
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1', '23', '1')`, function (err) {
            if (err) throw err;
        });
        const response = await request(server)
            .get('/1/leaderboard')
        expect(response.body).toMatchObject(friend_leaderboard);
        expect(response.statusCode).toBe(200);
    })

    test('View friend leaderboard of non-existing user', async () => {
        const response = await request(server)
            .get('/-1/leaderboard')
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })
})

describe('Leaderboards: Participate in leaderboard', () => {
    test('User not participating in leaderboard', async () => {
        con.query("TRUNCATE friendships", function (err) {
            if (err) throw err;
        });
        const response = await request(server)
            .put('/1/participateInLeaderboard')
        John_Doe.leaderboardParticipant = 1;
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('User not already participating in leaderboard', async () => {
        const response = await request(server)
            .put('/1/participateInLeaderboard')
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Invalid user', async () => {
        const response = await request(server)
            .put('/-1/participateInLeaderboard')
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })
})

afterAll(() => {
    con.end();
    server.close();
})