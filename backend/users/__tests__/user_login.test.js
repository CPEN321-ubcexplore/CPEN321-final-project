const request = require("supertest");
const { con, server } = require("../users_server");
var { Real_John_Doe } = require("../test_vars");
var test_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE1NDllMGFlZjU3NGQxYzdiZGQxMzZjMjAyYjhkMjkwNTgwYjE2NWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMzk2MzM1MTU1MTEtOWc5cDRrZHFjdm5ucm5qcTI4dXNrYmV0amNoNmUybmMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMzk2MzM1MTU1MTEtOWc5cDRrZHFjdm5ucm5qcTI4dXNrYmV0amNoNmUybmMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI4NTMyNDkwMTE2MTQxNTEyNTIiLCJlbWFpbCI6ImR5bGFucGl0aGVydGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImNYQXhYVm40VkRYOW1XdVhKMVRNZ1EiLCJuYW1lIjoiSm9obiBEb2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUl0YnZtbU0tLTBoVEFNTm05SG1TZzFsdmh2WTNTUnFXNXZhWHVkWlo0amg9czk2LWMiLCJnaXZlbl9uYW1lIjoiSm9obiIsImZhbWlseV9uYW1lIjoiRG9lIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2NTkyMjgxMjcsImV4cCI6MTY1OTIzMTcyN30.akoEDZuBd4XeXQvSlgVGjaVHESkhuPmk6FXLKj82MD5RrZ1ctUpodQiZgf0PY_YjUdcXJo9WBKBGdS_qAZEVx9b8re5OFOaRrP4dADQsU5hIT1ASYjnIYQXc-eQ_NT-fVDYKfTplB2JwkSAYFZxPjpxdqQN5elQvrHr9LaE1vZGeMD4IO2RAV9pA6Wd5vM46mD9cGoThO3cQG0Qi1r6B7niu6-yX5e7aV5XsbZ3maqq0hE2jyfH65j5NYODBMPtTybf48NGE684RuP-tBdqiKGe-xpFyJP620pqdBO8S9Cg9OB_ryuRt_tYLVV2PGBc1km_njCEdL1E2WNsuJbfcEw";
const fake_token = "abc123";

beforeAll(async () => { 
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
})

describe('Login', () => {
    test('Login new account', async () => {
        const response = await request(server)
            .post('/login')
            .send({ token: test_token });

        expect(response.body).toMatchObject(Real_John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Login account exists', async () => {
        const response = await request(server)
            .post('/login')
            .send({ token: test_token });

        expect(response.body).toMatchObject(Real_John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Login account name taken', async () => {
        con.query("TRUNCATE useraccounts", function (err) {
            if (err) throw err;
        });
        con.query(`INSERT INTO useraccounts (user_id, displayName) VALUES ('1', 'John Doe')`, function (err) {
            if (err) throw err;
        });
        const response = await request(server)
            .post('/login')
            .send({ token: test_token });
        Real_John_Doe.displayName = "John Doe1"
        expect(response.body).toMatchObject(Real_John_Doe);
        expect(response.statusCode).toBe(200);
    })

    test('Login no token', async () => {
        const response = await request(server)
            .post('/login')
            .send({});

        expect(response.text).toBe("No token provided");
        expect(response.statusCode).toBe(400);
    })

    test('Login invalid token', async () => {
        const response = await request(server)
            .post('/login')
            .send({ token: fake_token });

        expect(response.statusCode).toBe(500);
    })
})

afterAll(() => {
    con.end();
    server.close();
})