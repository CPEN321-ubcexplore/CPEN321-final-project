const mysql = require('mysql');
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(express.json())


const CLIENT_ID = "239633515511-9g9p4kdqcvnnrnjq28uskbetjch6e2nc.apps.googleusercontent.com";
const Difficulty = {
    Easy: "Easy",
    Medium: "Medium"
}
const Status = {
    Pending: 0,
    Friends: 1
}
const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql"
});

//USERACCOUNT CLASS AND RELATED INTERFACES START
class UserAccount {
    constructor(user_id, displayName, score = 0, difficulty = Difficulty.Easy, leaderboardParticipant = 0,
        incomingRequests = [], outgoingRequests = [], friends = [], collection = { achievements: [], items: [] }, locations = []) {
        this.id = user_id;
        this.displayName = displayName;
        this.score = score;
        validDifficulty(difficulty);
        this.difficulty = difficulty;
        this.leaderboardParticipant = leaderboardParticipant;
        this.incomingRequests = incomingRequests;
        this.outgoingRequests = outgoingRequests;
        this.friends = friends;
        this.collection = collection;
        this.unlockedLocations = locations;
    }

    //Getter functions for attirbutes of UserAccount not stored in useraccounts table
    async getFriends() {
        var account = this;
        var friends = [];
        var sql = `CALL getFriends(?)`;
        return new Promise((resolve, reject) => {
            con.query(sql, account.id, function (err, result) {
                if (err) reject(err);
                if (result) {
                    var found_friends = result[0];
                    for (var i = 0; i < found_friends.length; i++) {
                        friends.push(found_friends[i].displayName);
                    }
                }
                account.friends = friends;
                resolve(account.friends);
            });
        });
    }

    async getIncomingRequests() {
        var account = this;
        var incomingRequests = [];
        var sql = `CALL getIncomingRequests(?)`;
        return new Promise((resolve, reject) => {
            con.query(sql, account.id, function (err, result) {
                if (err) reject(err);
                if (result) {
                    var found_requests = result[0];
                    for (var i = 0; i < found_requests.length; i++) {
                        incomingRequests.push(found_requests[i].displayName);
                    }
                }
                account.incomingRequests = incomingRequests;
                resolve(account.incomingRequests);
            })
        });
    }

    async getOutgoingRequests() {
        var account = this;
        var outgoingRequests = [];
        var sql = `CALL getOutgoingRequests(?)`;
        return new Promise((resolve, reject) => {
            con.query(sql, account.id, function (err, result) {
                if (err) reject(err);
                if (result) {
                    var found_requests = result[0];
                    for (var i = 0; i < found_requests.length; i++) {
                        outgoingRequests.push(found_requests[i].displayName);
                    }
                }
                account.outgoingRequests = outgoingRequests;
                resolve(account.outgoingRequests);
            })
        });
    }

    async getLocations() {
        var account = this;
        var sql = `CALL getLocations(?)`;
        var unlockedLocations = []
        return new Promise((resolve, reject) => {
            con.query(sql, [account.id], function (err, result) {
                if (err) reject(err);
                if (result) {
                    var found_locations = result[0];
                    for (var i = 0; i < found_locations.length; i++) {
                        unlockedLocations.push(found_locations[i].LocationName);
                    }
                }
                account.unlockedLocations = unlockedLocations;
                resolve(account.unlockedLocations);
            })
        })
    }

    async getCollection() {
        var account = this;
        var sql = `CALL getItems(?)`;
        var items = [];
        var achievements = [];
        return new Promise((resolve, reject) => {
            con.query(sql, [account.id], function (err, result) {
                if (err) reject(err);
                if (result) {
                    var found_items = result[0];
                    for (var i = 0; i < found_items.length; i++) {
                        items.push(found_items[i].item_id);
                    }
                }
                account.collection.items = items;
            })
            sql = `CALL getAchievements(?)`;
            con.query(sql, [account.id], function (err, result) {
                if (err) reject(err);
                if (result) {
                    var found_achievements = result[0];
                    for (var i = 0; i < found_achievements.length; i++) {
                        achievements.push(found_achievements[i]);
                    }
                }
                account.collection.achievements = achievements;
                resolve(account);
            })
        })
    }

