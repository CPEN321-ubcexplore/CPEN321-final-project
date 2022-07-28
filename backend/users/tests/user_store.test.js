const { con, server, findByName, findById, login, createAccount, getGlobalLeaderboard } = require("../users_server");

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

var JohnDoe1 = {
    displayName: "John Doe1",
    score: 0,
    difficulty: "Easy",
    leaderboardParticipant: 0,
    incomingRequests: [],
    outgoingRequests: [],
    friends: [],
    collection: { achievements: [], items: [] },
    unlockedLocations: [],
    id: "12345"
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

var expected_leaderboard = [{ displayName: "JohnDoe1", score: 20 }, { displayName: "JohnDoe2", score: 10 }, { displayName: "JohnDoe3", score: 5 }];
//Setup test db
beforeAll(async () => {
    con.query("USE testusersdb", function (err, result) {
        if (err) throw err;
        console.log("Using testusersdb.");
    });
    con.query("TRUNCATE TABLE useraccounts", function (err) {
        if (err) throw err;
    });
})

test('findByName: Account name exists', async () => {
    con.query(`INSERT INTO useraccounts (user_id, displayName) VALUES ('1', 'John Doe')`, function (err) {
        if (err) throw err;
    });
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

test('createAccount: Successful creation', async () => {
    await con.query(`DELETE FROM useraccounts WHERE user_id = 1234`);
    const account = await createAccount({ sub: "1234", name: "Doe John" })
    expect(account).toMatchObject(DoeJohn);
});

test('createAccount: Successful creation with existing name', async () => {
    const account = await createAccount({ sub: "12345", name: "John Doe" })
    expect(account).toMatchObject(JohnDoe1);
});

test('createAccount: Account with id exists', async () => {
    try {
        await createAccount({ sub: "1", name: "Johnny Doe" })
    } catch (err) {
        expect(err).toEqual(new Error("Account with id already exists"))
    }
});

test('createAccount: No id', async () => {
    try {
        await createAccount({ name: "Doe John" })
    } catch (err) {
        expect(err).toEqual(new Error("No id provided"))
    }
});

test('createAccount: No name', async () => {
    try {
        await createAccount({ sub: "1234" })
    } catch (err) {
        expect(err).toEqual(new Error("No name provided"))
    }
});

test('createAccount: Invalid id', async () => {
    try {
        await createAccount({ sub: "abc" })
    } catch (err) {
        expect(err).toEqual(new Error("No name provided"))
    }
});

test('getGlobalLeaderboard: No users', async () => {
    con.query("TRUNCATE TABLE useraccounts", function (err) {
        if (err) throw err;
    });
    const leaderboard = await getGlobalLeaderboard();
    expect(leaderboard).toEqual([]);
});

test('getGlobalLeaderboard: No participants', async () => {
    con.query(`INSERT INTO useraccounts (user_id, displayName, score) VALUES ('11', 'JohnDoe1', '20')`, function (err) {
        if (err) throw err;
    });
    con.query(`INSERT INTO useraccounts (user_id, displayName, score) VALUES ('12', 'JohnDoe2', '10')`, function (err) {
        if (err) throw err;
    });
    con.query(`INSERT INTO useraccounts (user_id, displayName, score) VALUES ('13', 'JohnDoe3', '5')`, function (err) {
        if (err) throw err;
    });
    const leaderboard = await getGlobalLeaderboard();
    expect(leaderboard).toEqual([]);
});

test('getGlobalLeaderboard: With participants', async () => {
    con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 11`, function (err) {
        if (err) throw err;
    });
    con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 12`, function (err) {
        if (err) throw err;
    });
    con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 13`, function (err) {
        if (err) throw err;
    });
    const leaderboard = await getGlobalLeaderboard();
    expect(leaderboard).toEqual(expected_leaderboard);
});



afterAll(async () => {
    con.end();
    server.close();
})