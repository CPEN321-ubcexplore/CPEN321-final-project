var mysql = require('mysql');
var express = require('express');
var app = express();

const Difficulty = {
	Easy: 'Easy',
	Medium: 'Medium'
}

const Status = {
	Pending: 0,
	Friends: 1
}

var con = mysql.createConnection({
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
			var server = app.listen(8081, (req, res) => {
				var host = server.address().address
				var port = server.address().port
				console.log("Server successfully running at http://%s:%s", host, port)
			});
		});
		con.query("USE usersdb", function (err, result) {
			if (err) throw err;
			console.log("Using usersdb.");
		});
		account = await login(0, "Dylan");
		console.log(await account.getFriends());
	}
	catch (err) {
		console.log(err);
	}
}


async function find(displyName) {
	var sql = `SELECT * FROM useraccounts WHERE displayName = '${displyName}' LIMIT 1`;
	return new Promise((resolve, reject) => {
		con.query(sql, function (err, result) {
			if (err) reject(err);
			account = new UserAccount(result[0].displayName, result[0].score, result[0].difficulty, result[0].leaderboardParticipant, result[0].user_id);
			resolve(account);
		})
	});
}

async function createAccount(credentials, name) {
	user = new UserAccount(name);
	var score = user.score;
	var leaderboardParticipant = user.leaderboardParticipant;
	var difficulty = user.difficulty;
	var sql = `INSERT INTO useraccounts (displayName,score,leaderboardParticipant,difficulty) VALUES ('${name}','${score}','${leaderboardParticipant}','${difficulty}')`;

	return new Promise((resolve, reject) => {
		con.query(sql, function (err, result) {
			if (err) reject(err);
			console.log("Added account" + result.insertId);
			user.id = result.insertId;
			resolve(user);
		})
	});
}

async function login(credentials, name) {
	result = await find(name);
	if (result == undefined) {
		return await createAccount(credentials, name);
	}
	else {
		//Need to turn this into a user account object by getting friends list etc.
		return result;
	}
}

class UserAccount {
	constructor(displayName, score = 0, difficulty = Difficulty.Easy, leaderboardParticipant = 0, user_id = null, incomingRequests = [], outgoingRequests = [], friends = [], collection = [], locations = []) {
		this.displayName = displayName;
		this.score = score;
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
	async sendRequest(displayName) {
		var receiver = await find(displayName);
		if (receiver == undefined) {
			throw new Error("Account " + displayName + " does not exist");
		}
		else {
			var receiver_id = receiver.user_id;
			var send_id = this.id;
			var status = Status.Pending;
			var sql = `INSERT INTO friendships(send_id,receiver_id,status) VALUES ('${send_id}','${receiver_id}','${status}')`;
		}
	}
	async getFriends() {
		var friends = [];
		var sql =
		`SELECT displayName
		FROM useraccounts
		INNER JOIN friendships ON friendships.send_id = useraccounts.user_id OR friendships.receiver_id = useraccounts.user_id
		WHERE user_id != '${this.id}' AND status = 1 AND (receiver_id = '${this.id}' OR send_id = '${this.id}')`;
		return new Promise((resolve, reject) => {
			con.query(sql, function (err, result) {
				if (err) reject(err);
				for (var i = 0; i < result.length; i++) {
					friends.push(result[i].displayName);
				}
				resolve(friends);
			});
		});
	}
}

run()