    //USERACCOUNT INTERFACES START
    async participateInLeaderboard() {
        var account = this;
        if (account.leaderboardParticipant === 0) {
            var sql = `CALL participateInLeaderboard(?)`;
            return new Promise((resolve, reject) => {
                con.query(sql, account.id, function (err, result) {
                    if (err) reject(err);
                    account.leaderboardParticipant = 1;
                    resolve(account);
                })
            })
        }
        return account;
    }

    async changeDifficulty(difficulty) {
        var account = this;
        if (account.difficulty != difficulty) {
            validDifficulty(difficulty);
            account.difficulty = difficulty;
            var sql = `CALL changeDifficulty(?,?)`;
            return new Promise((resolve, reject) => {
                con.query(sql, [account.id, difficulty], function (err, result) {
                    if (err) reject(err);
                    resolve(account);
                })
            })
        }
        return account;
    }

    async addFriend(displayName) {
        var receiver = await findByName(displayName);
        var account = this;
        if (receiver == undefined) {
            throw new Error("Account " + displayName + " does not exist");
        }
        await friendshipExists(account.id, receiver.id)
        var sql = `CALL addFriend(?,?)`;
        return new Promise((resolve, reject) => {
            con.query(sql, [account.id, receiver.id], function (err, result) {
                if (err) reject(err);
                account.outgoingRequests.push(receiver.displayName);
                resolve(account);
            })
        })
    }

    async removeFriend(displayName) {
        if (this.friends.includes(displayName)) {
            var friend = await findByName(displayName);
            var account = this;
            if (friend == undefined) {
                throw new Error("Account " + displayName + " does not exist");
            }
            var sql = `CALL removeFriend(?,?)`;
            return new Promise((resolve, reject) => {
                con.query(sql, [account.id, friend.id], function (err, result) {
                    if (err) reject(err);
                    account.friends = remove(account.friends, displayName);
                    resolve(account);
                })
            })
        }
        throw new Error("User not on friends list");
    }

    async acceptRequest(displayName) {
        if (this.incomingRequests.includes(displayName)) {
            var friend = await findByName(displayName);
            var account = this;
            if (friend == undefined) {
                throw new Error("Account " + displayName + " does not exist");
            }
            var sql = `CALL acceptRequest(?,?)`;
            return new Promise((resolve, reject) => {
                con.query(sql, [account.id, friend.id], function (err, result) {
                    if (err) reject(err);
                    account.incomingRequests = remove(account.incomingRequests, displayName);
                    account.friends.push(displayName);
                    resolve(account);
                })
            })
        }
        throw new Error("No request from this user."); 
    }

    async denyRequest(displayName) {
        if (this.incomingRequests.includes(displayName)) {
            var friend = await findByName(displayName);
            var account = this;
            if (friend == undefined) {
                throw new Error("Account " + displayName + " does not exist");
            }
            var sql = `CALL denyRequest(?,?)`;
            return new Promise((resolve, reject) => {
                con.query(sql, [account.id, friend.id], function (err, result) {
                    if (err) reject(err);
                    account.incomingRequests = remove(account.incomingRequests, displayName);
                    resolve(account);
                })
            })
        }
        throw new Error("No request from this user.");
    }

    async setDisplayName(displayName) {
        if (displayName.length < 3) {
            throw new Error("Name too short");
        }
        else if (displayName.length > 45) {
            throw new Error("Name too long");
        }
        var account = this;
        var desiredAccount = await findByName(displayName);
        //Name taken
        if (desiredAccount != undefined) {
            throw new Error("Name taken");
        }
        else {
            var sql = `CALL setDisplayName(?,?)`;
            return new Promise((resolve, reject) => {
                con.query(sql, [account.id, displayName], function (err, result) {
                    if (err) reject(err);
                    account.displayName = displayName;
                    resolve(account);
                });
            })
        }
    }
    
