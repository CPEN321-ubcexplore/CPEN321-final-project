const { con, server, UserAccount } = require("../users_server");
const { con: loc_con, socket_server } = require("../../world/locations_server");
var { John_Doe } = require("../test_vars");
const { achievement, fake_achievement, friend_leaderboard } = require("../test_vars");
var account = new UserAccount("1", "John Doe");

jest.mock("../../world/locations_server", () => {
    const original = jest.requireActual("../../world/locations_server");
    var result = Object.assign({},original);
    result.getLocationsByParameters = jest.fn().mockImplementation((location_name) => {
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                if (location_name == 'Super secret spot') {
                    resolve([{
                        location_name: 'Super secret spott',
                        coordinate_latitude: 0,
                        coordinate_longitude: 0,
                        fun_facts: 'None',
                        related_links: 'None',
                        about: 'None',
                        image_url: 'None',
                        access_permission: 'PRIVATE'
                    }]);
                }
                else {
                    resolve([]);
                }
            })
        })
    })
    return result;
});

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

    con.query("TRUNCATE achievementlist", function (err) {
        if (err) throw err;
    });

    con.query("TRUNCATE locations", function (err) {
        if (err) throw err;
    });

    con.query(`INSERT INTO useraccounts (user_id, displayName) VALUES ('1', 'John Doe')`, function (err) {
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
        John_Doe.leaderboardParticipant = 0;
    });
})

describe('changeDifficulty', () => {
    test('Change to different difficulty', async () => {
        con.query(`REPLACE INTO useraccounts (user_id, displayName) VALUES ('1', 'John Doe')`, function (err) {
            if (err) throw err;
        });
        account = new UserAccount("1", "John Doe");
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
        John_Doe.difficulty = "Easy";
    });

    test('Undefined difficulty', async () => {
        expect.assertions(1);
        try {
            await account.changeDifficulty(undefined);
        } catch (err) {
            expect(err).toEqual(new Error("No difficulty provided"));
        }
        John_Doe.difficulty = "Easy";
    });
})


describe('unlockLocation', () => {
    test('New location', async () => {
        con.query(`REPLACE INTO useraccounts (user_id, displayName) VALUES ('1', 'John Doe')`, function (err) {
            if (err) throw err;
        });
        account = new UserAccount("1", "John Doe");
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
        John_Doe.unlockedLocations = [];
    })
})

describe('unlockItem', () => {
    test('New item', async () => {
        con.query("TRUNCATE locations", function (err) {
            if (err) throw err;
        });
        account = new UserAccount("1", "John Doe");
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
        John_Doe.collection.items = [];
    })
})

describe('updateAchievements', () => {
    test('New achievement', async () => {
        con.query("TRUNCATE items", function (err) {
            if (err) throw err;
        });
        con.query(`INSERT INTO achievementlist (achievement_id, type) VALUES ('1', 'collection')`, function (err) {
            if (err) throw err;
        });
        account = new UserAccount("1", "John Doe");
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
        John_Doe.collection.achievements = [];
        John_Doe.score = 0;
    })
})

