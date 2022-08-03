const io = require("socket.io-client");

var message = {
    ID: 1,
    coordinate_latitude: 49,
    coordinate_longitude: -125,
    message_text: "Hello",
    user_account_id: "1",
};
var message2 = {
    ID: 2,
    coordinate_latitude: 49.25,
    coordinate_longitude: -125.2,
    message_text: "I have the highest latitude",
    user_account_id: "2",
};
var message3 = {
    ID: 3,
    coordinate_latitude: 49.25,
    coordinate_longitude: -125.2,
    message_text: "I have the highest latitude LULO",
    user_account_id: "2",
};

const addMessage = jest.fn(() => {
    return message;
});
const deleteMessage = jest.fn(() => {
    return "Message deleted";
});
const updateMessage = jest.fn(() => {
    return message;
});
const getMessagesByParameters = jest.fn(() => {
    return [message, message2];
});

test("Add messages", () => {
    let result = addMessage();
    expect(result).toBe(message);
});
test("Get message by parameter", () => {
    expect(getMessagesByParameters()).toEqual([message, message2]);
});
test("Update message", () => {
    expect(updateMessage()).toBe(message);
});
test("Delete message", () => {
    expect(deleteMessage()).toBe("Message deleted");
});

// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app = require("../messages_server");
var socket = io.connect("http://localhost:8081", { reconnect: true });
describe(`Messages Testing API`, () => {
    beforeAll(async () => {
        console.log("check 1", socket.connected);
        socket.on("connect", function () {
            console.log("check 2", socket.connected);
        });

        socket.emit("join", "messages");

        // socket.on('updateMessages', (data) => {
        //     console.log(data);
        // });
        // socket.on('deleteMessages', (data) => {
        //     console.log(data);
        // });
        // socket.on('addMessages', (data) => {
        //     console.log(data);
        // });

        await new Promise((r) => setTimeout(r, 1000));
    });
    afterAll(async () => {
        await new Promise((resolve) => setTimeout(() => resolve(), 4500)); // avoid jest open handle error
    });

    describe(`DELETE /all`, () => {
        it(`should "All messages deleted" with Status code:200`, async () => {
            const response = await request(app).delete(`/all`);
            await expect(response.text).toBe(`All messages deleted`);
            await expect(response.statusCode).toBe(200);
        });
    });

    describe(`GET /`, () => {
        test(`It should respond with an empty arrayObject of messages`, async () => {
            const response = await request(app).get(`/`);
            await expect(response.text).toEqual("[]");
            await expect(response.statusCode).toBe(200);
        });
    });

    describe(`POST /`, () => {
        test(`Add message with missing coordinate_latitude and
        get '`, async () => {
            const response = await request(app).post(`/`).send({
                coordinate_longitude: -125,
                message_text: "Hello",
                user_account_id: "1",
            });
            await expect(response.text).toEqual(
                `Coordinate latitude is missing`
            );
            await expect(response.statusCode).toBe(400);
        });
        test(`Add message with missing coordinate_longitude`, async () => {
            const response = await request(app).post(`/`).send({
                coordinate_latitude: 49,
                message_text: "Hello",
                user_account_id: "1",
            });
            await expect(response.text).toEqual(
                `Coordinate longitude is missing`
            );
            await expect(response.statusCode).toBe(400);
        });
        test(`Add message with missing message_text`, async () => {
            const response = await request(app).post(`/`).send({
                coordinate_latitude: 49,
                coordinate_longitude: -125,
                user_account_id: "1",
            });
            await expect(response.text).toEqual(`Message text is missing`);
            await expect(response.statusCode).toBe(400);
        });
        test(`Add message with missing user_account_id`, async () => {
            const response = await request(app).post(`/`).send({
                coordinate_latitude: 49,
                coordinate_longitude: -125,
                message_text: "Hello",
            });
            await expect(response.text).toEqual(`User account id is missing`);
            await expect(response.statusCode).toBe(400);
        });
        test(`Add message with invalid coordinate_latitude and get 
        “Coordinate latitude is not between -90 and 90"
        Status code:400
        `, async () => {
            const response = await request(app).post(`/`).send({
                coordinate_latitude: 91,
                coordinate_longitude: -125,
                message_text: "Hello",
                user_account_id: "1",
            });
            await expect(response.text).toEqual(
                `Coordinate latitude is not between -90 and 90`
            );
            await expect(response.statusCode).toBe(400);
        });

        test(`Add message with invalid coordinate_longitude and get
        “Coordinate longitude is not between -180 and 180”
        Status code:400
        `, async () => {
            const response = await request(app).post(`/`).send({
                coordinate_latitude: 49,
                coordinate_longitude: -181,
                message_text: "Hello",
                user_account_id: "1",
            });
            await expect(response.text).toEqual(
                `Coordinate longitude is not between -180 and 180`
            );
            await expect(response.statusCode).toBe(400);
        });

        test(`Add message with Add message with text greater than 255
        and get “Message text is not between 1 and 255 characters”
        Status code:400
        `, async () => {
            const response = await request(app)
                .post(`/`)
                .send({
                    coordinate_latitude: 49,
                    coordinate_longitude: -125,
                    message_text: "Hello".repeat(256),
                    user_account_id: "1",
                });
            await expect(response.text).toEqual(
                `Message text is not between 1 and 255 characters`
            );
            await expect(response.statusCode).toBe(400);
        });

        test(`Add message on new coordinates and get
        “Message added”
        Status code: 200
        `, async () => {
            var message_to_add = message;
            const response = await request(app).post(`/`).send(message_to_add);
            await expect(JSON.parse(response.text)).toEqual([message_to_add]);
            await expect(response.statusCode).toBe(201);

            
            socket.on("addMessages", (data) => {
                expect(data).toEqual([message_to_add]);
            });
            await new Promise((r) => setTimeout(r, 1000));
            socket.removeAllListeners("addMessages");
            
        });
        test(`Add message on new coordinates and get
        “Message added”
        Status code: 200
        `, async () => {
            var message_to_add = message2;
            const response = await request(app).post(`/`).send(message_to_add);
            await expect(JSON.parse(response.text)).toEqual([message_to_add]);
            await expect(response.statusCode).toBe(201);     
            socket.on("addMessages", (data) => {
                expect(data).toEqual([message_to_add]);
            });
            await new Promise((r) => setTimeout(r, 1000));
            socket.removeAllListeners("addMessages");  
        });
        test(`Add message on existing coordinates and get
        “Cannot add a message there”
        Status code: 400
        `, async () => {
            var message_to_add = message3;
            const response = await request(app).post(`/`).send(message_to_add);
            await expect(response.text).toEqual(`Cannot add a message there`);
            await expect(response.statusCode).toBe(400);
        });
    });

    describe(`GET /:id after POST`, () => {
        test(`Get message with blank id and get
        all the messages inside the database
        Status code:200
        `, async () => {
            const response = await request(app).get(`/`);
            await expect(response.statusCode).toBe(200);
            await expect(JSON.parse(response.text)).toEqual([
                message,
                message2,
            ]);
        });
        test(`Get message with existing id and get
        the message with the associated id
        Status code:200`, async () => {
            const response = await request(app).get(`/1`);
            await expect(response.statusCode).toBe(200);
            await expect(JSON.parse(response.text)).toEqual([message]);
        });

        test(`Get message with non-existing id and get
        an empty array
        Status code:404`, async () => {
            const response = await request(app).get(`/20`);
            await expect(response.statusCode).toBe(404);
            await expect(JSON.parse(response.text)).toEqual([]);
        });
        test(`Get message with invalid id and get
        an empty array
        Status code:404`, async () => {
            const response = await request(app).get(`/a`);
            await expect(response.statusCode).toBe(404);
            await expect(JSON.parse(response.text)).toEqual([]);
        });
        test(`Get a message with coordinates = (49,-125) and radius = 10. and get
        all the messages inside the radius of 10 with the coordinates (49,125)
        Status code:200`, async () => {
            const response = await request(app).get(
                `/?coordinate_latitude=49&coordinate_longitude=-125&radius=10`
            );
            await expect(response.statusCode).toBe(200);
            await expect(JSON.parse(response.text)).toEqual([
                message,
                message2,
            ]);
        });
        test(`Get a message with message_text = "Hello" and get
        all the messages with the message_text "Hello"
        Status code:200`, async () => {
            const response = await request(app).get(`/?message_text=Hello`);
            await expect(response.statusCode).toBe(200);
            await expect(JSON.parse(response.text)).toEqual([
                message,
                
            ]);
        });
        test(`Get a message with coordinate_latitude = a and get
        an empty array
        Status code:200`, async () => {
            const response = await request(app).get(
                `/?coordinate_latitude=a`
            );
            await expect(response.statusCode).toBe(400);
            await expect(response.text).toEqual([]);
        });
        test(`Get messages with existing user_account_id and get
        all the messages with the associated user_account_id
        Status code:200`, async () => {
            const response = await request(app).get(`/?user_account_id='1'`);
            await expect(response.statusCode).toBe(200);
            await expect(JSON.parse(response.text)).toEqual([message]);
        });
    });

    describe(`PUT /:id`, () => {
        test(`Update message with blank id and get
        Status code:404`, async () => {
            const response = await request(app).put(`/`);
            await expect(response.statusCode).toBe(404);
        });
        test(`Update message with existing id and get
        the updated message with the associated id
        Status code:200 `, async () => {
            const message_to_update = message;
            const response = await request(app)
                .put(`/1`)
                .send(message_to_update);
            await expect(JSON.parse(response.text)).toEqual([
                message_to_update,
            ]);
            await expect(response.statusCode).toBe(200);
            socket.on("updateMessages", (data) => {
                expect(data.text).toEqual([message_to_update]);
                
            });
            await new Promise((r) => setTimeout(r, 1000));
            socket.removeAllListeners("updateMessages");
            
        });
        test(`Update message with existing id but with Nan coordinate_latitude and get
        "Coordinate latitude is not a number"
        Status code:400`, async () => {
            const response = await request(app).put(`/1`).send({
                coordinate_latitude: "NaN",
                coordinate_longitude: -125,
                message_text: "Hello",
                user_account_id: "1",
            });
            await expect(response.text).toEqual(
                `Coordinate latitude is not a number`
            );
            await expect(response.statusCode).toBe(400);
        });
        test(`Update message with existing id but with Nan coordinate_longitude and get
        "Coordinate longitude is not a number"
        Status code:400`, async () => {
            const response = await request(app).put(`/1`).send({
                coordinate_latitude: 49,
                coordinate_longitude: "NaN",
                message_text: "Hello",
                user_account_id: "1",
            });
            await expect(response.text).toEqual(
                `Coordinate longitude is not a number`
            );
            await expect(response.statusCode).toBe(400);
        });
        test(`Update message with existing id but with message_text not string and get
        "Message text is not a string"
        Status code:400`, async () => {
            const response = await request(app).put(`/1`).send({
                coordinate_latitude: 49,
                coordinate_longitude: -125,
                message_text: null,
                user_account_id: "1",
            });
            await expect(response.text).toEqual(`Message text is not a string`);
            await expect(response.statusCode).toBe(400);
        });
        test(`Update message with existing id but with user_account_id not a number and get
        "User account id is not a number"
        Status code:400`, async () => {
            const response = await request(app).put(`/1`).send({
                coordinate_latitude: 49,
                coordinate_longitude: -125,
                message_text: "Hello",
                user_account_id: "NaN",
            });
            await expect(response.text).toEqual(
                `User account id is not a number`
            );
            await expect(response.statusCode).toBe(400);
        });
        test(`Update message with existing id but with user_account_id is negative and get
        "User account id is negative"
        Status code:400`, async () => {
            const response = await request(app).put(`/1`).send({
                coordinate_latitude: 49,
                coordinate_longitude: -125,
                message_text: "Hello",
                user_account_id: -1,
            });
            await expect(response.text).toEqual(`User account id is negative`);
            await expect(response.statusCode).toBe(400);
        });

        test(`Update message with non-existing id and get
        "Cannot update"
        Status code:404`, async () => {
            const response = await request(app).put(`/20`).send({
                coordinate_latitude: 49,
                coordinate_longitude: -125,
                message_text: "Hello",
                user_account_id: "1",
            });
            await expect(response.text).toEqual(`Cannot update`);
            await expect(response.statusCode).toBe(404);
        });
    });

    describe(`DELETE /:id`, () => {
        test(`Delete message with blank id and get
        Status code:404`, async () => {
            const response = await request(app).delete(`/`);
            await expect(response.statusCode).toBe(404);
        });
        test(`Delete message with existing id and get
        "Message deleted”
        Status code:200`, async () => {
            const response = await request(app).delete(`/1`);
            await expect(response.text).toEqual(`Message deleted`);
            await expect(response.statusCode).toBe(200);
        });
        test(`Delete message with non-existing id and get
        “Message deleted”
        Status code:200`, async () => {
            const id = 3;
            const response = await request(app).delete(`/${id}`);
            await expect(response.text).toEqual(`Message deleted`);
            await expect(response.statusCode).toBe(200);

            socket.on("deleteMessages", (data) => {
                expect(JSON.parse(data.text)).toEqual(id);
            });
            await new Promise((r) => setTimeout(r, 1000));
            socket.removeAllListeners("deleteMessages");
        });
    });

    describe(`GET / after DELETE`, () => {
        test(`Get message with deleted id and get
        all messages
        Status code:200`, async () => {
            const response = await request(app).get(`/`);
            await expect(response.statusCode).toBe(200);
            await expect(JSON.parse(response.text)).toEqual([message2]);
        });
    });
});
