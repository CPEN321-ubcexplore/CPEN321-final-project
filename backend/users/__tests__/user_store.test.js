const { con, server, findByName, findById, login, createAccount, getGlobalLeaderboard } = require("../users_server");

var { John_Doe, Doe_John, John_Doe1 } = require("../test_vars");
const { global_leaderboard } = require("../test_vars");

//Setup test db
beforeAll(() => {
    con.query("USE testusersdb", function (err, result) {
        if (err) throw err;
        console.log("Using testusersdb.");
    });
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

describe('findByName', () => {
    test('Account name exists', async () => {
        con.query(`INSERT INTO useraccounts (user_id, displayName) VALUES ('1', 'John Doe')`, function (err) {
            if (err) throw err;
        });
        con.query(`INSERT INTO items (user_id, item_id) VALUES ('1', '1')`, function (err) {
            if (err) throw err;
        });
    
        con.query(`INSERT INTO locations (user_id, LocationName) VALUES ('1', 'Super Secret Spot')`, function (err) {
            if (err) throw err;
        });
    
        John_Doe.collection.items.push('1');
        John_Doe.unlockedLocations.push("Super Secret Spot")
        const account = await findByName("John Doe");
        expect(account).toMatchObject(John_Doe);
    });

    test('Account name does not exist', async () => {
        con.query(`DELETE FROM useraccounts WHERE user_id = 1234`), function (err) {
            if (err) throw err;
        };
        expect.assertions(1);
        try {
            await findByName("Doe John");
        } catch (err) {
            expect(err).toEqual(new Error("Account with name does not exist"));
        }
    });

    test('Empty string', async () => {
        expect.assertions(1);
        try {
            await findByName(" ");
        } catch (err) {
            expect(err).toEqual(new Error("No name provided"));
        }
    });

    test('Name undefined', async () => {
        expect.assertions(1);
        try {
            await findByName(undefined);
        } catch (err) {
            expect(err).toEqual(new Error("No name provided"));
        }
    });

    test('SQL Injection', async () => {
        expect.assertions(1);
        try {
            await findByName("Test\' OR \' 1 = 1");
        } catch (err) {
            expect(err).toEqual(new Error("Account with name does not exist"));
        }
    });
})

describe('findById', () => {
    test('Account id exists', async () => {
        const account = await findById("1");
        expect(account).toMatchObject(John_Doe);
    });

    test('Account id does not exist', async () => {
        con.query(`DELETE FROM useraccounts WHERE user_id = -1`, function (err) {
            if (err) throw err;
        });
        expect.assertions(1);
        try {
            await findById("-1");
        } catch (err) {
            expect(err).toEqual(new Error("Account with id does not exist"));
        }
    });

    test('Empty string', async () => {
        expect.assertions(1);
        try {
            await findById(" ");
        } catch (err) {
            expect(err).toEqual(new Error("No id provided"));
        }
    });

    test('Id undefined', async () => {
        expect.assertions(1);
        try {
            await findById(undefined);
        } catch (err) {
            expect(err).toEqual(new Error("No id provided"));
        }
    });

    test('SQL Injection', async () => {
        expect.assertions(1);
        try {
            await findById("123\' OR \' 1 = 1");
        } catch (err) {
            expect(err).toEqual(new Error("Account with id does not exist"));
        }
    });
})

describe('login', () => {
    test('Successful login', async () => {
        const account = await login({ sub: "1", name: "John Doe" })
        expect(account).toMatchObject(John_Doe);
    });

    test('Successful login of existing account with no name', async () => {
        const account = await login({ sub: "1"})
        expect(account).toMatchObject(John_Doe);
    });

    test('Successful login of new account', async () => {
        con.query(`DELETE FROM useraccounts WHERE user_id = 1234`, function (err) {
            if (err) throw err;
        });
        const account = await login({ sub: "1234", name: "Doe John" })
        expect(account).toMatchObject(Doe_John);
    });

    test('No id', async () => {
        expect.assertions(1);
        try {
            await login({ name: "Doe John" })
        } catch (err) {
            expect(err).toEqual(new Error("No id provided"));
        }
    });

    test('No name new account', async () => {
        expect.assertions(1);
        con.query(`DELETE FROM useraccounts WHERE user_id = 1234`, function (err) {
            if (err) throw err;
        });
        try {
            await login({ sub: "1234" })
        } catch (err) {
            expect(err).toEqual(new Error("No name provided"));
        }
    });

    test('Invalid id', async () => {
        expect.assertions(1);
        try {
            await login({ sub: "abc", name: "Doe John" })
        } catch (err) {
            expect(err).toEqual(new Error("Invalid id"));
        }
    });
})

describe('createAccount', () => {
    test('Successful creation', async () => {
        con.query(`DELETE FROM useraccounts WHERE user_id = 1234`, function (err) {
            if (err) throw err;
        });
        const account = await createAccount({ sub: "1234", name: "Doe John" })
        expect(account).toMatchObject(Doe_John);
    });

    test('Successful creation with existing name', async () => {
        const account = await createAccount({ sub: "12345", name: "John Doe" })
        expect(account).toMatchObject(John_Doe1);
    });

    test('Account with id exists', async () => {
        try {
            await createAccount({ sub: "1", name: "Johnny Doe" })
        } catch (err) {
            expect(err).toEqual(new Error("Account with id already exists"))
        }
    });

    test('No id', async () => {
        try {
            await createAccount({ name: "Doe John" })
        } catch (err) {
            expect(err).toEqual(new Error("No id provided"))
        }
    });

    test('No name', async () => {
        try {
            await createAccount({ sub: "1234" })
        } catch (err) {
            expect(err).toEqual(new Error("No name provided"))
        }
    });

    test('Invalid id', async () => {
        try {
            await createAccount({ sub: "abc" })
        } catch (err) {
            expect(err).toEqual(new Error("No name provided"))
        }
    });
})

describe('getGlobalLeaderboard', () => {
    test('No users', async () => {
        con.query("TRUNCATE useraccounts", function (err) {
            if (err) throw err;
        });
        const leaderboard = await getGlobalLeaderboard();
        expect(leaderboard).toEqual([]);
    });

    test('No participants', async () => {
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

    test('With participants', async () => {
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
        expect(leaderboard).toEqual(global_leaderboard);
    });
})

afterAll(() => {
    con.end();
    server.close();
})