describe('getFriendsLeaderboard', () => {
    test('Account with no friends', async () => {
        con.query(`REPLACE INTO useraccounts (user_id, displayName) VALUES ('1', 'John Doe')`, function (err) {
            if (err) throw err;
        });
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

describe('setDisplayName', () => {
    test('New name', async () => {
        account = new UserAccount("1", "John Doe");
        account = await account.setDisplayName("unique name");
        John_Doe.displayName = "unique name";
        expect(account).toMatchObject(John_Doe);
    })

    test('Same name', async () => {
        John_Doe.displayName = "John Doe";
        account = new UserAccount("1", "John Doe");
        account = await account.setDisplayName("John Doe");
        expect(account).toMatchObject(John_Doe);
    })

    test('Name taken', async () => {
        con.query(`INSERT INTO useraccounts (user_id, displayName) VALUES ('2', 'Joe Shmoe')`, function (err) {
            if (err) throw err;
        });
        expect.assertions(1);
        try {
            await account.setDisplayName("Joe Shmoe");
        } catch (err) {
            expect(err).toEqual(new Error("Name taken"));
        }
    })

    test('Name undefined', async () => {
        expect.assertions(1);
        try {
            await account.setDisplayName(undefined);
        } catch (err) {
            expect(err).toEqual(new Error("No name provided"));
        }
    })

    test('Name too short', async () => {
        expect.assertions(1);
        try {
            await account.setDisplayName("A");
        } catch (err) {
            expect(err).toEqual(new Error("Name is not between 3 and 20 characters"));
        }
    })

    test('Name too long', async () => {
        expect.assertions(1);
        try {
            await account.setDisplayName("ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRST");
        } catch (err) {
            expect(err).toEqual(new Error("Name is not between 3 and 20 characters"));
        }
    })
})

describe('addFriend', () => {
    test('Account exists', async () => {
        con.query(`REPLACE INTO useraccounts (user_id, displayName) VALUES ('1', 'John Doe')`, function (err) {
            if (err) throw err;
        });
        con.query(`INSERT INTO useraccounts (user_id, displayName) VALUES ('3', 'Johnny Doe')`, function (err) {
            if (err) throw err;
        });
        account = new UserAccount("1", "John Doe");
        account = await account.addFriend("Johnny Doe");
        John_Doe.outgoingRequests.push("Johnny Doe");
        expect(account).toMatchObject(John_Doe);
    })

    test('Account does not exist', async () => {
        expect.assertions(1);
        try {
            await account.addFriend("Doe John");
        } catch (err) {
            expect(err).toEqual(new Error("Account with name does not exist"));
        }
    })

    test('Name undefined', async () => {
        expect.assertions(1);
        try {
            await account.addFriend(undefined);
        } catch (err) {
            expect(err).toEqual(new Error("No name provided"));
        }
    })

    test('Adding self', async () => {
        expect.assertions(1);
        try {
            await account.addFriend("John Doe");
        } catch (err) {
            expect(err).toEqual(new Error("Cannot send requests to self"));
        }
    })

    test('Already friends', async () => {
        con.query(`INSERT INTO useraccounts (user_id, displayName) VALUES ('4', 'Anne Smith')`, function (err) {
            if (err) throw err;
        });
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1', '4', '1')`, function (err) {
            if (err) throw err;
        });
        expect.assertions(1);
        try {
            await account.addFriend("Anne Smith");
        } catch (err) {
            expect(err).toEqual(new Error("Already friends with this user"));
        }
    })

    test('Already sent request', async () => {
        expect.assertions(1);
        try {
            await account.addFriend("Johnny Doe");
        } catch (err) {
            expect(err).toEqual(new Error("Already sent a request to this user"));
        }
    })

    test('Already been sent request', async () => {
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('2', '1', '0')`, function (err) {
            if (err) throw err;
        });
        expect.assertions(1);
        try {
            await account.addFriend("Joe Shmoe");
        } catch (err) {
            expect(err).toEqual(new Error("Already been sent a request by this user"));
        }
    })
})

describe('removeFriend', () => {
    test('Account exists and is a friend', async () => {
        account.friends.push("Anne Smith");
        account = await account.removeFriend("Anne Smith")
        expect(account).toMatchObject(John_Doe);
    })

    test('Account does not exist', async () => {
        expect.assertions(1);
        try {
            await account.removeFriend("Doe John");
        } catch (err) {
            expect(err).toEqual(new Error("Account with name does not exist"));
        }
    })

    test('Name undefined', async () => {
        expect.assertions(1);
        try {
            await account.removeFriend(undefined);
        } catch (err) {
            expect(err).toEqual(new Error("No name provided"));
        }
    })

    test('Not friends', async () => {
        expect.assertions(1);
        try {
            await account.removeFriend("Joe Shmoe");
        } catch (err) {
            expect(err).toEqual(new Error("User not on friends list"));
        }
    })

    test('Removing self', async () => {
        expect.assertions(1);
        try {
            await account.removeFriend("John Doe");
        } catch (err) {
            expect(err).toEqual(new Error("Cannot remove self"));
        }
    })
})

describe('acceptRequest', () => {
    test('Accept existing request', async () => {
        account.incomingRequests.push("Joe Shmoe");
        account = await account.acceptRequest("Joe Shmoe");
        John_Doe.friends.push("Joe Shmoe");
        expect(account).toMatchObject(John_Doe);
    })

    test('Account does not exist', async () => {
        expect.assertions(1);
        try {
            await account.acceptRequest("Doe John");
        } catch (err) {
            expect(err).toEqual(new Error("Account with name does not exist"));
        }
    })

    test('Name undefined', async () => {
        expect.assertions(1);
        try {
            await account.acceptRequest(undefined);
        } catch (err) {
            expect(err).toEqual(new Error("No name provided"));
        }
    })

    test('No request', async () => {
        expect.assertions(1);
        try {
            await account.acceptRequest("Anne Smith");
        } catch (err) {
            expect(err).toEqual(new Error("No request from this user"));
        }
    })

    test('Self request', async () => {
        expect.assertions(1);
        try {
            await account.acceptRequest("John Doe");
        } catch (err) {
            expect(err).toEqual(new Error("Cannot accept a request from self"));
        }
    })

    test('Already friends', async () => {
        expect.assertions(1);
        try {
            await account.acceptRequest("Joe Shmoe");
        } catch (err) {
            expect(err).toEqual(new Error("Already friends with this user"));
        }
    })

    test('Accepting an outgoing request', async () => {
        expect.assertions(1);
        try {
            await account.acceptRequest("Johnny Doe");
        } catch (err) {
            expect(err).toEqual(new Error("Cannot accept outgoing requests"));
        }
    })
})

describe('denyRequest', () => {
    test('Deny incoming request', async () => {
        con.query('UPDATE friendships SET status = 0 WHERE send_id = 2 AND receiver_id = 1', function (err) {
            if (err) throw err;
        })
        account.friends = [];
        John_Doe.friends = [];
        account.incomingRequests.push("Joe Shmoe");
        account = await account.denyRequest("Joe Shmoe");
        expect(account).toMatchObject(John_Doe);
    })

    test('Account does not exist', async () => {
        expect.assertions(1);
        try {
            await account.denyRequest("Doe John");
        } catch (err) {
            expect(err).toEqual(new Error("Account with name does not exist"));
        }
    })

    test('Name undefined', async () => {
        expect.assertions(1);
        try {
            await account.denyRequest(undefined);
        } catch (err) {
            expect(err).toEqual(new Error("No name provided"));
        }
    })

    test('No request', async () => {
        expect.assertions(1);
        try {
            await account.denyRequest("Anne Smith");
        } catch (err) {
            expect(err).toEqual(new Error("No request from this user"));
        }
    })

    test('Self request', async () => {
        expect.assertions(1);
        try {
            await account.denyRequest("John Doe");
        } catch (err) {
            expect(err).toEqual(new Error("Cannot deny a request from self"));
        }
    })

    test('Already friends', async () => {
        con.query(`INSERT INTO friendships (send_id, receiver_id, status) VALUES ('1', '2', '1')`, function (err) {
            if (err) throw err;
        });
        account.friends.push("Joe Shmoe");
        expect.assertions(1);
        try {
            await account.denyRequest("Joe Shmoe");
        } catch (err) {
            expect(err).toEqual(new Error("Already friends with this user"));
        }
    })

    test('Denying an outgoing request', async () => {
        expect.assertions(1);
        try {
            await account.denyRequest("Johnny Doe");
        } catch (err) {
            expect(err).toEqual(new Error("Cannot deny outgoing requests"));
        }
    })
})

afterAll(async () => {
    loc_con.destroy();
    con.destroy();
    server.close();
    socket_server.close();
});
