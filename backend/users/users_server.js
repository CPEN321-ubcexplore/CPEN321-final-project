const mysql = require('mysql');
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const app = express();
app.use(express.json());
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


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
        if (difficulty == undefined) {
            throw new Error("No difficulty provided");
        }
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
        var account = this;
        var receiver = await findByName(displayName);
        if (displayName == account.displayName) {
            throw new Error("Cannot send requests to self");
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
        var friend = await findByName(displayName);
        var account = this;
        if (displayName == account.displayName) {
            throw new Error("Cannot remove self");
        }
        if (this.friends.includes(displayName)) {
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
        var friend = await findByName(displayName);
        var account = this;
        if (displayName == account.displayName) {
            throw new Error("Cannot accept a request from self");
        }
        if (this.incomingRequests.includes(displayName)) {
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
        if (this.friends.includes(displayName)) {
            throw new Error("Already friends with this user");
        }
        if (this.outgoingRequests.includes(displayName)) {
            throw new Error("Cannot accept outgoing requests");
        }
        throw new Error("No request from this user");
    }

    async denyRequest(displayName) {
        var friend = await findByName(displayName);
        var account = this;
        if (displayName == account.displayName) {
            throw new Error("Cannot deny a request from self");
        }
        if (this.incomingRequests.includes(displayName)) {
            var sql = `CALL denyRequest(?,?)`;
            return new Promise((resolve, reject) => {
                con.query(sql, [account.id, friend.id], function (err, result) {
                    if (err) reject(err);
                    account.incomingRequests = remove(account.incomingRequests, displayName);
                    resolve(account);
                })
            })
        }
        if (this.friends.includes(displayName)) {
            throw new Error("Already friends with this user");
        }
        if (this.outgoingRequests.includes(displayName)) {
            throw new Error("Cannot deny outgoing requests");
        }
        throw new Error("No request from this user");
    }

    async setDisplayName(displayName) {
        if (displayName == null) {
            throw new Error("No name provided");
        }
        if (displayName.length < 3) {
            throw new Error("Name is not between 3 and 45 characters");
        }
        else if (displayName.length > 45) {
            throw new Error("Name is not between 3 and 45 characters");
        }
        var account = this;
        try {
            await findByName(displayName);
            throw new Error("Name taken");
        }
        catch (err) {
            //Name not taken
            if (err.message == "Account with name does not exist") {
                var sql = `CALL setDisplayName(?,?)`;
                return new Promise((resolve, reject) => {
                    con.query(sql, [account.id, displayName], function (err, result) {
                        if (err) reject(err);
                        account.displayName = displayName;
                        resolve(account);
                    });
                })
            }
            else {
                throw err;
            }
        }
    }

    async unlockLocation(location) {
        var account = this;
        if(location == null){
            throw new Error("No location provided");
        }
        if (location.location_name == null) {
            throw new Error("Location missing fields");
        }
        if (account.unlockedLocations.includes(location.location_name)) {
            return account;
        }
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
        if(item == null){
            throw new Error("No item provided");
        }
        if (item.id == null) {
            throw new Error("Item missing fields");
        }
        if (account.collection.items.includes(item.id)) {
            return account;
        }
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
        if(achievement == null){
            throw new Error("No achievement provided")
        }
        if (achievement.achievement_id == null || achievement.type == null || achievement.points == null || achievement.image == null) {
            throw new Error("Achievement missing fields");
        }
        var sql = `CALL updateAchievements(?,?,?,?,?)`;
        return new Promise((resolve, reject) => {
            //First add/update achievement table
            con.query(sql, [account.id, achievement.achievement_id, achievement.type, achievement.points, achievement.image], function (err, result) {
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
    if (id == null) {
        throw new Error("No id provided");
    }
    var trimmed_id = id.trim();
    if (!trimmed_id) {
        throw new Error("No id provided");
    }
    var sql = `CALL findById(?)`;
    return new Promise((resolve, reject) => {
        con.query(sql, id, async function (err, result, fields) {
            var found_account = result[0][0];
            if (err) reject(err);
            else if (found_account == undefined) {
                reject(new Error("Account with id does not exist"));
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

async function findByName(displayName) {
    var sql = `CALL findByName(?)`;
    if (displayName == null) {
        throw new Error("No name provided");
    }
    var trimmed_name = displayName.trim();
    if (!trimmed_name) {
        throw new Error("No name provided");
    }
    return new Promise((resolve, reject) => {
        con.query(sql, displayName, async function (err, result) {
            var found_account = result[0][0];
            if (err) reject(err);
            else if (found_account == undefined) {
                reject(new Error("Account with name does not exist"));
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
    if (credentials.sub == null) {
        throw new Error("No id provided");
    }
    const user_id = credentials.sub;
    if (isNaN(user_id)) {
        throw new Error("Invalid id");
    }
    try {
        var account = await findById(user_id);
    }
    catch (err) {
        if (err.message == "Account with id does not exist") {
            return await createAccount(credentials);
        }
    }
    return account;
}

async function createAccount(credentials) {
    //Ensure that default name is not already taken
    if (credentials.sub == null) {
        throw new Error("No id provided");
    }
    if (credentials.name == null) {
        throw new Error("No name provided");
    }
    const displayName = await getName(credentials.name);
    const user_id = credentials.sub;
    var account = new UserAccount(user_id, displayName);
    var sql = `CALL createAccount(?,?)`;

    return new Promise((resolve, reject) => {
        con.query(sql, [user_id, displayName], function (err, result) {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    reject(new Error("Account with id already exists"))
                }
                reject(err);
            }
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
        if (token == null) {
            res.status(400).send("No token provided");
        }
        else {
            try {
                const client = new OAuth2Client(CLIENT_ID);
                const ticket = await client.verifyIdToken({
                    idToken: token
                    //,audience: CLIENT_ID
                });
                var credentials = ticket.getPayload();
                var account = await login(credentials);
                res.status(200).send(account);
            }
            catch (err) {
                console.log(err);
                res.status(500).send(err.message);
            }
        }

    })
app.route("/:user_id/difficulty")
    .put(async (req, res) => {
        const user_id = req.params.user_id;
        const difficulty = req.body.difficulty
        try {
            var account = await findById(user_id);
            account = await account.changeDifficulty(difficulty);
            res.status(200).send(account);
        }
        catch (err) {
            if (err.message == "Account with id does not exist") {
                res.status(404).send(err.message);
            }
            else if (err.message == "Invalid difficulty" ||
                err.message == "No difficulty provided" ||
                err.message == "No id provided") {
                res.status(400).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    })
app.route("/:user_id/displayName")
    .put(async (req, res) => {
        const user_id = req.params.user_id;
        const displayName = req.body.displayName;
        try {
            var account = await findById(user_id);
            account = await account.setDisplayName(displayName);
            res.status(200).send(account);
        }
        catch (err) {
            if (err.message == "Account with id does not exist") {
                res.status(404).send(err.message);
            }
            else if (err.message == "Name taken" ||
                err.message == "Name is not between 3 and 45 characters" ||
                err.message == "No name provided" ||
                err.message == "No id provided") {
                res.status(400).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    })
app.route("/:user_id/friends")
    .post(async (req, res) => {
        const user_id = req.params.user_id;
        const friendName = req.body.displayName;
        try {
            var account = await findById(user_id);
            account = await account.addFriend(friendName);
            res.status(200).send(account);
        }
        catch (err) {
            if (err.message == "Account with id does not exist" ||
                err.message == "Account with name does not exist") {
                res.status(404).send(err.message);
            }
            else if (err.message == "Already friends with this user" ||
                err.message == "Already sent a request to this user" ||
                err.message == "Already been sent a request by this user" ||
                err.message == "Cannot send requests to self" ||
                err.message == "No name provided" ||
                err.message == "No id provided") {
                res.status(400).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    })

app.route("/:user_id/friends/:displayName")
    .delete(async (req, res) => {
        const user_id = req.params.user_id;
        const friendName = req.params.displayName;
        try {
            var account = await findById(user_id);
            account = await account.removeFriend(friendName);
            res.status(200).send(account);
        }
        catch (err) {
            if (err.message == "Account with id does not exist" ||
                err.message == "Account with name does not exist") {
                res.status(404).send(err.message);
            }
            else if (err.message == "User not on friends list" ||
                err.message == "Cannot remove self" ||
                err.message == "No name provided" ||
                err.message == "No id provided") {
                res.status(400).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    })

app.route("/:user_id/requests")
    .put(async (req, res) => {
        const user_id = req.params.user_id;
        const friendName = req.body.displayName;
        try {
            var account = await findById(user_id);
            account = await account.acceptRequest(friendName);
            res.status(200).send(account);
        }
        catch (err) {
            if (err.message == "Account with id does not exist" ||
                err.message == "Account with name does not exist" ||
                err.message == "No request from this user") {
                res.status(404).send(err.message);
            }
            else if (err.message == "Already friends with this user" ||
                err.message == "Cannot accept a request from self" ||
                err.message == "Cannot accept outgoing requests" ||
                err.message == "No name provided" ||
                err.message == "No id provided") {
                res.status(400).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    })
app.route("/:user_id/requests/:displayName")
    .delete(async (req, res) => {
        const user_id = req.params.user_id;
        const friendName = req.params.displayName;
        try {
            var account = await findById(user_id);
            account = await account.denyRequest(friendName);
            res.status(200).send(account)
        }
        catch (err) {
            if (err.message == "Account with id does not exist" ||
                err.message == "Account with name does not exist" ||
                err.message == "No request from this user") {
                res.status(404).send(err.message);
            }
            else if (err.message == "Already friends with this user" ||
                err.message == "Cannot deny a request from self" ||
                err.message == "Cannot deny outgoing requests" ||
                err.message == "No name provided" ||
                err.message == "No id provided") {
                res.status(400).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    })
app.route("/:user_id/participateInLeaderboard")
    .put(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            account = await account.participateInLeaderboard();
            res.status(200).send(account);
        }
        catch (err) {
            if (err.message == "Account with id does not exist") {
                res.status(404).send(err.message);
            }
            else if (err.message == "No id provided") {
                res.status(400).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    });

app.route("/:user_id/locations")
    .post(async (req, res) => {
        const user_id = req.params.user_id;
        const location = req.body;
        try {
            var account = await findById(user_id);
            account = await account.unlockLocation(location);
            res.status(200).send(account);
        }
        catch (err) {
            if (err.message == "Account with id does not exist") {
                res.status(404).send(err.message);
            }
            else if (err.message == "No location provided" ||
                err.message == "No id provided" ||
                err.message == "Location missing fields") {
                res.status(400).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    })

app.route("/:user_id/items")
    .post(async (req, res) => {
        const user_id = req.params.user_id;
        const item = req.body;
        try {
            var account = await findById(user_id);
            account = await account.unlockItem(item);
            res.status(200).send(account);
        }
        catch (err) {
            if (err.message == "Account with id does not exist") {
                res.status(404).send(err.message);
            }
            else if (err.message == "No item provided" ||
                err.message == "No id provided" ||
                err.message == "Item missing fields") {
                res.status(400).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    })

app.route("/:user_id/achievements")
    .put(async (req, res) => {
        const user_id = req.params.user_id;
        const achievement = req.body;
        try {
            var account = await findById(user_id);
            account = await account.updateAchievements(achievement);
            res.status(200).send(account);
        }
        catch (err) {
            if (err.message == "Account with id does not exist") {
                res.status(404).send(err.message);
            }
            else if (err.message == "No achievement provided" ||
                err.message == "No id provided" ||
                err.message == "Achievement missing fields") {
                res.status(400).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    })

app.route("/:user_id/leaderboard")
    .get(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            var leaderboard = await account.getFriendLeaderboard();
            res.status(200).send(leaderboard);
        }
        catch (err) {
            if (err.message == "Account with id does not exist" ||
                err.message == "No id provided") {
                res.status(404).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    })
app.route("/leaderboard")
    .get(async (req, res) => {
        var leaderboard;
        try {
            leaderboard = await getGlobalLeaderboard();
            res.status(200).send(leaderboard);
        }
        catch (err) {
            res.status(500).send(err.message);
        }
    })

app.route("/:user_id")
    .get(async (req, res) => {
        const user_id = req.params.user_id;
        try {
            var account = await findById(user_id);
            res.status(200).send(account);
        }
        catch (err) {
            if (err.message == "Account with id does not exist") {
                res.status(404).send(err.message);
            }
            else if (err.message == "No id provided") {
                res.status(400).send(err.message);
            }
            else {
                res.status(500).send(err.message);
            }
        }
    })
//ROUTING AND USERSTORE INTERFACES END

//Start server and connect to database
async function run() {
    try {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Connected to user database!");
        });
        con.query("USE usersdb", function (err, result) {
            if (err) throw err;
            console.log("Using usersdb.");
        });
        server.listen(8082, (req, res) => {
            var host = server.address().address
            var port = server.address().port
            console.log("Server successfully running at http://%s:%s", host, port)
        });
    }
    catch (err) {
        console.log(err);
    }
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
                resolve("Friendship does not exist");
            }
            else if (friendship.status == Status.Friends) {
                reject(new Error("Already friends with this user"));
            }
            else if (friendship.send_id == id) {
                reject(new Error("Already sent a request to this user"));
            }
            else if (friendship.receiver_id == id) {
                reject(new Error("Already been sent a request by this user"));
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
        try {
            account = await findByName(newName);
            newName = displayName + num;
            num++;
        }
        catch (err) {
            if (err.message == "Account with name does not exist") {
                return newName;
            }
            else {
                throw err;
            }
        }
    }
}

module.exports = { UserAccount, findByName, findById, login, createAccount, getGlobalLeaderboard, server, con };

run();