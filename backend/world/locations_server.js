
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
        var server = app.listen(8083,(req,res) =>{
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

// CLASS Locations

class Location{
    constructor(location_name,coordinate_latitude,coordinate_longitude,fun_facts,related_links,about,image_url,access_permission = "PUBLIC"){        
        this.coordinate_latitude = coordinate_latitude;
        this.coordinate_longitude = coordinate_longitude;        
        this.location_name = location_name;
        this.fun_facts = fun_facts;
        this.related_links = related_links;
        this.about = about;
        this.image_url = image_url;
        this.access_permission = access_permission;
    }

    // Getters
    get coordinate_latitude(){ return this._coordinate_latitude; }
    get coordinate_longitude(){ return this._coordinate_longitude; }
    get location_name(){ return this._location_name; }
    get fun_facts(){ return this._fun_facts; }
    get related_links(){ return this._related_links; }
    get about(){ return this._about; }
    get image_url(){ return this._image_url; }
    get access_permission(){ return this._access_permission; }

    // Setters
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
    set location_name(location_name){
        //check if location_name is a string
        if(typeof location_name !== "string"){
            throw new Error("Location name is not a string");
        }
        //check if location_name is between 1 and 255 characters
        if(location_name.length < 1 || location_name.length > 255){
            throw new Error("Location name is not between 1 and 255 characters");
        }

        this._location_name = location_name;
    }
    set fun_facts(fun_facts){
        //check if fun_facts is a string
        if(typeof fun_facts !== "string"){
            throw new Error("Fun facts is not a string");
        }        

        this._fun_facts = fun_facts;
    }
    set related_links(related_links){
        //check if related_links is a string
        if(typeof related_links !== "string"){
            throw new Error("Related links is not a string");
        }        

        this._related_links = related_links;
    }
    set about(about){
        //check if about is a string
        if(typeof about !== "string"){
            throw new Error("About is not a string");
        }        

        this._about = about;
    }
    set image_url(image_url){
        //check if image_url is a string
        if(typeof image_url !== "string"){
            throw new Error("Image url is not a string");
        }        

        this._image_url = image_url;
    }
    set access_permission(access_permission_value){
        var access_permission_type = {"PUBLIC":0,"PRIVATE":1};        
        console.log(access_permission_value);
        //check if access_permission_value is a either "PUBLIC" or "PRIVATE"
        if(access_permission_type[access_permission_value] === undefined){
            throw new Error("Access permission is not either \"PUBLIC\" or \"PRIVATE\"");
        }
        
        this._access_permission = access_permission_value;
    }
}

// Location functions

// add location in database
async function addLocation(location_name,coordinate_latitude,coordinate_longitude,fun_facts,related_links,about,image_url,access_permission){
    return new Promise((resolve,reject) =>{
        var location = new Location(location_name,coordinate_latitude,coordinate_longitude,
            fun_facts,related_links,about,image_url,access_permission);
        var sql = `INSERT INTO locations (coordinate_latitude,coordinate_longitude,location_name,
            fun_facts,related_links,about,image_url,access_permission) VALUES
             (${location.coordinate_latitude},${location.coordinate_longitude},'${location.location_name}','${location.fun_facts}','${location.related_links}','${location.about}','${location.image_url}','${location.access_permission}')`;

        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Location added");
            resolve(result);
        });
    });
}

// update location in database
async function updateLocation(location_name,coordinate_latitude,coordinate_longitude,fun_facts,related_links,about,image_url,access_permission){
    return new Promise((resolve,reject) =>{
        //console.log(location_name,coordinate_latitude,coordinate_longitude,fun_facts,related_links,about,image_url,access_permission);
        var location = new Location(location_name,coordinate_latitude,coordinate_longitude,
            fun_facts,related_links,about,image_url,access_permission);

            //console.log(location);

        var sql = `UPDATE locations SET coordinate_latitude = ${location.coordinate_latitude},
            coordinate_longitude = ${location.coordinate_longitude},location_name = '${location.location_name}',
            fun_facts = '${location.fun_facts}',related_links = '${location.related_links}',about = '${location.about}',
            image_url = '${location.image_url}',access_permission = '${location.access_permission}'
            WHERE location_name = '${location_name}'`;

        console.log(sql);

        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Location updated");
            resolve(result);
        });
    });
}

// get messages from database by various parameters, coordinates +- 0.01, location_name, fun_facts, related_links, about, image_url, access_permission
async function getLocationsByParameters(location_name,id,coordinate_latitude,coordinate_longitude,radius = 0,fun_facts,related_links,about,image_url,access_permission){
    return new Promise((resolve,reject) =>{
        var sql = `SELECT * FROM locations WHERE`;
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
        if(location_name !== undefined){
            sql += ` location_name = '${location_name}' AND `;
        }
        if(fun_facts !== undefined){
            sql += ` fun_facts = '${fun_facts}' AND `;
        }
        if(related_links !== undefined){
            sql += ` related_links = '${related_links}' AND `;
        }
        if(about !== undefined){
            sql += ` about = '${about}' AND `;
        }
        if(image_url !== undefined){
            sql += ` image_url = '${image_url}' AND `;
        }
        if(access_permission !== undefined){
            sql += ` access_permission = '${access_permission}' AND `;
        }
        sql = sql.slice(0,-5);

        console.log(sql);

        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Location retrieved");
            resolve(result);
        });
    });
}

// delete location from database by location_name
async function deleteLocation(location_name){
    return new Promise((resolve,reject) =>{
        var sql = `DELETE FROM locations WHERE location_name = '${location_name}'`;

        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("Location deleted");
            resolve(result);
        });
    });
}

