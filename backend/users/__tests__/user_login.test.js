const request = require("supertest");
const { con, server } = require("../users_server");
var { Real_John_Doe } = require("../test_vars");
const axios = require("axios");

var test_token;
const fake_token = "abc123";

const { CLIENT_SECRET } = require("../keys");
const CLIENT_ID = "239633515511-9g9p4kdqcvnnrnjq28uskbetjch6e2nc.apps.googleusercontent.com";
const REFRESH_TOKEN = "1//04KczeSbwVEinCgYIARAAGAQSNwF-L9Ir_Y7JjbuSChE5rHaXbnwPsDKJvpQ41htmlphXp1qd9LFg0HXcCDuHUzWPcfE83g47KmI";
const refresh_token_url = "https://www.googleapis.com/oauth2/v4/token";
const refresh_token_body = "client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&grant_type=refresh_token&refresh_token=" + REFRESH_TOKEN;

beforeAll(async () => {
    //Get test_token
    try {
        const refresh_res = await axios.post(refresh_token_url, refresh_token_body);
        console.log(refresh_res.data);
        test_token = refresh_res.data.id_token;
    } catch (err) {
        console.log(err);
    }

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
        con.query("TRUNCATE useraccounts", function (err) {
            if (err) throw err;
        });
        con.query(`INSERT INTO useraccounts (user_id, displayName) VALUES ('102853249011614151252', 'John Doe')`, function (err) {
            if (err) throw err;
        });
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