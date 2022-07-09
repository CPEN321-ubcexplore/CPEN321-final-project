
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
            sql += ` coordinate_latitude BETWEEN ${coordinate_latitude - radius} AND ${coordinate_latitude + radius} AND `;
        }
        if(coordinate_longitude !== undefined){
            coordinate_longitude = parseFloat(coordinate_longitude);
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
        var sql = `UPDATE message SET coordinate_latitude = ${message.coordinate_latitude},coordinate_longitude = ${message.coordinate_longitude},message_text = '${message.message_text}',user_account_id = ${message.user_account_id} WHERE id = ${id}`;

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
        var sql = `DELETE FROM message WHERE id = ${id}`;

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
        var sql = `DELETE FROM message`;

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
            res.status(201).send(result);
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
    var message_text = decodeURIComponent(req.query.message_text);
    var user_account_id = req.query.user_account_id;

    getMessagesByParameters(req.query.id,req.query.coordinate_latitude,req.query.coordinate_longitude,req.query.radius,req.query.message_text,req.query.user_account_id)
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
        res.status(200).send(result);
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
        res.status(200).send(result);
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
        res.status(200).send(result);
    }
    ).catch(err =>{
        res.status(400).send(err);
    });
});



class Location{
    constructor(coordinate_latitude = 0,coordinate_longitude = 0,location_name = "default",fun_facts = "default",related_links = "default",about = "default",image_url = "default"){
        this.coordinate_latitude = coordinate_latitude;
        this.coordinate_longitude = coordinate_longitude;
        this.location_name = location_name;
        this.fun_facts = fun_facts;
        this.related_links = related_links;
        this.about = about;
        this.image_url = image_url;
    }

    get coordinate_latitude(){return this._coordinate_latitude;}
    get coordinate_longitude(){return this._coordinate_longitude;}
    get location_name(){return this._location_name;}
    get fun_facts(){return this._fun_facts;}
    get related_links(){return this._related_links;}
    get about(){return this._about;}
    get image_url(){return this._image_url;}

    set coordinate_latitude(coordinate_latitude){
        //check if coordinate_latitude is null or undefined
        if(coordinate_latitude == null || coordinate_latitude == undefined){
            throw new Error("Coordinate latitude is null or undefined");
        }
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
        //check if coordinate_longitude is null or undefined
        if(coordinate_longitude == null || coordinate_longitude == undefined){
            throw new Error("Coordinate longitude is null or undefined");
        }
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
    set location_name(location_name){
        //check if location_name is null or undefined
        if(location_name == null || location_name == undefined){
            throw new Error("Location name is null or undefined");
        }
        //check if location_name is empty or longer than 255 characters
        if(location_name.length == 0){
            throw new Error("Location name is empty");
        }else if(location_name.length > 255){
            throw new Error("Location name is too long");
        }

        this._location_name = location_name;
    }
    set fun_facts(fun_facts){
        //check if fun_facts is null or undefined
        if(fun_facts == null || fun_facts == undefined){
            throw new Error("Fun facts is null or undefined");
        }
        //check if fun_facts is empty
        if(fun_facts.length == 0){
            throw new Error("Fun facts is empty");
        }

        this._fun_facts = fun_facts;
    }
    set related_links(related_links){
        //check if related_links is null or undefined
        if(related_links == null || related_links == undefined){
            throw new Error("Related links is null or undefined");
        }
        //check if related_links is empty
        if(related_links.length == 0){
            throw new Error("Related links is empty");
        }

        this._related_links = related_links;
    }
    set about(about){
        //check if about is null or undefined
        if(about == null || about == undefined){
            throw new Error("About is null or undefined");
        }
        //check if about is empty
        if(about.length == 0){
            throw new Error("About is empty");
        }

        this._about = about;
    }
    set image_url(image_url){
        //check if image_url is null or undefined
        if(image_url == null || image_url == undefined){
            throw new Error("Image url is null or undefined");
        }
        //check if image_url is empty
        if(image_url.length == 0){
            throw new Error("Image url is empty");
        }

        this._image_url = image_url;
    }


}

// add a location to the database

function addLocation(location){
    var coordinate_latitude = location.coordinate_latitude;
    var coordinate_longitude = location.coordinate_longitude;
    var location_name = location.location_name;
    var fun_facts = location.fun_facts;
    var related_links = location.related_links;
    var about = location.about;
    var image_url = location.image_url;

    var sql = "INSERT INTO locations (coordinate_latitude,coordinate_longitude,location_name,fun_facts,related_links,about,image_url) VALUES ("+coordinate_latitude+","+coordinate_longitude+",'"+location_name+"','"+fun_facts+"','"+related_links+"','"+about+"','"+image_url+"')";

    return new Promise ((resolve,reject) => {
        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Location added!");
            console.log(result);
        
            resolve("Location added!");
            
        });
    });
}

