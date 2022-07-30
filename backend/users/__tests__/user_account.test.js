const { con, server, UserAccount } = require("../users_server");
var { John_Doe } = require("../test_vars");
const { achievement, fake_achievement, friend_leaderboard } = require("../test_vars");
var account = new UserAccount("1", "John Doe");


beforeAll(() => {
    con.query("USE testusersdb", function (err, result) {
        if (err) throw err;
        console.log("Using testusersdb.");
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

    con.query(`INSERT INTO useraccounts (user_id, displayName, leaderboardParticipant) VALUES ('1', 'John Doe', '0')`, function (err) {
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

describe('participateInLeaderboard', () => {
    test('User not participating in leaderboard', async () => {
        account = await account.participateInLeaderboard();
        John_Doe.leaderboardParticipant = 1;
        expect(account).toMatchObject(John_Doe);
    });

    test('User already participating in leaderboard', async () => {
        account = await account.participateInLeaderboard();
        expect(account).toMatchObject(John_Doe);
    });
})

describe('changeDifficulty', () => {
    test('Change to different difficulty', async () => {
        account = new UserAccount("1", "John Doe");
        John_Doe.leaderboardParticipant = 0;
        account = await account.changeDifficulty("Medium");
        John_Doe.difficulty = "Medium";
        expect(account).toMatchObject(John_Doe);
    });

    test('Change to same difficulty', async () => {
        account = await account.changeDifficulty("Medium");
        expect(account).toMatchObject(John_Doe);
    });

    test('Invalid difficulty', async () => {
        expect.assertions(1);
        try {
            await account.changeDifficulty("Impossible");
        } catch (err) {
            expect(err).toEqual(new Error("Invalid difficulty"));
        }
    });
})


describe('unlockLocation', () => {
    test('New location', async () => {
        account = new UserAccount("1", "John Doe");
        John_Doe.difficulty = "Easy";
        account = await account.unlockLocation({ location_name: "Super secret spot" })
        John_Doe.unlockedLocations.push("Super secret spot");
        expect(account).toMatchObject(John_Doe);
    })

    test('Already unlocked location', async () => {
        account = await account.unlockLocation({ location_name: "Super secret spot" })
        expect(account).toMatchObject(John_Doe);
    })

    test('Location with no name', async () => {
        expect.assertions(1);
        try {
            await account.unlockLocation({});
        } catch (err) {
            expect(err).toEqual(new Error("Location missing fields"));
        }
    })

    test('Location undefined', async () => {
        expect.assertions(1);
        try {
            await account.unlockLocation(undefined);
        } catch (err) {
            expect(err).toEqual(new Error("No location provided"));
        }
    })

    //Need to make pass
    test('Location that does not exist', async () => {
        expect.assertions(1);
        try {
            await account.unlockLocation({ location_name: "Fake spot" })
        } catch (err) {
            expect(err).toEqual(new Error("Location does not exist"));
        }
    })
})

describe('unlockItem', () => {
    test('New item', async () => {
        con.query("TRUNCATE locations", function (err) {
            if (err) throw err;
        });
        account = new UserAccount("1", "John Doe");
        John_Doe.unlockedLocations = [];
        account = await account.unlockItem({ id: 1 });
        John_Doe.collection.items.push(1);
        expect(account).toMatchObject(John_Doe);
    })

    test('Already unlocked item', async () => {
        account = await account.unlockItem({ id: 1 });
        expect(account).toMatchObject(John_Doe);
    })

    test('Item with no id', async () => {
        expect.assertions(1);
        try {
            await account.unlockItem({});
        } catch (err) {
            expect(err).toEqual(new Error("Item missing fields"));
        }
    })

    test('Item undefined', async () => {
        expect.assertions(1);
        try {
            await account.unlockItem(undefined);
        } catch (err) {
            expect(err).toEqual(new Error("No item provided"));
        }
    })

    //Need to make pass
    test('Item that does not exist', async () => {
        expect.assertions(1);
        try {
            await account.unlockItem({ id: -1 });
        } catch (err) {
            expect(err).toEqual(new Error("Item does not exist"));
        }
    })
})

describe('updateAchievements', () => {
    test('New achievement', async () => {
        con.query("TRUNCATE items", function (err) {
            if (err) throw err;
        });
        account = new UserAccount("1", "John Doe");
        John_Doe.collection.items = [];
        account = await account.updateAchievements(achievement);
        John_Doe.collection.achievements.push(achievement);
        John_Doe.score = 1;
        expect(account).toMatchObject(John_Doe);
    })

    test('Update achievement', async () => {
        account = await account.updateAchievements(achievement);
        John_Doe.collection.achievements[0].points = 2;
        John_Doe.score = 2;
        expect(account).toMatchObject(John_Doe);
    })

    test('Achievement with missing fields', async () => {
        expect.assertions(1);
        try {
            await account.updateAchievements({});
        } catch (err) {
            expect(err).toEqual(new Error("Achievement missing fields"));
        }
    })

    test('Achievement undefined', async () => {
        expect.assertions(1);
        try {
            await account.updateAchievements(undefined);
        } catch (err) {
            expect(err).toEqual(new Error("No achievement provided"));
        }
    })

    //Need to make pass
    test('Achievement that does not exist', async () => {
        expect.assertions(1);
        try {
            await account.updateAchievements(fake_achievement);
        } catch (err) {
            expect(err).toEqual(new Error("Achievement does not exist"));
        }
    })
})

describe('getFriendsLeaderboard', () => {
    test('Account with no friends', async () => {
        con.query("TRUNCATE achievements", function (err) {
            if (err) throw err;
        });
        account = new UserAccount("1", "John Doe");
        var leaderboard = await account.getFriendLeaderboard();
        expect(leaderboard).toMatchObject([]);
    })

    test('Account with friends but none participating', async () => {
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1', '21', '1')`, function (err) {
            if (err) throw err;
        });
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1', '22', '1')`, function (err) {
            if (err) throw err;
        });
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1', '23', '1')`, function (err) {
            if (err) throw err;
        });
        var leaderboard = await account.getFriendLeaderboard();
        expect(leaderboard).toMatchObject([]);
    })

    test('Account with friends that are participating', async () => {
        con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 21`, function (err) {
            if (err) throw err;
        });
        con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 22`, function (err) {
            if (err) throw err;
        });
        con.query(`UPDATE useraccounts SET leaderboardParticipant = 1 WHERE user_id = 23`, function (err) {
            if (err) throw err;
        });
        var leaderboard = await account.getFriendLeaderboard();
        expect(leaderboard).toMatchObject(friend_leaderboard);
    })
})


// test('addFriend: Successful add', async () => {
//     jest.mock()
//     await account.addFriend("Johnny Doe");
//     console.log(account);
// });


afterAll(() => {
    con.end();
    server.close();
})