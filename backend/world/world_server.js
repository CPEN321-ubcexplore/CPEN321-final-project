
const { TIMEOUT } = require("dns");
var express = require("express");
var app = express();
app.use(express.json());


var mysql = require("mysql");

// database connection
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql",
});

async function run(){
    try{
        
        // create server
        var server = app.listen(8081,(req,res) =>{
            var host = server.address().address;
            var port = server.address().port;
            console.log("Example server running at http://%s:%s",host,port);
        });
        
        con.query("USE world_database",function(err,result){
            if(err) throw err;
            console.log("Using database world_database");        
        });        
    }
    catch(err){
        console.log(err);
        
    }
}
 // connect to database  
 con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
    run();    
});

// CLASSES

class Message{
    constructor(coordinate_latitude,coordinate_longitude,message_text,user_account_id){
        this.coordinate_latitude = coordinate_latitude;
        this.coordinate_longitude = coordinate_longitude;
        this.message_text = message_text;
        this.user_account_id = user_account_id;
    }

    //Getters
    get coordinate_latitude(){ return this._coordinate_latitude; }
    get coordinate_longitude(){ return this._coordinate_longitude; }
    get message_text(){ return this._message_text; }
    get user_account_id(){ return this._user_account_id; }

    //Setters
    set coordinate_latitude(coordinate_latitude){
        //check if coordinate_latitude is a number
        if(isNaN(coordinate_latitude)){
            throw new Error("Coordinate latitude is not a number");
        }
        //check if coordinate_latitude is between -90 and 90
        if(coordinate_latitude < -90 || coordinate_latitude > 90){
            throw new Error("Coordinate latitude is not between -90 and 90");
        }

        this._coordinate_latitude = coordinate_latitude;
    }
    set coordinate_longitude(coordinate_longitude){
        //check if coordinate_longitude is a number
        if(isNaN(coordinate_longitude)){
            throw new Error("Coordinate longitude is not a number");
        }
        //check if coordinate_longitude is between -180 and 180
        if(coordinate_longitude < -180 || coordinate_longitude > 180){
            throw new Error("Coordinate longitude is not between -180 and 180");
        }

        this._coordinate_longitude = coordinate_longitude;
    }
    set message_text(message_text){
        //check if message_text is a string
        if(typeof message_text !== "string"){
            throw new Error("Message text is not a string");
        }
        //check if message_text is between 1 and 255 characters
        if(message_text.length < 1 || message_text.length > 255){
            throw new Error("Message text is not between 1 and 255 characters");
        }

        this._message_text = message_text;
    }
    set user_account_id(user_account_id){
        //check if user_account_id is a number
        if(isNaN(user_account_id)){
            throw new Error("User account id is not a number");
        }
        //check if user_account_id is non-negative
        if(user_account_id < 0){
            throw new Error("User account id is negative");
        }

        this._user_account_id = user_account_id;
    }

}

// Message functions
// add message to database
async function addMessage(coordinate_latitude,coordinate_longitude,message_text,user_account_id){
    return new Promise((resolve,reject) =>{
        var message = new Message(coordinate_latitude,coordinate_longitude,message_text,user_account_id);
        var sql = `INSERT INTO messages (coordinate_latitude,coordinate_longitude,message_text,user_account_id)
            VALUES (${message.coordinate_latitude},${message.coordinate_longitude},'${message.message_text}',${message.user_account_id})`;

        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Message added");
            resolve(result);
        });
    });
}

// get messages from database by various parameters, coordinates +- 0.01, user_account_id, message_text
async function getMessagesByParameters(id = undefined, coordinate_latitude = undefined,coordinate_longitude = undefined, radius = 0 ,message_text = undefined ,user_account_id = undefined){
    return new Promise((resolve,reject) =>{
        var sql = `SELECT * FROM messages WHERE`;
        if(id !== undefined){
            sql += ` id = ${id} AND `;
        }
        if(coordinate_latitude !== undefined){
            coordinate_latitude = parseFloat(coordinate_latitude);
            radius = parseFloat(radius);
            sql += ` coordinate_latitude BETWEEN ${coordinate_latitude - radius} AND ${coordinate_latitude + radius} AND `;
        }
        if(coordinate_longitude !== undefined){
            coordinate_longitude = parseFloat(coordinate_longitude);
            radius = parseFloat(radius);
            sql += ` coordinate_longitude BETWEEN ${coordinate_longitude - radius} AND ${coordinate_longitude + radius} AND `;
        }
        if(message_text !== undefined){
            sql += ` message_text = '${message_text}' AND `;
        }
        if(user_account_id !== undefined){
            sql += ` user_account_id = ${user_account_id} AND `;
        }
        sql = sql.slice(0,-5);

        console.log(sql);

        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Message retrieved");
            resolve(result);
        });
    });
}


