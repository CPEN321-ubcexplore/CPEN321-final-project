const { TIMEOUT } = require("dns");
var express = require("express");
var app = express();

var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql",
});




async function run(){
    try{
        //connect to database  
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected to database!");
            //create server
            var server = app.listen(8081,(req,res) =>{
                var host = server.address().address;
                var port = server.address().port;
                console.log("Example server running at http://%s:%s",host,port);
            });
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

run();
setTimeout(function(){},1000);
function addMessage(message){
    

    var coordinate_latitude = message.getCoordinate_latitude();
    var coordinate_longitude = message.getCoordinate_longitude();
    var message_text = message.getMessage_text();
    var user_account_id = message.getUser_account_id();

    var sql = "INSERT INTO messages (coordinate_latitude,coordinate_longitude,message_text,user_account_id) VALUES ("+coordinate_latitude+","+coordinate_longitude+",'"+message_text+"',"+user_account_id+")";

    con.query(sql,function(err,result){
        if(err) throw err;
        console.log("Message added!");
        console.log(result);
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

lorem_ipsum = new Message(0,0,"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut",1);

//addMessage(lorem_ipsum);