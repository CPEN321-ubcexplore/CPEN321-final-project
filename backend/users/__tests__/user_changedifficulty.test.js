const request = require("supertest");
const { con, server } = require("../users_server");
var { John_Doe } = require("../test_vars");

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
})

describe('Change difficulty', () => {
    test('New difficulty', async () => {
        const response = await request(server)
            .put('/1/difficulty')
            .send({ difficulty: "Medium" })

        John_Doe.difficulty = "Medium";
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Same difficulty', async () => {
        const response = await request(server)
            .put('/1/difficulty')
            .send({ difficulty: "Medium" })
        expect(response.body).toMatchObject(John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Invalid difficulty', async () => {
        const response = await request(server)
            .put('/1/difficulty')
            .send({ difficulty: "Impossible" })

        expect(response.text).toBe("Invalid difficulty");
        expect(response.statusCode).toBe(400);
    })

    test('No difficulty', async () => {
        const response = await request(server)
            .put('/1/difficulty')
            .send({})
        expect(response.text).toBe("No difficulty provided");
        expect(response.statusCode).toBe(400);
    })

    test('User does not exist', async () => {
        const response = await request(server)
            .put('/-1/difficulty')
            .send({ difficulty: "Medium" })
        expect(response.text).toBe("Account with id does not exist");
        expect(response.statusCode).toBe(404);
    })

    test('No account id', async () => {
        const response = await request(server)
            .put('/ /difficulty')
            .send({ difficulty: "Medium" })
        expect(response.text).toBe("No id provided");
        expect(response.statusCode).toBe(400);
    })
})

afterAll(() => {
    con.end();
    server.close();
})