    async unlockLocation(location) {
        var account = this;
        var sql = `CALL unlockLocation(?,?)`;
        return new Promise((resolve, reject) => {
            con.query(sql, [account.id, location.location_name], function (err, result) {
                if (err) reject(err);
                account.unlockedLocations.push(location.location_name);
                resolve(account);
            })
        })
    }

    async unlockItem(item) {
        var account = this;
        var sql = `CALL unlockItem(?,?)`;
        return new Promise((resolve, reject) => {
            con.query(sql, [account.id, item.id], function (err, result) {
                if (err) reject(err);
                account.collection.items.push(item.id);
                resolve(account);
            })
        })

    }

    async updateAchievements(achievement) {
        var account = this;
        var sql = `CALL updateAchievements(?,?,?,?,?)`;
        return new Promise((resolve, reject) => {
            //First add/update achievement table
            con.query(sql, [account.id, achievement.id, achievement.type, achievement.points, achievement.image], function (err, result) {
                if (err) reject(err);
            })
            //Then update user score
            sql = `CALL updateScore(?,?)`;
            con.query(sql, [account.id, achievement.points], async function (err, result) {
                if (err) reject(err);
                account.score = account.score + achievement.points;
                io.emit('score update', account.displayName);
                account = await account.getCollection();
                resolve(account);
            })
        })

    }

    async getFriendLeaderboard() {
        var account = this;
        var sql = `CALL getFriendLeaderboard(?)`;
        return new Promise((resolve, reject) => {
            con.query(sql, [account.id], function (err, result) {
                var leaderboard = result[0];
                if (err) reject(err);
                resolve(leaderboard);
            })
        })
    }
}
//USERACCOUNT CLASS AND INTERFACES END

//USERSTORE RELATED INTERFACES START
async function findById(id) {
    var sql = `CALL findById(?)`;
    return new Promise((resolve, reject) => {
        con.query(sql, id, async function (err, result, fields) {
            var found_account = result[0][0];
            if (err) reject(err);
            else if (found_account == undefined) {
                resolve(undefined);
            }
            else {
                var account = new UserAccount(found_account.user_id, found_account.displayName, found_account.score, found_account.difficulty, found_account.leaderboardParticipant);
                await account.getFriends();
                await account.getIncomingRequests();
                await account.getOutgoingRequests();
                await account.getLocations();
                await account.getCollection();
                resolve(account);
            }
        })
    })
}

async function findByName(displyName) {
    var sql = `CALL findByName(?)`;
    return new Promise((resolve, reject) => {
        con.query(sql, displyName, async function (err, result) {
            var found_account = result[0][0];
            if (err) reject(err);
            else if (found_account == undefined) {
                resolve(undefined);
            }
            else {
                var account = new UserAccount(found_account.user_id, found_account.displayName, found_account.score, found_account.difficulty, found_account.leaderboardParticipant);
                await account.getFriends();
                await account.getIncomingRequests();
                await account.getOutgoingRequests();
                await account.getLocations();
                await account.getCollection();
                resolve(account);
            }
        })
    });
}

async function login(credentials) {
    const user_id = credentials.sub;
    console.log(typeof user_id);
    var account = await findById(user_id);
    if (account == undefined) {
        return await createAccount(credentials);
    }
    return account;
}

async function createAccount(credentials) {
    //Ensure that default name is not already taken
    const displayName = await getName(credentials.name);
    const user_id = credentials.sub;
    var account = new UserAccount(user_id, displayName);
    var sql = `CALL createAccount(?,?)`;

    return new Promise((resolve, reject) => {
        con.query(sql, [user_id, displayName], function (err, result) {
            if (err) reject(err);
            resolve(account);
        })
    });
}

async function getGlobalLeaderboard() {
    var sql = `CALL getGlobalLeaderboard()`;
    return new Promise((resolve, reject) => {
        con.query(sql, function (err, result) {
            if (err) reject(err);
            var leaderboard = result[0];
            resolve(leaderboard);
        })
    })
}