// update message in database by id
async function updateMessage(id,coordinate_latitude,coordinate_longitude,message_text,user_account_id){
    return new Promise((resolve,reject) =>{
        var message = new Message(coordinate_latitude,coordinate_longitude,message_text,user_account_id);
        var sql = `UPDATE messages SET coordinate_latitude = ${message.coordinate_latitude},coordinate_longitude = ${message.coordinate_longitude},message_text = '${message.message_text}',user_account_id = ${message.user_account_id} WHERE id = ${id}`;

        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Message updated");
            resolve(result);
        });
    });
}

// delete message from database by id
async function deleteMessage(id){
    return new Promise((resolve,reject) =>{
        var sql = `DELETE FROM messages WHERE id = ${id}`;

        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Message deleted");
            resolve(result);
        });
    });
}

// delete all messages from database
async function deleteAllMessages(){
    return new Promise((resolve,reject) =>{
        var sql = `DELETE FROM messages`;

        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("All messages deleted");
            resolve(result);
        });
    });
}

// Routing

// REST API for messages

// REST API for POST, GET message
app.post("/messages",function(req,res){
    if (req.body.coordinate_latitude == undefined){
        res.status(400).send("Coordinate latitude is missing");
    }
    else if (req.body.coordinate_longitude == undefined){
        res.status(400).send("Coordinate longitude is missing");
    }
    else if (req.body.message_text == undefined){
        res.status(400).send("Message text is missing");
    }
    else if (req.body.user_account_id == undefined){
        res.status(400).send("User account id is missing");
    }
    else{ 
        var coordinate_latitude = req.body.coordinate_latitude;
        var coordinate_longitude = req.body.coordinate_longitude;
        var message_text = req.body.message_text;
        var user_account_id = req.body.user_account_id;

        addMessage(coordinate_latitude,coordinate_longitude,message_text,user_account_id)        
        .then(result =>{
            res.status(201).send("Message added");
        })
        .catch(err =>{
            res.status(400).send(err);
        });
    }
}).get("/messages",function(req,res){   
    var id = req.query.id;
    var coordinate_latitude = req.query.coordinate_latitude;
    var coordinate_longitude = req.query.coordinate_longitude;
    var radius = req.query.radius; 

    if(req.query.message_text !== undefined){
        var message_text = decodeURIComponent(req.query.message_text);
    }else{
        var message_text = req.query.message_text;
    } 
    
    var user_account_id = req.query.user_account_id;

    getMessagesByParameters(id,coordinate_latitude,coordinate_longitude,radius,message_text,user_account_id)
    .then(result =>{
        res.status(200).send(result);
    }
    ).catch(err =>{
        res.status(400).send(err);
    });
});

// REST API for delete all messages
app.delete("/messages/all",function(req,res){
    deleteAllMessages()
    .then(result =>{
        res.status(200).send("All messages deleted");
    }
    ).catch(err =>{
        res.status(400).send(err);
    });
});

// REST API for GET, PUT, DELETE message by id
app.get("/messages/:id",function(req,res){
    if (req.params.id == undefined){
        res.status(400).send("Id is missing");
    }    
    getMessagesByParameters(id = req.params.id)
    .then(result =>{
        res.status(200).send(result);
    }
    ).catch(err =>{
        res.status(400).send(err);
    });
}
).post("/messages/:id",function(req,res){
    if (req.params.id == undefined){
        res.status(400).send("Id is missing");
    }    
    updateMessage(req.params.id,req.body.coordinate_latitude,req.body.coordinate_longitude,req.body.message_text,req.body.user_account_id)
    .then(result =>{
        res.status(200).send("Message updated");
    }
    ).catch(err =>{
        res.status(400).send(err);
    });
}
).delete("/messages/:id",function(req,res){
    if (req.params.id == undefined){
        res.status(400).send("Id is missing");
    }
    deleteMessage(req.params.id)
    .then(result =>{
        res.status(200).send("Message deleted");
    }
    ).catch(err =>{
        res.status(400).send(err);
    });
});


