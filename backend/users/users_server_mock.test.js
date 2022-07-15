const { findById, getGlobalLeaderboard, login } = require("./users_server");
const { addFriend, acceptRequest, removeFriend, denyRequest, changeDifficulty, setDisplayName, participateInLeaderboard, unlockLocation, unlockItem, updateAchievements, getFriendsLeaderboard } = require("./__mocks__/users_server");

jest.mock("./users_server")

test('Test findById', async () => {
    const account = await findById(0);
    expect(account.displayName).toBe("Joe");
})


test('Test getGlobalLeaderbaord', async () => {
    const leaderboard = await getGlobalLeaderboard();
    expect(leaderboard[0].displayName).toBe("Joe");
})

test('Test login', async () => {
    const account = await login(0);
    expect(account.displayName).toBe("Joe");
})

test('Test addFriend', async () => {
    const account = await addFriend(0,"John");
    expect(account.outgoingRequests[0]).toBe("John");
})

test('Test removeFriend', async () => {
    const account = await removeFriend(0, "John");
    expect(account.friends).toEqual([]);
})

test('Test acceptRequest', async () => {
    const account = await acceptRequest(0,"Anne");
    expect(account.friends[0]).toBe("Anne");
})

test('Test denyRequest', async () => {
    const account = await denyRequest(0,"Anne");
    expect(account.friends).toEqual([]);
})

test('Test changeDifficulty', async () => {
    const account = await changeDifficulty(0, "Easy")
    expect(account.difficulty).toBe("Easy");
})

test('Test setDisplayName', async () => {
    const account = await setDisplayName(0,"Joseph");
    expect(account.displayName).toEqual("Joseph");
})

test('Test participateInLeaderboard', async () => {
    const account = await participateInLeaderboard(0)
    expect(account.leaderboardParticipant).toEqual(1);
})

test('Test unlockLocation', async () => {
    var location;
    const account = await unlockLocation(0, location);
    expect(account.unlockedLocations[0]).toEqual("Secret Spot");
})

test('Test unlockItem', async () => {
    var item;
    const account = await unlockItem(0, item);
    expect(account.collection.items[0]).toEqual(999);
})

test('Test updateAchievements', async () => {
    var achievement = {
        "id": 1,
        "type": "colletion",
        "points": 1,
        "image": "image"
    };
    const account = await updateAchievements(0,achievement);
    expect(account.collection.achievements[0]).toMatchObject(achievement);
})

test('Test getFriendsLeaderboard', async () => {
    var actual_leaderboard = [{ "displayName": "Joe", "score": 2 }];
    const leaderboard = await getFriendsLeaderboard(0);
    expect(leaderboard).toMatchObject(actual_leaderboard);
})



