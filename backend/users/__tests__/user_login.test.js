const request = require("supertest");
const { con, server } = require("../users_server");
var { Real_John_Doe } = require("../test_vars");

const { OAuth2Client } = require('google-auth-library');

var test_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA3NGI5MjhlZGY2NWE2ZjQ3MGM3MWIwYTI0N2JkMGY3YTRjOWNjYmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyMzk2MzM1MTU1MTEtOWc5cDRrZHFjdm5ucm5qcTI4dXNrYmV0amNoNmUybmMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyMzk2MzM1MTU1MTEtOWc5cDRrZHFjdm5ucm5qcTI4dXNrYmV0amNoNmUybmMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI4NTMyNDkwMTE2MTQxNTEyNTIiLCJlbWFpbCI6ImR5bGFucGl0aGVydGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IkJsVDM3aC1jOWZhbXlUMXVjeTVQTVEiLCJuYW1lIjoiSm9obiBEb2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUl0YnZtbU0tLTBoVEFNTm05SG1TZzFsdmh2WTNTUnFXNXZhWHVkWlo0amg9czk2LWMiLCJnaXZlbl9uYW1lIjoiSm9obiIsImZhbWlseV9uYW1lIjoiRG9lIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2NTkyMjEyMzYsImV4cCI6MTY1OTIyNDgzNn0.S7uo_YlvB7cAbYm-WmAoc23SZLnOTnXLKNCElD2hJwTfzJ1QZPd5SLKOG-HWOvfzy1K6Uo8xzznYuvHDy2zEHZOzsCmkQ6Khd7hnx7Sk3Cix8qY5Qcb9yzUfOZZSqct8pG0APBDcA_27gmqcvpZdQM6f_YKMkbFdaZNJj2ncDZBcPGhzSseD2wiOimbAHlMiJbJFjqyILayQFrALj6woGkvomC9rAadO6no_Lg8c975udKyzq82eB-g_qvzFYcnYs8KSPx50kDDNO-3ueE_1panezRD9qF8atHGTmLYzGwBECuoEEmd7Pws7wUllno4_eoCeo38IR_B9jpuaYSjmSg";
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