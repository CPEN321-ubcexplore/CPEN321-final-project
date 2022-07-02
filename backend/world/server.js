const { TIMEOUT } = require("dns");
var express = require("express");
var app = express();
app.use(express.json());

var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql",
});




async function run(){
    try{
        
        //create server
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
 //connect to database  
 con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
    run();    
});




function addMessage(message){
    

    var coordinate_latitude = message.getCoordinate_latitude();
    var coordinate_longitude = message.getCoordinate_longitude();
    var message_text = message.getMessage_text();
    var user_account_id = message.getUser_account_id();

    var sql = "INSERT INTO messages (coordinate_latitude,coordinate_longitude,message_text,user_account_id) VALUES ("+coordinate_latitude+","+coordinate_longitude+",'"+message_text+"',"+user_account_id+")";

    return new Promise ((resolve,reject) => {
        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Message added!");
            console.log(result);
        
            resolve("Message added!");
            
        });
    });    
}

function getMessage(coordinate_latitude,coordinate_longitude){
    var sql = "SELECT * FROM messages WHERE coordinate_latitude = "+coordinate_latitude+" AND coordinate_longitude = "+coordinate_longitude;
    return new Promise ((resolve,reject) => {
        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Message retrieved!");
            console.log(result);
        
            resolve(result);
            
        });
    });
}


class Message{
    constructor(coordinate_latitude,coordinate_longitude,message_text,user_account_id){ 
        this.coordinate_latitude = coordinate_latitude;
        this.coordinate_longitude = coordinate_longitude;

        if(message_text.length > 255){
            throw new Error("Message is too long!");
        }else{
            this.message_text = message_text;
        }   

        this.user_account_id = user_account_id;
    }

    getCoordinate_latitude(){
        return this.coordinate_latitude;
    }
    getCoordinate_longitude(){
        return this.coordinate_longitude;
    }
    getMessage_text(){
        return this.message_text;
    }
    getUser_account_id(){
        return this.user_account_id;
    }
    setMessage(message_text){
        if(message_text.length > 255){
            throw new Error("Message is too long!");
        }else{
            this.message_text = message_text;
        }        
    }
}


app.post("/addMessage",function(req,res){
    try{
        //check for undefined or null
        if(req.body.coordinate_latitude == undefined || req.body.coordinate_longitude == undefined || req.body.message_text == undefined || req.body.user_account_id == undefined){
            throw new Error("Undefined or null values!");
        }


        var message = new Message(req.body.coordinate_latitude,req.body.coordinate_longitude,req.body.message_text,req.body.user_account_id);
        console.log(message);


        addMessage(message).then(function(result){
            res.send(result);
        }).catch(function(err){
            res.status(500).send(err.message);
        });
        
    }catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/getMessage",function(req,res){
    
    console.log(req.query);
    var message = getMessage(req.query.coordinate_latitude,req.query.coordinate_longitude);
    message.then(function(result){
        res.send(result);
    })
    .catch(function(err){
        res.status(500).send(err.message);
    });        
});


// setTimeout(()=>{console.log(getMessage(0,0));},5000);