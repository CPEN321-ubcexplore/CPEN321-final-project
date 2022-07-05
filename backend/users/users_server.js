const mysql = require('mysql');
const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const app = express();
// Need to change this to actual client id;
const CLIENT_ID = "359487418802-q18iou9fg7luqp47pa3sv40jad6nq1dn.apps.googleusercontent.com";
app.use(express.json())

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
	password: "2332aass"
});

async function run() {
	try {
		con.connect(function (err) {
			if (err) throw err;
			console.log("Connected to user database!");
			var server = app.listen(8082, (req, res) => {
				var host = server.address().address
				var port = server.address().port
				console.log("Server successfully running at http://%s:%s", host, port)
			});
		});
		con.query("USE usersdb", function (err, result) {
			if (err) throw err;
			console.log("Using usersdb.");
		});
		// account = await login({ sub: "13", name: "Dylan" });
		// try { account = await account.removeFriend("Paul"); }
		// catch (err) {
		// 	console.log(err);
		// }
		// console.log(account);
	}
	catch (err) { console.log(err); }
}


async function findById(id) {
	var sql = `SELECT * FROM useraccounts WHERE user_id = '${id}'`;
	return new Promise((resolve, reject) => {
		con.query(sql, async function (err, result) {
			if (err) reject(err);
			else if (result[0] == undefined) {
				resolve(undefined);
			}
			else {
				account = new UserAccount(result[0].displayName, result[0].score, result[0].difficulty, result[0].leaderboardParticipant, result[0].user_id);
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

//If does this need to return full accounts (with friends list etc? or just bare bones?)
async function findByName(displyName) {
	var sql = `SELECT * FROM useraccounts WHERE displayName = '${displyName}' LIMIT 1`;
	return new Promise((resolve, reject) => {
		con.query(sql, async function (err, result) {
			if (err) reject(err);
			else if (result[0] == undefined) {
				resolve(undefined);
			}
			else {
				account = new UserAccount(result[0].displayName, result[0].score, result[0].difficulty, result[0].leaderboardParticipant, result[0].user_id);
				await account.getFriends();
				await account.getIncomingRequests();
				await account.getOutgoingRequests();
				await account.getLocations();
				await account.getCollection();
				//Need to also add collection
				resolve(account);
			}
		})
	});
}

async function login(credentials) {
	user_id = credentials.sub;
	console.log(typeof user_id);
	try {
		account = await findById(user_id);
		if (account == undefined) {
			return await createAccount(credentials);
		}
		else {
			return account;
		}
	}
	catch (err) { throw err };
}

async function createAccount(credentials) {
	//Ensure that defauly name is not already taken
	try {
		var displayName = await getName(credentials.name);
	}
	catch (err) { throw err };
	const user_id = credentials.sub;
	var user = new UserAccount(displayName, 0, Difficulty.Easy, 0, user_id);
	var score = user.score;
	var leaderboardParticipant = user.leaderboardParticipant;
	var difficulty = user.difficulty;
	var sql = `INSERT INTO useraccounts (user_id,displayName,score,leaderboardParticipant,difficulty) 
	VALUES ('${user_id}','${displayName}','${score}','${leaderboardParticipant}','${difficulty}')`;

	return new Promise((resolve, reject) => {
		con.query(sql, function (err, result) {
			if (err) reject(err);
			console.log("Added account" + user_id);
			resolve(user);
		})
	});
}

class UserAccount {
	constructor(displayName, score = 0, difficulty = Difficulty.Easy, leaderboardParticipant = 0, user_id = null,
		incomingRequests = [], outgoingRequests = [], friends = [], collection = { achievements: [], items: [] }, locations = []) {
		this.displayName = displayName;
		this.score = score;
		try {
			validDifficulty(difficulty);
		}
		catch (err) { throw err; }
		this.difficulty = difficulty;
		this.leaderboardParticipant = leaderboardParticipant;
		this.incomingRequests = incomingRequests;
		this.outgoingRequests = outgoingRequests;
		this.friends = friends;
		this.collection = collection;
		this.locations = locations;
		this.id = user_id;
	}
	getDifficulty() {
		return this.difficulty;
	}
	async participateInLeadboard() {
		var account = this;
		if (account.leaderboardParticipant == 0) {
			var sql = `UPDATE useraccounts SET leaderboardParticipant = "1" WHERE user_id = '${account.id}'`;
			return new Promise((resolve, reject) => {
				con.query(sql, function (err, result) {
					if (err) reject(err);
					account.leaderboardParticipant = 1;
					console.log(result);
					resolve(account);
				})
			})
		}
		else {
			return account;
		}
	}
	async changeDifficulty(difficulty) {
		account = this;
		try {
			validDifficulty(difficulty);
		}
		catch (err) { throw err; }
		if (account.difficulty != difficulty) {
			account.difficulty = difficulty;
			var sql = `UPDATE useraccounts SET difficulty = '${difficulty}' WHERE user_id = '${account.id}'`;
			return new Promise((resolve, reject) => {
				con.query(sql, function (err, result) {
					if (err) reject(err);
					resolve(account);
				})
			})
		};
	}
	async getFriends() {
		var account = this;
		var friends = [];
		var sql = `SELECT displayName
		FROM useraccounts
		INNER JOIN friendships ON friendships.send_id = useraccounts.user_id OR friendships.receiver_id = useraccounts.user_id
		WHERE user_id != '${account.id}' AND status = '${Status.Friends}' AND (receiver_id = '${account.id}' OR send_id = '${account.id}')`;
		return new Promise((resolve, reject) => {
			con.query(sql, function (err, result) {
				if (err) reject(err);
				for (var i = 0; i < result.length; i++) {
					friends.push(result[i].displayName);
				}
				account.friends = friends;
				resolve(account.friends);
			});
		});
	}
	async getIncomingRequests() {
		var account = this;
		var incomingRequests = [];
		var sql = `SELECT displayName
		FROM useraccounts
		JOIN friendships ON friendships.send_id = useraccounts.user_id OR friendships.receiver_id = useraccounts.user_id
		WHERE user_id != '${account.id}' AND status = '${Status.Pending}' AND receiver_id = '${account.id}'`;
		return new Promise((resolve, reject) => {
			con.query(sql, function (err, result) {
				if (err) reject(err);
				for (var i = 0; i < result.length; i++) {
					incomingRequests.push(result[i].displayName);
				}
				account.incomingRequests = incomingRequests;
				resolve(account.incomingRequests);
			})
		});
	}
	async getOutgoingRequests() {
		var account = this;
		var outgoingRequests = [];
		var sql = `SELECT displayName
		FROM useraccounts
		JOIN friendships ON friendships.send_id = useraccounts.user_id OR friendships.receiver_id = useraccounts.user_id
		WHERE user_id != '${account.id}' AND status = '${Status.Pending}' AND send_id = '${account.id}'`;
		return new Promise((resolve, reject) => {
			con.query(sql, function (err, result) {
				if (err) reject(err);
				for (var i = 0; i < result.length; i++) {
					outgoingRequests.push(result[i].displayName);
				}
				account.outgoingRequests = outgoingRequests;
				resolve(account.outgoingRequests);
			})
		});
	}
	async addFriend(displayName) {
		try {
			var receiver = await findByName(displayName);
			var account = this;
			var receiver_id = receiver.id;
			var send_id = account.id;
			if (receiver == undefined) {
				throw new Error("Account " + displayName + " does not exist");
			}
			await friendshipExists(send_id, receiver_id)
			var status = Status.Pending;
			var sql = `INSERT INTO friendships(send_id,receiver_id,status) VALUES ('${send_id}','${receiver_id}','${status}')`;
			return new Promise((resolve, reject) => {
				con.query(sql, function (err, result) {
					if (err) reject(err);
					account.outgoingRequests.push(receiver.displayName);
					console.log(account);
					resolve(account);
				})
			})
		}
		catch (err) { throw err; }
	}
	async removeFriend(displayName) {
		if (this.friends.includes(displayName)) {
			try {
				var friend = await findByName(displayName);
				var account = this;
				if (friend == undefined) {
					throw new Error("Account " + displayName + " does not exist");
				}
				var sql = `DELETE FROM friendships 
				WHERE ((send_id = '${account.id}' AND receiver_id = '${friend.id}') 
				OR (send_id = '${friend.id}' AND receiver_id = '${account.id}')) 
				AND status = '${Status.Friends}'`;
				return new Promise((resolve, reject) => {
					con.query(sql, function (err, result) {
						if (err) reject(err);
						account.friends = remove(account.friends, displayName);
						resolve(account);
					})
				})
			}
			catch (err) { throw err; };
		}
		else {
			throw new Error("User not on friends list");
		}
	}
	async acceptRequest(displayName) {
		if (this.incomingRequests.includes(displayName)) {
			try {
				var friend = await findByName(displayName);
				var account = this;
				if (friend == undefined) {
					throw new Error("Account " + displayName + " does not exist");
				}
				var sql = `UPDATE friendships SET status = '${Status.Friends}' 
				WHERE send_id = '${friend.id}' AND receiver_id = '${account.id}' AND status = '${Status.Pending}'`;
				return new Promise((resolve, reject) => {
					con.query(sql, function (err, result) {
						if (err) reject(err);
						account.incomingRequests = remove(account.incomingRequests, displayName);
						account.friends.push(displayName);
						resolve(account);
					})
				})
			}
			catch (err) { throw err; };

		}
		else {
			throw new Error("No request from this user.");
		}
	}
	async denyRequest(displayName) {
		if (this.incomingRequests.includes(displayName)) {
			try {
				var friend = await findByName(displayName);
				var account = this;
				if (friend == undefined) {
					throw new Error("Account " + displayName + " does not exist");
				}
				var sql = `DELETE FROM friendships 
				WHERE send_id = '${friend.id}' AND receiver_id = '${account.id}' AND status = '${Status.Pending}'`;
				return new Promise((resolve, reject) => {
					con.query(sql, function (err, result) {
						if (err) reject(err);
						account.incomingRequests = remove(account.incomingRequests, displayName);
						resolve(account);
					})
				})
			}
			catch (err) { throw err; };
		}
		else {
			throw new Error("No request from this user.");
		}
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
			var sql = `UPDATE useraccounts SET displayName = '${displayName}' WHERE user_id = '${account.id}'`;
			return new Promise((resolve, reject) => {
				con.query(sql, function (err, result) {
					if (err) reject(err);
					account.displayName = displayName;
					resolve(account);
				});
			})
		}
	}
	async getLocations() {
		var account = this;
		var sql = `SELECT location_id FROM locations WHERE user_id = '${account.id}'`;
		return new Promise((resolve, reject) => {
			con.query(sql, function (err, result) {
				if (err) reject(err);
				for (var i = 0; i < result.length; i++) {
					account.locations.push(result[i].location_id);
				}
				resolve(account.locations);
			})
		})
	}
	async unlockLocation(location) {
		var account = this;
		var sql = `INSERT INTO locations (user_id, location_id) VALUES ('${account.id}','${location.id}')`;
		return new Promise((resolve, reject) => {
			con.query(sql, function (err, result) {
				if (err) reject(err);
				account.locations.push(location.id);
				resolve(account);
			})
		})
	}
	async getCollection() {
		var account = this;
		var sql = `SELECT item_id FROM items WHERE user_id = '${account.id}'`;
		return new Promise((resolve, reject) => {
			con.query(sql, function (err, result) {
				if (err) reject(err);
				for (var i = 0; i < result.length; i++) {
					account.collection.items.push(result[i].item_id);
				}
			})
			sql = `SELECT achievement_id,type, points, image FROM achievements WHERE user_id = '${account.id}'`;
			con.query(sql, function (err, result) {
				if (err) reject(err);
				for (var i = 0; i < result.length; i++) {
					account.collection.achievements.push(result[i]);
				}
				resolve(account);
			})
		})
	}
	async unlockItem(item) {
		var account = this;
		var sql = `INSERT INTO items (user_id, item_id) VALUES ('${account.id}','${item.id}')`;
		return new Promise((resolve, reject) => {
			con.query(sql, function (err, result) {
				if (err) reject(err);
				account.collection.items.push(item.id);
				resolve(account);
			})
		})

	}
	async updateAchievements(achievement) {
		var account = this;
		var sql = `INSERT INTO achievements (achievement_id, user_id, type, points, image)
		VALUES ('${achievement.id}','${account.id}','${achievement.type}','${achievement.points}','${achievement.image}')
		ON DUPLICATE KEY UPDATE points = points + ${achievement.points}`;
		return new Promise((resolve, reject) => {
			//First add/update achievement table
			con.query(sql, function (err, result) {
				if (err) reject(err);
				account.collection.achievements.push(achievement);
			})
			//Then update user score
			sql = `UPDATE useraccounts SET score = score + '${achievement.points}' WHERE user_id = '${account.id}'`;
			con.query(sql, function (err, result) {
				if (err) reject(err);
				account.score = account.score + achievement.points;
				resolve(account);
			})
		})

	}
}

//Helper Functions
function validDifficulty(difficulty) {
	if (difficulty != Difficulty.Easy && difficulty != Difficulty.Medium) {
		throw new Error("Invalid difficulty");
	}
}

async function friendshipExists(send_id, receiver_id) {
	var sql = `SELECT * 
	FROM friendships 
	WHERE (send_id = '${send_id}' AND receiver_id = '${receiver_id}') OR (send_id = '${receiver_id}' AND receiver_id = '${send_id}')`;
	return new Promise((resolve, reject) => {
		con.query(sql, function (err, result) {
			if (err) reject(err);
			else if (result[0] == undefined) {
				resolve(undefined);
			}
			else if (result[0].status == Status.Friends) {
				reject(new Error("You are already friends with this user"));
			}
			else if (result[0].send_id == send_id) {
				reject(new Error("You have already sent a request to this user"));
			}
			else if (result[0].receiver_id == send_id) {
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

async function getName(displayName) {
	var newName = displayName;
	var num = 1;
	try {
		while (1) {
			account = await findByName(newName);
			if (account == undefined) {
				return newName;
			}
			newName = displayName + num;
			num++;
		}
	}
	catch (err) { throw err }
}

//Routing
app.route("/login")
	.post(async (req, res) => {
		const token = req.body.token;
		const client = new OAuth2Client(CLIENT_ID);
		const ticket = await client.verifyIdToken({
			idToken: token,
			audeience: CLIENT_ID
		});
		credentials = ticket.getPayload();
		console.log(credentials)
		try {
			var account = await login(credentials);
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}

	})
app.route("/:user_id")
	.get(async (req, res) => {
		const user_id = req.params.user_id;
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with given id");
			}
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	})
app.route("/:user_id/difficulty")
	.put(async (req, res) => {
		const user_id = req.params.user_id;
		var difficulty = req.body.difficulty
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with given id");
			}
			account = await account.changeDifficulty(difficulty);
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	})
app.route("/:user_id/displayName")
	.put(async (req, res) => {
		const user_id = req.params.user_id;
		var displayName = req.body.displayName;
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with given id");
			}
			account = await account.setDisplayName(displayName);
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	})
app.route("/:user_id/friends")
	.get(async (req, res) => {
		const user_id = req.params.user_id;
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with provided id");
			}
			friends = await account.getFriends();
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	})
	.post(async (req, res) => {
		const user_id = req.params.user_id;
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with provided id");
			}
			var friendName = req.body.displayName;
			account = await account.addFriend(friendName);
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	})
	.delete(async (req, res) => {
		const user_id = req.params.user_id;
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with provided id");
			}
			var friendName = req.body.displayName;
			account = await account.removeFriend(friendName);
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	})

app.route("/:user_id/requests")
	.put(async (req, res) => {
		const user_id = req.params.user_id;
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with provided id");
			}
			var friendName = req.body.displayName;
			account = await account.acceptRequest(friendName);
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	})
	.delete(async (req, res) => {
		const user_id = req.params.user_id;
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with provided id");
			}
			var friendName = req.body.displayName;
			account = await account.denyRequest(friendName);
			res.status(200).send(account)
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	})
app.route("/:user_id/participateInLeaderboard")
	.put(async (req, res) => {
		const user_id = req.params.user_id;
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with provided id");
			}
			account = await account.participateInLeadboard();
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	});

app.route("/:user_id/locations")
	.post(async (req, res) => {
		const user_id = req.params.user_id;
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with provided id");
			}
			var location = req.body;
			account = await account.unlockLocation(location);
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	})

app.route("/:user_id/items")
	.post(async (req, res) => {
		const user_id = req.params.user_id;
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with provided id");
			}
			var item = req.body;
			account = await account.unlockItem(item);
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	})

app.route("/:user_id/achievements")
	.put(async (req, res) => {
		const user_id = req.params.user_id;
		try {
			var account = await findById(user_id);
			if (account == undefined) {
				res.status(400).send("No account with provided id");
			}
			var achievement = req.body;
			account = await account.updateAchievements(achievement);
			res.status(200).send(account);
		}
		catch (err) {
			console.log(err);
			res.status(400).send(err.message);
		}
	})

run()







