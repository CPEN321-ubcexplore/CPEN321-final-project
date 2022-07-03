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
		account.changeDifficulty("Medium");
	}
	catch (err) {
		console.log(err);
	}
}


async function find(displyName) {
	var sql = `SELECT * FROM useraccounts WHERE displayName = '${displyName}' LIMIT 1`;
	return new Promise((resolve, reject) => {
		con.query(sql, async function (err, result) {
			if (err) reject(err);
			account = new UserAccount(result[0].displayName, result[0].score, result[0].difficulty, result[0].leaderboardParticipant, result[0].user_id);
			await account.getFriends();
			await account.getIncomingRequests();
			await account.getOutgoingRequests();
			//Need to also add collection and locations
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
	account = await find(name);
	if (account == undefined) {
		return await createAccount(credentials, name);
	}
	else {
		return account;
	}
}

class UserAccount {
	constructor(displayName, score = 0, difficulty = Difficulty.Easy, leaderboardParticipant = 0, user_id = null, incomingRequests = [], outgoingRequests = [], friends = [], collection = [], locations = []) {
		this.displayName = displayName;
		this.score = score;
		validDifficulty(difficulty);
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
	changeDifficulty(difficulty){
		validDifficulty(difficulty);
		if(this.difficulty != difficulty){
			this.difficulty = difficulty;
			var sql = `UPDATE useraccounts SET difficulty = '${difficulty}' WHERE user_id = '${this.id}'`;
			con.query(sql, function(err, result){
				if(err) throw err;
				console.log("Changed difficulty to: " + difficulty);
			})
		};
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
		var account = this;
		var friends = [];
		var sql =
		`SELECT displayName
		FROM useraccounts
		INNER JOIN friendships ON friendships.send_id = useraccounts.user_id OR friendships.receiver_id = useraccounts.user_id
		WHERE user_id != '${this.id}' AND status = '${Status.Friends}' AND (receiver_id = '${this.id}' OR send_id = '${this.id}')`;
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
		var sql =
		`SELECT displayName
		FROM useraccounts
		JOIN friendships ON friendships.send_id = useraccounts.user_id OR friendships.receiver_id = useraccounts.user_id
		WHERE user_id != '${this.id}' AND status = '${Status.Pending}' AND receiver_id = '${this.id}'`;
		return new Promise((resolve, reject) => {
			con.query(sql, function (err, result) {
				if(err) reject(err);
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
		var sql = 
		`SELECT displayName
		FROM useraccounts
		JOIN friendships ON friendships.send_id = useraccounts.user_id OR friendships.receiver_id = useraccounts.user_id
		WHERE user_id != '${this.id}' AND status = '${Status.Pending}' AND send_id = '${this.id}'`;
		return new Promise((resolve, reject) => {
			con.query(sql, function (err, result) {
				if(err) reject(err);
				for (var i = 0; i < result.length; i++) {
					outgoingRequests.push(result[i].displayName);
				}
				account.outgoingRequests = outgoingRequests;
				resolve(account.outgoingRequests);
			})
		});
	}
}

function validDifficulty(difficulty){
	if(difficulty != Difficulty.Easy && difficulty != Difficulty.Medium){
		throw new Error("Invalid difficulty");
	}
}

run()







