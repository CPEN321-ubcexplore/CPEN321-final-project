
function login(token) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joe",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 0,
                incomingRequests: [],
                outgoingRequests: [],
                friends: [],
                collection: { achievements: [], items: [] },
                unlockedLocations: [],
                id: 0
            };
            resolve(account)
        })
    })
}

function changeDifficulty(user_id, difficulty) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joe",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 0,
                incomingRequests: [],
                outgoingRequests: [],
                friends: [],
                collection: { achievements: [], items: [] },
                unlockedLocations: [],
                id: 0
            };
            resolve(account);
        })
    })
}

function setDisplayName(user_id, displayName) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joseph",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 0,
                incomingRequests: [],
                outgoingRequests: [],
                friends: [],
                collection: { achievements: [], items: [] },
                unlockedLocations: [],
                id: 0
            };
            resolve(account);
        })
    })
}

function addFriend(user_id, friendName) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joe",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 0,
                incomingRequests: [],
                outgoingRequests: ["John"],
                friends: [],
                collection: { achievements: [], items: [] },
                unlockedLocations: [],
                id: 0
            };
            resolve(account)
        })
    })
}

function removeFriend(user_id, friendName) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joe",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 0,
                incomingRequests: [],
                outgoingRequests: [],
                friends: [],
                collection: { achievements: [], items: [] },
                unlockedLocations: [],
                id: 0
            };;
            resolve(account)
        })
    })
}

function acceptRequest(user_id, friendName) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joe",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 0,
                incomingRequests: [],
                outgoingRequests: [],
                friends: ["Anne"],
                collection: { achievements: [], items: [] },
                unlockedLocations: [],
                id: 0
            };
            resolve(account)
        })
    })
}

function denyRequest(user_id, friendName) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joe",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 0,
                incomingRequests: [],
                outgoingRequests: [],
                friends: [],
                collection: { achievements: [], items: [] },
                unlockedLocations: [],
                id: 0
            };
            resolve(account)
        })
    })
}

function participateInLeaderboard(user_id) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joe",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 1,
                incomingRequests: [],
                outgoingRequests: [],
                friends: [],
                collection: { achievements: [], items: [] },
                unlockedLocations: [],
                id: 0
            };
            resolve(account)
        })
    })
}

function unlockLocation(user_id, location) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joe",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 0,
                incomingRequests: [],
                outgoingRequests: [],
                friends: [],
                collection: { achievements: [], items: [] },
                unlockedLocations: ["Secret Spot"],
                id: 0
            };
            resolve(account)
        })
    })
}

function unlockItem(user_id, item) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joe",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 0,
                incomingRequests: [],
                outgoingRequests: [],
                friends: [],
                collection: { achievements: [], items: [999] },
                unlockedLocations: [],
                id: 0
            };
            resolve(account)
        })
    })
}

function updateAchievements(user_id, achievement) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joe",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 0,
                incomingRequests: [],
                outgoingRequests: [],
                friends: [],
                collection: { achievements: [{
                    "id": 1,
                    "type": "colletion",
                    "points": 1,
                    "image": "image"
                }], items: [] },
                unlockedLocations: [],
                id: 0
            };
            resolve(account)
        })
    })
}

function getFriendsLeaderboard(user_id) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            resolve([{ "displayName": "Joe", "score": 2 }]);
        })
    })
}

function getGlobalLeaderboard() {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            resolve([{ "displayName": "Joe", "score": 2 }]);
        })
    })
}


function findById(id) {
    return new Promise((resolve, reject) => {
        process.nextTick(() => {
            var account = {
                displayName: "Joe",
                score: 0,
                difficulty: "Easy",
                leaderboardParticipant: 0,
                incomingRequests: [],
                outgoingRequests: [],
                friends: [],
                collection: { achievements: [], items: [] },
                unlockedLocations: [],
                id: 0
            };
            
            resolve(account)
        })
    })
}
module.exports = {
    login,
    addFriend,
    removeFriend,
    acceptRequest,
    denyRequest,
    participateInLeaderboard,
    setDisplayName,
    changeDifficulty,
    unlockLocation,
    unlockItem,
    updateAchievements,
    getFriendsLeaderboard,
    findById,
    getGlobalLeaderboard
};