// get a location from the database

function getLocation(coordinate_latitude,coordinate_longitude){
    
    return new Promise ((resolve,reject) => {
        var location = new Location();
        location.coordinate_latitude = coordinate_latitude;
        location.coordinate_longitude = coordinate_longitude;


        var sql = "SELECT * FROM locations WHERE coordinate_latitude = "+coordinate_latitude+" AND coordinate_longitude = "+coordinate_longitude;
        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Location retrieved!");
            console.log(result);

            resolve(result);
         
        });
    });
}

//My SQL query to get location by name

function getLocation(location_name){
    return new Promise ((resolve,reject) => {
        //check if location_name is null or undefined
        if(location_name == null || location_name == undefined){
            reject(new Error("Location name is null or undefined"));
        }

        var sql = "SELECT * FROM locations WHERE location_name = '"+location_name+"'";
        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Location retrieved!");
            console.log(result);

            resolve(result);
         
        });
    });
}

//My SQL query to get all locations

function getLocationList(){
    var sql = "SELECT * FROM locations";
    return new Promise ((resolve,reject) => {
        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Location list retrieved!");
            console.log(result);

            resolve(result);
         
        });
    });
}

// My SQL query to delete a location by name

function deleteLocation(location_name){
    return new Promise ((resolve,reject) => {
        //check if location_name is null or undefined
        if(location_name == null || location_name == undefined){
            reject(new Error("Location name is null or undefined"));
        }

        var sql = "DELETE FROM locations WHERE location_name = '"+location_name+"'";
        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Location deleted!");
            console.log(result);
            
            resolve("Location deleted!");

        });
    });
}


// REST API GET for locations using coordinates or location name
app.get("/getLocation",function(req,res){
    try{
        //check for undefined or null for coordinate_latitude and coordinate_longitude and location_name
        if((req.query.coordinate_latitude == undefined || req.query.coordinate_longitude == undefined) & req.query.location_name == undefined){
            throw new Error("Undefined or null values!");
        }else if (req.query.location_name == undefined){
            var location = getLocation(req.query.coordinate_latitude,req.query.coordinate_longitude);
            location.then(function(result){
                res.send(result);
            })
            .catch(function(err){
                res.status(500).send(err.message);
            });
        }else{
       
            var location = getLocation(decodeURI(req.query.location_name));
            location.then(function(result){
                res.send(result);
            })
            .catch(function(err){
                res.status(500).send(err.message);
            });
        }

        
    }catch (error) {
        res.status(500).send(error.message);
    }
});

// REST API GET method to get all locations
app.get("/getLocationList",function(req,res){ 
    try{
        var locationList = getLocationList();
        locationList.then(function(result){
            res.send(result);
        })
        .catch(function(err){
            res.status(500).send(err.message);
        });
    }catch (error) {
        res.status(500).send(error.message);
    }
});

// REST API POST method to add a location
app.post("/addLocation",function(req,res){
    try{
        //check for undefined or null
        if(req.body.coordinate_latitude == undefined || req.body.coordinate_longitude == undefined || req.body.location_name == undefined || req.body.fun_facts == undefined || req.body.related_links == undefined || req.body.about == undefined || req.body.image_url == undefined){
            throw new Error("Undefined or null values!");
        }

        var location = new Location(req.body.coordinate_latitude,req.body.coordinate_longitude,req.body.location_name,req.body.fun_facts,req.body.related_links,req.body.about,req.body.image_url);
        console.log(location);

        addLocation(location).then(function(result){
            res.send(result);
        }).catch(function(err){
            res.status(500).send(err.message);
        });
        
    }catch (error) {    
        res.status(500).send(error.message);
    }
});

// REST API DELETE method to delete a location
app.delete("/deleteLocation",function(req,res){    

    var location = deleteLocation(decodeURI(req.query.location_name));
    location.then(function(result){
        res.send(result);
    }).catch(function(err){
        res.status(500).send(err.message);
    });
});
    

