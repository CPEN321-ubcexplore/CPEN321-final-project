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

const achievement = {
    achievement_id: 1,
    type: 'collection',
    points: 1,
    image: 'image'
};

const fake_achievement = {
    achievement_id: -1,
    type: 'collection',
    points: 1,
    image: 'image'
};

var John_Doe1 = {
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

var Doe_John = {
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

var Joe_Shmoe = {
    displayName: "Joe Shmoe",
    score: 0,
    difficulty: "Easy",
    leaderboardParticipant: 0,
    incomingRequests: [],
    outgoingRequests: [],
    friends: [],
    collection: { achievements: [], items: [] },
    unlockedLocations: [],
    id: "2"
};

var global_leaderboard = [{ displayName: "JohnDoe1", score: 20 }, { displayName: "JohnDoe2", score: 10 }, { displayName: "JohnDoe3", score: 5 }];
var friend_leaderboard = [{ displayName: "Friend3", score: 7 }, { displayName: "Friend1", score: 6 }, { displayName: "Friend2", score: 5 }];
module.exports = {
    John_Doe,
    John_Doe1,
    Joe_Shmoe,
    Doe_John,
    achievement,
    fake_achievement,
    global_leaderboard,
    friend_leaderboard
}