const request = require("supertest");
const { con, server } = require("../users_server");
var { Real_John_Doe } = require("../test_vars");

var test_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA3NGI5MjhlZGY2NWE2ZjQ3MGM3MWIwYTI0N2JkMGY3YTRjOWNjYmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MjM3MTk4NjgyMjgtMDFlNm9mdjZsZjU5bTQycGswNG1laHY4dDRxYjZiZ2wuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MjM3MTk4NjgyMjgtMDFlNm9mdjZsZjU5bTQycGswNG1laHY4dDRxYjZiZ2wuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI4NTMyNDkwMTE2MTQxNTEyNTIiLCJlbWFpbCI6ImR5bGFucGl0aGVydGVzdEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Im4zNkhTeV96TE5DdUN3WDFfUEloaUEiLCJuYW1lIjoiSm9obiBEb2UiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUl0YnZtbU0tLTBoVEFNTm05SG1TZzFsdmh2WTNTUnFXNXZhWHVkWlo0amg9czk2LWMiLCJnaXZlbl9uYW1lIjoiSm9obiIsImZhbWlseV9uYW1lIjoiRG9lIiwibG9jYWxlIjoiZW4iLCJpYXQiOjE2NTkxNzQ3MDUsImV4cCI6MTY1OTE3ODMwNX0.qoAercsJjvGhNIIa63SULyEhkNQ0Mf80hgb1_LOzY3-jWUZRW-EyBw4-E3nuDD6NzS-tJ05T9gGpEbLdQV_o_SHhRrD4elpH3FTD17j0M14UsUvbruSwWTNuoJpnKoofJt_j2U7erANUqxBIC-UCJF5MLK6oMkN-tJJ88icF9-Tlhi7J0cI-nOu6EVzV-JpcWSmzg4qVNLKBCywck-DYueunJYNkWvj-EMTXRb3rfn54l9CC4IkWsE8WWc9HK1HOiiN61oeZEcTkg3ecZBLJgjQjWYPLy1aq5hcAKbGMYGA-SlX_Xm7CZTnDu-OP3GyC41nY73NTFcoRXK0muWfoeQ";
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