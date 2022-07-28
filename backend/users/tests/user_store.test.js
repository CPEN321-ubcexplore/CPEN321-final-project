const { con, server, UserAccount, findByName, findById, login, createAccount } = require("../users_server");
const mysql = require('mysql');
const { Server } = require("socket.io");

//Accounts for comparison
var JohnDoe = {
    displayName: "John Doe",
    score: 0,
    difficulty: "Easy",
    leaderboardParticipant: 0,
    incomingRequests: [],
    outgoingRequests: [],
    friends: [],
    collection: { achievements: [], items: [] },
    unlockedLocations: [],
    id: "1"
};

var DoeJohn = {
    displayName: "Doe John",
    score: 0,
    difficulty: "Easy",
    leaderboardParticipant: 0,
    incomingRequests: [],
    outgoingRequests: [],
    friends: [],
    collection: { achievements: [], items: [] },
    unlockedLocations: [],
    id: "1234"
};
//Setup test db
beforeAll(async () => {
    con.query("USE testusersdb", function (err, result) {
        if (err) throw err;
        console.log("Using testusersdb.");
    });
    con.query("TRUNCATE TABLE useraccounts", function (err) {
        if (err) throw err;
    });
    con.query(`CALL createAccount(?,?)`, ["1", "John Doe"], function (err) {
        if (err) throw err;
    });
})

test('findByName: Account name exists', async () => {
    const account = await findByName("John Doe");
    expect(account).toMatchObject(JohnDoe);
});

test('findByName: Account name does not exist', async () => {
    await con.query(`DELETE FROM useraccounts WHERE user_id = 1234`);
    expect.assertions(1);
    try {
        await findByName("Doe John");
    } catch (err) {
        expect(err).toEqual(new Error("Account does not exist"));
    }
});

test('findByName: Empty string', async () => {
    expect.assertions(1);
    try {
        await findByName(" ");
    } catch (err) {
        expect(err).toEqual(new Error("No name provided"));
    }
});

test('findByName: Name undefined', async () => {
    expect.assertions(1);
    try {
        await findByName(undefined);
    } catch (err) {
        expect(err).toEqual(new Error("No name provided"));
    }
});

test('findByName: SQL Injection', async () => {
    expect.assertions(1);
    try {
        await findByName("Test\' OR \' 1 = 1");
    } catch (err) {
        expect(err).toEqual(new Error("Account does not exist"));
    }
});

test('findById: Account id exists', async () => {
    const account = await findById("1");
    expect(account).toMatchObject(JohnDoe);
});

test('findById: Account id does not exist', async () => {
    await con.query(`DELETE FROM useraccounts WHERE user_id = -1`);
    expect.assertions(1);
    try {
        await findById("-1");
    } catch (err) {
        expect(err).toEqual(new Error("Account does not exist"));
    }
});

test('findById: Empty string', async () => {
    expect.assertions(1);
    try {
        await findById(" ");
    } catch (err) {
        expect(err).toEqual(new Error("No id provided"));
    }
});

test('findById: Id undefined', async () => {
    expect.assertions(1);
    try {
        await findById(undefined);
    } catch (err) {
        expect(err).toEqual(new Error("No id provided"));
    }
});

test('findById: SQL Injection', async () => {
    expect.assertions(1);
    try {
        await findById("123\' OR \' 1 = 1");
    } catch (err) {
        expect(err).toEqual(new Error("Account does not exist"));
    }
});

test('login: Successful login', async () => {
    const account = await login({ sub: "1", name: "John Doe" })
    expect(account).toMatchObject(JohnDoe);
});

test('login: Successful login of new account', async () => {
    await con.query(`DELETE FROM useraccounts WHERE user_id = 1234`);
    const account = await login({ sub: "1234", name: "Doe John" })
    expect(account).toMatchObject(DoeJohn);
});

test('login: No id', async () => {
    expect.assertions(1);
    try {
        await login({ name: "Doe John" })
    } catch (err) {
        expect(err).toEqual(new Error("No id provided"));
    }
});

test('login: No name new account', async () => {
    expect.assertions(1);
    await con.query(`DELETE FROM useraccounts WHERE user_id = 1234`);
    try {
        await login({ sub: "1234" })
    } catch (err) {
        expect(err).toEqual(new Error("No name provided"));
    }
});

test('login: Invalid id', async () => {
    expect.assertions(1);
    try {
        await login({ sub: "abc", name: "Doe John" })
    } catch (err) {
        expect(err).toEqual(new Error("Invalid id"));
    }
});

afterAll(async () => {
    con.end();
    server.close();
})