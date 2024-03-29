var express = require("express");
var app = express();

const socket_server = require("http").Server(app);
const io = require("socket.io")(socket_server);

app.use(express.json());

var mysql = require("mysql");

// database connection
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mysql",
});

const PORT = 8081;

async function run() {
    try {
        // // create server
        // var http_server = app.listen(serverPort,(req,res) =>{
        //     var host = http_server.address().address;
        //     var port = http_server.address().port;
        //     console.log("Example http_server running at http://%s:%s",host,port);
        // });

        con.query("USE world_database", function (err, result) {
            if (err) throw err;
            console.log("Using database world_database");
        });

        // create socket
        socket_server.listen(PORT, (req, res) => {
            var host = socket_server.address().address;
            var port = socket_server.address().port;
            console.log(
                "Example socket_server running at http://%s:%s",
                host,
                port
            );
        });
    } catch (err) {
        console.log(err);
    }
}
// connect to database
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to database!");
    run();
});

// connect to client via socket
var glb_socket;
io.on("connection", function (socket) {
    glb_socket = socket;
    console.log("Client connected");
    socket.on("join", function (data) {
        console.log("Client joined: " + data);
    });
});

function emitSocketEvents(event, result) {
    if (glb_socket) {
        glb_socket.emit(event, result);
    }
}

// CLASSES

class Message {
    // MYSQL Message Table params into string from database_queries/world_database_messages.sql
    static paramsName() {
        return {
            table_name: "messages",
            id: "id",
            coordinate_latitude: "coordinate_latitude",
            coordinate_longitude: "coordinate_longitude",
            message_text: "message_text",
            user_account_id: "user_account_id",
        };
    }

    constructor(
        coordinate_latitude,
        coordinate_longitude,
        message_text,
        user_account_id
    ) {
        this.coordinate_latitude = coordinate_latitude;
        this.coordinate_longitude = coordinate_longitude;
        this.message_text = message_text;
        this.user_account_id = user_account_id;
    }

    // Getters
    get coordinate_latitude() {
        return this._coordinate_latitude;
    }
    get coordinate_longitude() {
        return this._coordinate_longitude;
    }
    get message_text() {
        return this._message_text;
    }
    get user_account_id() {
        return this._user_account_id;
    }

