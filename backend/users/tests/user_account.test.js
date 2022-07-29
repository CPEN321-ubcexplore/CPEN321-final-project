const { con, server, UserAccount, findByName} = require("../users_server");

//Uses mock of UserStore findByName

jest.mock('../users_server', () => {
    const actual = jest.requireActual('../users_server');
    return {
        ...actual,
        findByName: jest.fn()
    };
});

findByName.mockImplementation(() => 42);

var John_Doe = {
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

var account = new UserAccount("1", "John Doe");



beforeAll(async () => {
    con.query("USE testusersdb", function (err, result) {
        if (err) throw err;
        console.log("Using testusersdb.");
    });
    con.query("TRUNCATE TABLE useraccounts", function (err) {
        if (err) throw err;
    });

    con.query("TRUNCATE TABLE friendships", function (err) {
        if (err) throw err;
    });

    con.query("TRUNCATE TABLE items", function (err) {
        if (err) throw err;
    });

    con.query("TRUNCATE TABLE achievements", function (err) {
        if (err) throw err;
    });

    con.query("TRUNCATE TABLE locations", function (err) {
        if (err) throw err;
    });

    con.query(`INSERT INTO useraccounts (user_id, displayName, leaderboardParticipant) VALUES ('1', 'John Doe', '0')`, function (err) {
        if (err) throw err;
    });
})

test('participateInLeaderboard: User not participating in leaderboard', async () => {
    account = await account.participateInLeaderboard();
    John_Doe.leaderboardParticipant = 1;
    expect(account).toMatchObject(John_Doe);
});

test('participateInLeaderboard: User already participating in leaderboard', async () => {
    account = await account.participateInLeaderboard();
    expect(account).toMatchObject(John_Doe);
});

test('changeDifficulty: Change to different difficulty', async () => {
    account = await account.changeDifficulty("Medium");
    John_Doe.difficulty = "Medium";
    expect(account).toMatchObject(John_Doe);
});

test('changeDifficulty: Change to same difficulty', async () => {
    account = await account.changeDifficulty("Medium");
    expect(account).toMatchObject(John_Doe);
});

test('changeDifficulty: Invalid difficulty', async () => {
    expect.assertions(1);
    try {
        await account.changeDifficulty("Impossible");
    } catch (err) {
        expect(err).toEqual(new Error("Invalid difficulty"));
    }
});

test('addFriend: Successful add', async () => {
    console.log(await account.addFriend("Johnny Doe"));
});





afterAll(async () => {
    con.end();
    server.close();
})