// delete all locations from database
async function deleteAllLocations(){
    return new Promise((resolve,reject) =>{
        var sql = 'TRUNCATE TABLE locations';

        con.query(sql,function(err,result){
            if(err) reject(err);
            console.log("All locations deleted");
            resolve(result);
        });
    });
}

// get all user unlocked locations from API
async function getLocationsByUserAccountId(user_account_id){
    return new Promise((resolve,reject) =>{
        var url = 'http://localhost/users/${user_account_id}';
        request(url,function(err,res,body){
            if(err) reject(err);

            var user_account = JSON.parse(body);
            var unlocked_locations_id = user_account.locations;

            var unlocked_locations = "";

            for(var i = 0; i < unlocked_locations_id.length; i++){
                getLocationsByParameters(undefined,unlocked_locations_id[i]).then(function(result){
                    unlocked_locations += result;
                }
                ).catch(function(err){
                    reject(err);
                });
            }
            resolve(unlocked_locations);
        });
    });
}

// REST API for locations

// REST API for POST, GET location
app.post("/locations",function(req,res){
    console.log("CALLED");
    if (req.body.location_name == undefined){
        res.status(400).send("Location name is missing");
    }
    else if (req.body.coordinate_latitude == undefined){
        res.status(400).send("Coordinate latitude is missing");
    }
    else if (req.body.coordinate_longitude == undefined){
        res.status(400).send("Coordinate longitude is missing");
    }
    else if (req.body.fun_facts == undefined){
        res.status(400).send("Fun facts is missing");
    }
    else if (req.body.related_links == undefined){
        res.status(400).send("Related links is missing");
    }
    else if (req.body.about == undefined){
        res.status(400).send("About is missing");
    }
    else if (req.body.image_url == undefined){
        res.status(400).send("Image url is missing");
    }
    else{ 
        var location_name = req.body.location_name;
        var coordinate_latitude = req.body.coordinate_latitude;
        var coordinate_longitude = req.body.coordinate_longitude;
        var fun_facts = req.body.fun_facts;
        var related_links = req.body.related_links;
        var about = req.body.about;
        var image_url = req.body.image_url;
        var access_permission = req.body.access_permission;

        addLocation(location_name,coordinate_latitude,coordinate_longitude,fun_facts,related_links,about,image_url,access_permission)        
        .then(result =>{
            res.status(201).send("Location added");
        })
        .catch(err =>{
            res.status(400).send(err.message);
        });
    }
}).get("/locations",function(req,res){   
    var id = req.query.id;
    var location_name = req.query.location_name;
    var coordinate_latitude = req.query.coordinate_latitude;
    var coordinate_longitude = req.query.coordinate_longitude;
    var radius = req.query.radius;
    var fun_facts = req.query.fun_facts;
    var related_links = req.query.related_links;
    var about = req.query.about;
    var image_url = req.query.image_url;
    var access_permission = req.query.access_permission;

    if(location_name !== undefined){
        location_name = decodeURIComponent(location_name);
    }
    if(fun_facts !== undefined){
        fun_facts = decodeURIComponent(fun_facts);
    }
    if(related_links !== undefined){
        related_links = decodeURIComponent(related_links);
    }
    if(about !== undefined){
        about = decodeURIComponent(about);
    }
    if(image_url !== undefined){
        image_url = decodeURIComponent(image_url);
    }
    if(access_permission !== undefined){
        access_permission = decodeURIComponent(access_permission);
    }     

    getLocationsByParameters(location_name,id,coordinate_latitude,coordinate_longitude,radius,fun_facts,related_links,about,image_url,access_permission)
    .then(result =>{
        res.status(200).send(result);
    }
    ).catch(err =>{
        res.status(400).send(err.message);
    });
});

// REST API for delete all locations
app.delete("/locations/all",function(req,res){
    deleteAllLocations()
    .then(result =>{
        res.status(200).send("All locations deleted");
    }
    ).catch(err =>{
        res.status(400).send(err.message);
    });
});

// REST API for GET, PUT, DELETE location by location_name
app.get("/locations/:location_name",function(req,res){
    if (req.params.location_name == undefined){
        res.status(400).send("Location name is missing");
    }    
    getLocationsByParameters(location_name = req.params.location_name)
    .then(result =>{
        res.status(200).send(result);
    }
    ).catch(err =>{
        res.status(400).send(err.message);
    });
}
).put("/locations/:location_name",function(req,res){
    if (req.params.location_name == undefined){
        res.status(400).send("Location name is missing");
    }   
    updateLocation(req.params.location_name,req.body.coordinate_latitude,req.body.coordinate_longitude,req.body.fun_facts,req.body.related_links,req.body.about,req.body.image_url,req.body.access_permission)
    .then(result =>{
        res.status(200).send("Location updated");
    }
    ).catch(err =>{        
        res.status(400).send(err.message);
    });
}
).delete("/locations/:location_name",function(req,res){
    if (req.params.location_name == undefined){
        res.status(400).send("Location name is missing");
    }
    deleteLocation(req.params.location_name)
    .then(result =>{
        res.status(200).send("Location deleted");
    }
    ).catch(err =>{
        res.status(400).send(err.message);
    });
});

//REST API for GET location by user_account_id
app.get("/locations/user/:user_account_id",function(req,res){
    if (req.params.user_account_id == undefined){
        res.status(400).send("User account id is missing");
    }
    getLocationsByUserAccountId(req.params.user_account_id)
    .then(result =>{
        res.status(200).send(result);
    }
    ).catch(err =>{
        res.status(400).send(err.message);
    });
});