    // Setters
    set coordinate_latitude(coordinate_latitude) {
        //check if coordinate_latitude is a number
        if (isNaN(coordinate_latitude)) {
            throw new Error("Coordinate latitude is not a number");
        }
        //check if coordinate_latitude is between -90 and 90
        if (coordinate_latitude < -90 || coordinate_latitude > 90) {
            throw new Error("Coordinate latitude is not between -90 and 90");
        }

        this._coordinate_latitude = coordinate_latitude;
    }
    set coordinate_longitude(coordinate_longitude) {
        //check if coordinate_longitude is a number
        if (isNaN(coordinate_longitude)) {
            throw new Error("Coordinate longitude is not a number");
        }
        //check if coordinate_longitude is between -180 and 180
        if (coordinate_longitude < -180 || coordinate_longitude > 180) {
            throw new Error("Coordinate longitude is not between -180 and 180");
        }

        this._coordinate_longitude = coordinate_longitude;
    }
    set message_text(message_text) {
        //check if message_text is a string
        if (typeof message_text !== "string") {
            throw new Error("Message text is not a string");
        }
        //check if message_text is between 1 and 255 characters
        if (message_text.length < 1 || message_text.length > 255) {
            throw new Error("Message text is not between 1 and 255 characters");
        }

        this._message_text = message_text;
    }
    set user_account_id(user_account_id) {
        //check if user_account_id is a number
        if (isNaN(user_account_id)) {
            throw new Error("User account id is not a number");
        }
        //check if user_account_id is non-negative
        if (user_account_id < 0) {
            throw new Error("User account id is negative");
        }

        this._user_account_id = user_account_id;
    }
}
// get messages from database by various parameters, coordinates +- 0.01, user_account_id, message_text
async function getMessagesByParameters(
    id,
    coordinate_latitude,
    coordinate_longitude,
    radius = 0,
    message_text,
    user_account_id
) {
    return new Promise((resolve, reject) => {
        var sql = `SELECT * FROM ${Message.paramsName().table_name} WHERE`;
        if (id !== undefined) {
            if (isNaN(id)) {
                reject(Error("Id is not a number"));
            } else {
                sql += ` ${Message.paramsName().id} = ${id} AND `;
            }
        }
        if (coordinate_latitude !== undefined) {
            if (isNaN(coordinate_latitude)) {
                reject(Error("Coordinate latitude is not a number"));
            } else {
                coordinate_latitude = parseFloat(coordinate_latitude);
                radius = parseFloat(radius);
                sql += ` ${Message.paramsName().coordinate_latitude} BETWEEN ${
                    coordinate_latitude - radius
                } AND ${coordinate_latitude + radius} AND `;
            }
        }
        if (coordinate_longitude !== undefined) {
            if (isNaN(coordinate_longitude)) {
                reject(Error("Coordinate longitude is not a number"));
            } else {
                coordinate_longitude = parseFloat(coordinate_longitude);
                radius = parseFloat(radius);
                sql += ` ${Message.paramsName().coordinate_longitude} BETWEEN ${
                    coordinate_longitude - radius
                } AND ${coordinate_longitude + radius} AND `;
            }
        }
        if (message_text !== undefined) {
            sql += ` ${
                Message.paramsName().message_text
            } = '${message_text}' AND `;
        }
        if (user_account_id !== undefined) {
            sql += ` ${
                Message.paramsName().user_account_id
            } = ${user_account_id} AND `;
        }
        sql = sql.slice(0, -5);

        //console.log(sql);

        con.query(sql, function (err, result) {
            if (err) reject(err);
            //console.log("Message retrieved");
            resolve(result);
        });
    });
}
// Message functions
// add message to database
async function addMessage(
    coordinate_latitude,
    coordinate_longitude,
    message_text,
    user_account_id
) {
    return new Promise((resolve, reject) => {
        var message = new Message(
            coordinate_latitude,
            coordinate_longitude,
            message_text,
            user_account_id
        );
        var sql = `REPLACE INTO ${Message.paramsName().table_name} (${
            Message.paramsName().coordinate_latitude
        },${Message.paramsName().coordinate_longitude},${
            Message.paramsName().message_text
        },${Message.paramsName().user_account_id})
            VALUES (${message.coordinate_latitude},${
            message.coordinate_longitude
        },'${message.message_text}',${message.user_account_id})`;

        //Check if coordinate_latitude and coordinate_longitude already exisits in database
        getMessagesByParameters(
            undefined,
            message.coordinate_latitude,
            message.coordinate_longitude
        )
            .then(function (result) {
                if (result.length > 0) {
                    reject(new Error("Cannot add a message there"));
                } else {
                    con.query(sql, function (err, result) {
                        if (err) reject(err);
                        //console.log("Message added");

                        // get the just created location
                        getMessagesByParameters(result.insertId)
                            .then((result) => {
                                resolve(result);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

// update message in database by id
async function updateMessage(
    id,
    coordinate_latitude,
    coordinate_longitude,
    message_text,
    user_account_id
) {
    return new Promise((resolve, reject) => {
        var message = new Message(
            coordinate_latitude,
            coordinate_longitude,
            message_text,
            user_account_id
        );
        var sql = `UPDATE ${Message.paramsName().table_name} SET ${
            Message.paramsName().coordinate_latitude
        } = ${message.coordinate_latitude}`;
        sql += `,${Message.paramsName().coordinate_longitude} = ${
            message.coordinate_longitude
        }`;
        sql += `,${Message.paramsName().message_text} = '${
            message.message_text
        }'`;
        sql += `,${Message.paramsName().user_account_id} = ${
            message.user_account_id
        }
            WHERE id = ${id}`;

        con.query(sql, function (err, result) {
            if (err) reject(err);
            //console.log("Message updated");

            // get the just updated location
            getMessagesByParameters(id)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });
}

// delete message from database by id
async function deleteMessage(id) {
    return new Promise((resolve, reject) => {
        var sql = `DELETE FROM ${Message.paramsName().table_name} WHERE ${
            Message.paramsName().id
        } = ${id}`;

        con.query(sql, function (err, result) {
            if (err) reject(err);
            //console.log("Message deleted");
            resolve(result);
        });
    });
}

// delete all messages from database
async function deleteAllMessages() {
    return new Promise((resolve, reject) => {
        var sql = `TRUNCATE TABLE ${Message.paramsName().table_name}`;

        con.query(sql, function (err, result) {
            if (err) reject(err);
            //console.log("All messages deleted");
            resolve(result);
        });
    });
}

// Routing

// REST API for messages

// REST API for POST, GET message
app.post("/", function (req, res) {
    if (req.body.coordinate_latitude == undefined) {
        res.status(400).send("Coordinate latitude is missing");
    } else if (req.body.coordinate_longitude == undefined) {
        res.status(400).send("Coordinate longitude is missing");
    } else if (req.body.message_text == undefined) {
        res.status(400).send("Message text is missing");
    } else if (req.body.user_account_id == undefined) {
        res.status(400).send("User account id is missing");
    } else {
        var coordinate_latitude = req.body.coordinate_latitude;
        var coordinate_longitude = req.body.coordinate_longitude;
        var message_text = req.body.message_text;
        var user_account_id = req.body.user_account_id;

        addMessage(
            coordinate_latitude,
            coordinate_longitude,
            message_text,
            user_account_id
        )
            .then((result) => {
                res.status(201).send(result);

                // real time update socket clients
                setTimeout(() => {
                    emitSocketEvents("addMessages", result);
                }, 1000);
            })
            .catch((err) => {
                res.status(400).send(err.message);
            });
    }
}).get("/", function (req, res) {
    var id = req.query.id;
    var coordinate_latitude = req.query.coordinate_latitude;
    var coordinate_longitude = req.query.coordinate_longitude;
    var radius = req.query.radius;
    var message_text = req.query.message_text;

    if (req.query.message_text !== undefined) {
        message_text = decodeURIComponent(req.query.message_text);
    }

    var user_account_id = req.query.user_account_id;

    getMessagesByParameters(
        id,
        coordinate_latitude,
        coordinate_longitude,
        radius,
        message_text,
        user_account_id
    )
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(400).send(err.message);
        });
});

// REST API for delete all messages
app.delete("/all", function (req, res) {
    deleteAllMessages()
        .then((result) => {
            res.status(200).send("All messages deleted");
        })
        .catch((err) => {
            res.status(400).send(err.message);
        });
});

// REST API for GET, PUT, DELETE message by id
app.get("/:id", function (req, res) {
    getMessagesByParameters((id = req.params.id))
        .then((result) => {
            //check if a message exists from result
            if (result.length > 0) {
                res.status(200).send(result);
            } else {
                res.status(404).send(result);
            }
        })
        .catch((err) => {
            res.status(404).send(err.message);
        });
})
    .put("/:id", function (req, res) {
        updateMessage(
            req.params.id,
            req.body.coordinate_latitude,
            req.body.coordinate_longitude,
            req.body.message_text,
            req.body.user_account_id
        )
            .then((result) => {
                // check if a message exists from result
                if (result.length > 0) {
                    res.status(200).send(result);
                    // real time update socket clients
                    setTimeout(() => {
                        emitSocketEvents("updateMessages", result);
                    }, 1000);
                } else {
                    res.status(404).send("Id does not exist");
                }
            })
            .catch((err) => {
                res.status(400).send(err.message);
            });
    })
    .delete("/:id", function (req, res) {
        deleteMessage(req.params.id)
            .then((result) => {
                res.status(200).send("Message deleted");

                // real time update socket clients
                setTimeout(() => {
                    emitSocketEvents("deleteMessages", req.params.id);
                }, 1000);
            })
            .catch((err) => {
                res.status(400).send(err.message);
            });
    });

module.exports = {
    app,
    socket_server,
    con,
};
