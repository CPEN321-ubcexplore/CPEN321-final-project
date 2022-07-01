var mysql = require('mysql');
var express = require('express');
var app = express();

const Difficulty = {
	Easy: 'Easy',
	Medium: 'Medium'
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
			createAccount(0, "Test");
		});
	}
	catch (err) {
		console.log(err);
	}
}





function createAccount(credentials, name) {
	user = new UserAccount(name);
	var score = user.score;
	var leaderboardParticipant = user.leaderboardParticipant;
	var difficulty = user.difficulty;
	var sql = `INSERT INTO useraccounts (displayName,score,leaderboardParticipant,difficulty) VALUES ('${name}','${score}','${leaderboardParticipant}','${difficulty}')`;

	con.query(sql, function (err, result) {
		if (err) throw err;
		console.log("Added account");
		user.id = result.id;
	})
}
class UserAccount {
	constructor(displayName) {
		this.displayName = displayName;
		this.score = 0;
		this.difficulty = Difficulty.Easy;
		this.leaderboardParticipant = 0;
		this.incomingRequests = [];
		this.outgoingRequests = [];
		this.friends = [];
		this.collection = [];
		this.locations = [];
	}
}

run()