//ROUTING
app.route("/login")
    .post(async (req, res) => {
        const token = req.body.token;
        try {
            const client = new OAuth2Client(CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            credentials = ticket.getPayload();
            console.log(credentials)

            var account = await login(credentials);
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }

    })
app.route("/:user_id/difficulty")
    .put(async (req, res) => {
        const user_id = req.params.user_id;
        var difficulty = req.body.difficulty
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with given id");
            }
            account = await account.changeDifficulty(difficulty);
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })
app.route("/:user_id/displayName")
    .put(async (req, res) => {
        const user_id = req.params.user_id;
        var displayName = req.body.displayName;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with given id");
            }
            account = await account.setDisplayName(displayName);
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })
app.route("/:user_id/friends")
    .get(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with provided id");
            }
            friends = await account.getFriends();
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })
    .post(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with provided id");
            }
            var friendName = req.body.displayName;
            account = await account.addFriend(friendName);
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })

app.route("/:user_id/friends/:displayName")
    .delete(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with provided id");
            }
            var friendName = req.params.displayName;
            account = await account.removeFriend(friendName);
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })

app.route("/:user_id/requests")
    .put(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with provided id");
            }
            var friendName = req.body.displayName;
            account = await account.acceptRequest(friendName);
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })
app.route("/:user_id/requests/:displayName")
    .delete(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with provided id");
            }
            var friendName = req.params.displayName;
            account = await account.denyRequest(friendName);
            res.status(200).send(account)
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })
app.route("/:user_id/participateInLeaderboard")
    .put(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with provided id");
            }
            account = await account.participateInLeaderboard();
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    });

app.route("/:user_id/locations")
    .post(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with provided id");
            }
            var location = req.body;
            account = await account.unlockLocation(location);
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })

app.route("/:user_id/items")
    .post(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with provided id");
            }
            var item = req.body;
            account = await account.unlockItem(item);
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })

app.route("/:user_id/achievements")
    .put(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with provided id");
            }
            var achievement = req.body;
            account = await account.updateAchievements(achievement);
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })

app.route("/:user_id/leaderboard")
    .get(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with provided id");
            }
            leaderboard = await account.getFriendLeaderboard();
            res.status(200).send(leaderboard);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })
app.route("/leaderboard")
    .get(async (req, res) => {
        try {
            leaderboard = await getGlobalLeaderboard();
            res.status(200).send(leaderboard);
        }
        catch (err) {
            console.log(err);
            res.status.send(err.message);
        }
    })

app.route("/:user_id")
    .get(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            if (account == undefined) {
                res.status(500).send("No account with given id");
            }
            res.status(200).send(account);
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    })
//ROUTING AND USERSTORE INTERFACES END

//Start server and connect to database
async function run() {
    try {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected to user database!");
            server.listen(8082, (req, res) => {
                var host = server.address().address
                var port = server.address().port
                console.log("Server successfully running at http://%s:%s", host, port)
            });
        });
        con.query("USE usersdb", function (err, result) {
            if (err) throw err;
            console.log("Using usersdb.");
        });
        var account = await findById(34);
        console.log(await account.addFriend("Test2"));
    }
    catch (err) { console.log(err); }
}

//HELPER FUNCTIONS
function validDifficulty(difficulty) {
    if (difficulty != Difficulty.Easy && difficulty != Difficulty.Medium) {
        throw new Error("Invalid difficulty");
    }
}

async function friendshipExists(id, friend_id) {
    var sql = `CALL getFriendship(?,?)`;
    return new Promise((resolve, reject) => {
        con.query(sql, [id, friend_id], function (err, result) {
            if (err) reject(err);
            var friendship = result[0][0];
            if (friendship == undefined) {
                resolve(undefined);
            }
            else if (friendship.status == Status.Friends) {
                reject(new Error("You are already friends with this user"));
            }
            else if (friendship.send_id == id) {
                reject(new Error("You have already sent a request to this user"));
            }
            else if (friendship.receiver_id == id) {
                reject(new Error("You have already been sent a request by this user"));
            }
        })
    })
}

function remove(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

//Finds a unique name by appending a number
async function getName(displayName) {
    var newName = displayName;
    var num = 1;
    while (1) {
        account = await findByName(newName);
        if (account == undefined) {
            return newName;
        }
        newName = displayName + num;
        num++;
    }
}

run();