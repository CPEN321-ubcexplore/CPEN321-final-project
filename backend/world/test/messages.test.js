var message = {
    "ID":1,
    "coordinate_latitude": 49,
    "coordinate_longitude": -125,
    "message_text": "Hello",
    "user_account_id": '1'
};
var message2 = {
    "ID":2,
    "coordinate_latitude": 49.25,
    "coordinate_longitude": -125.20,
    "message_text": "I have the highest latitude",
    "user_account_id": '2'
};
var message3 = {
    "ID":3,
    "coordinate_latitude": 49.25,
    "coordinate_longitude": -125.20,
    "message_text": "I have the highest latitude LULO",
    "user_account_id": '2'
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

test("Add messages", function() {
    let result = addMessage();
    expect (result).toBe(message);
});
test("Get message by parameter", function() {
    expect(getMessagesByParameters()).toEqual([message, message2]);
});
test("Update message", function() {
    expect(updateMessage()).toBe(message);
});
test("Delete message", function() {
    expect(deleteMessage()).toBe("Message deleted");
});


// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app = require("../messages_server");

describe(`Messages Testing API`, () =>  {
    beforeEach(async () =>  {
        await new Promise(r => setTimeout(r, 1000));
    }
    );
   
    describe(`DELETE /all`, () =>  {
        it(`should "All messages deleted" with Status code:200`, async () =>  {
            const response = await request(app).delete(`/all`);           
            await expect(response.text).toBe(`All messages deleted`);
            await expect(response.statusCode).toBe(200);
        }
        );
    }
    );

    describe(`GET /`, () =>  {
        test(`It should respond with an empty arrayObject of messages`, async () => {
            const response = await request(app).get(`/`);
            await expect(response.text).toEqual("[]");
            await expect(response.statusCode).toBe(200);
            
            
          }
          );
    }
    );
    test(`POST /`, async () => {
        const response = await request(app).post(`/`).send(message)
        await expect(JSON.parse(response.text)).toEqual([message]);
        await expect(response.statusCode).toBe(201);
        

    }
    );
        //await expect(response.statusCode).toBe(201);
        //await expect(response.text).toEqual(message);
       


    // describe(`POST /`, () => {
    //     test(`Add message with missing coordinate_latitude and
    //     get '`, async () => {
    //         const response = await request(app).post(`/`).send({
    //             coordinate_longitude: -125,
    //             message_text: "Hello",
    //             user_account_id: "1"
    //         });
    //         await expect(response.text).toEqual(`Missing parameters`);
    //         await expect(response.statusCode).toBe(400);
    //     }
    //     );
    //     test(`Add message with missing coordinate_longitude`, async () => {
    //         const response = await request(app).post(`/`).send({
    //             coordinate_latitude: 49,
    //             message_text: "Hello",
    //             user_account_id: "1"
    //         });
    //         await expect(response.text).toEqual(`Missing parameters`);
    //         await expect(response.statusCode).toBe(400);
    //     }
    //     );
    //     test(`Add message with missing message_text`, async () => {
    //         const response = await request(app).post(`/`).send({
    //             coordinate_latitude: 49,
    //             coordinate_longitude: -125,
    //             user_account_id: "1"
    //         });
    //         await expect(response.text).toEqual(`Missing parameters`);
    //         await expect(response.statusCode).toBe(400);
    //     }
    //     );
    //     test(`Add message with missing user_account_id`, async () => {
    //         const response = await request(app).post(`/`).send({
    //             coordinate_latitude: 49,
    //             coordinate_longitude: -125,
    //             message_text: "Hello"
    //         });
    //         await expect(response.text).toEqual(`Missing parameters`);
    //         await expect(response.statusCode).toBe(400);
    //     }
    //     );
    //     test(`Add message with invalid coordinate_latitude and get 
    //     “Cooridinate_latitude is not between -90 and 90”
    //     Status code:400
    //     `, async () => {
    //         const response = await request(app).post(`/`).send({
    //             coordinate_latitude: 91,
    //             coordinate_longitude: -125,
    //             message_text: "Hello",
    //             user_account_id: "1"
    //         });
    //         await expect(response.text).toEqual(`Cooridinate_latitude is not between -90 and 90`);
    //         await expect(response.statusCode).toBe(400);
    //     }
    //     );

    //     test(`Add message with invalid coordinate_longitude and get
    //     “Coordinate Longitude is not between -180 and 180”
    //     Status code:400
    //     `, async () => {
    //         const response = await request(app).post(`/`).send({
    //             coordinate_latitude: 49,
    //             coordinate_longitude: -181,
    //             message_text: "Hello",
    //             user_account_id: "1"
    //         });
    //         await expect(response.text).toEqual(`Coordinate Longitude is not between -180 and 180`);
    //         await expect(response.statusCode).toBe(400);
    //     }
    //     );
        
    //     test(`Add message with Add message with text greater than 255
    //     and get “Message text is not between 1 and 255”
    //     Status code:400
    //     `, async () => {
    //         const response = await request(app).post(`/`).send({
    //             coordinate_latitude: 49,
    //             coordinate_longitude: -125,
    //             message_text: "Hello".repeat(256),
    //             user_account_id: "1"
    //         });
    //         await expect(response.text).toEqual(`Message text is not between 1 and 255`);
    //         await expect(response.statusCode).toBe(400);
    //     }
    //     );

    //     test(`Add message on new coordinates and get
    //     “Message added”
    //     Status code: 200
    //     `, async () => {
    //         const response = await request(app).post(`/`).send(message);
    //         await expect(response.text).toEqual(`Message added`);
    //         await expect(response.statusCode).toBe(200);
    //     }
    //     );
    //     test(`Add message on existing coordinates and get
    //     “Message added”
    //     Status code: 200
    //     `, async () => {
    //         const response = await request(app).post(`/`).send(message2);
    //         await expect(response.text).toEqual(`Message added`);
    //         await expect(response.statusCode).toBe(200);
    //     }
    //     );
    //     test(`Add message on existing coordinates and get
    //     “Cannot add a message there”
    //     Status code: 400
    //     `, async () => {
    //         const response = await request(app).post(`/`).send(message3);
    //         await expect(response.text).toEqual(`Cannot add a message there`);
    //         await expect(response.statusCode).toBe(400);
    //     }
    //     );

    // }
    // );

    // describe(`GET /:id after POST`, () => {
    //     test(`Get message with blank id and get
    //     all the messages inside the database
    //     Status code:200
    //     `, async () => {
    //         const response = await request(app).get(`/`);
    //         await expect(response.statusCode).toBe(200);
    //         await expect(response.text).toEqual([
    //             message,
    //             message2       

    //         ]);           

    //     }
    //     );
    //     test(`Get message with existing id and get
    //     the message with the associated id
    //     Status code:200`, async () => {
    //         const response = await request(app).get(`/1`);
    //         await expect(response.statusCode).toBe(200);
    //         await expect(response.text).toEqual(message);
    //     }
    //     );
    //     test(`Get message with non-existing id and get
    //     an empty array
    //     Status code:404`, async () => {
    //         const response = await request(app).get(`/3`);
    //         await expect(response.statusCode).toBe(404);
    //         await expect(response.text).toEqual([]);
    //     }
    //     );
    //     test(`Get a message with coordinates = (49,125) and radius = 10. and get
    //     all the messages inside the radius of 10 with the coordinates (49,125)
    //     Status code:200`, async () => {
    //         const response = await request(app).get(`/?coordinate_latitude=49&coordinate_longitude=125&radius=10`);
    //         await expect(response.statusCode).toBe(200);
    //         await expect(response.text).toEqual([
    //             message,message2             

    //         ]);           

    //     }
    //     );
    //     test(`Get messages with existing user_account_id and get
    //     all the messages with the associated user_account_id
    //     Status code:200`, async () => {
    //         const response = await request(app).get(`/?user_account_id='1'`);
    //         await expect(response.statusCode).toBe(200);
    //         await expect(response.text).toEqual([
    //             message
    //         ]);

        
    //     }
    //     );       
            
            
    // }
    // );

    // describe(`PUT /:id`, () => {
    //     test(`Update message with blank id and get
    //     Cannot update
    //     Status code:404`, async () => {
    //         const response = await request(app).put(`/`);
    //         await expect(response.statusCode).toBe(404);
    //         await expect(response.text).toEqual(`Cannot update`);
    //     }
    //     );
    //     test(`Update message with existing id and get
    //     "Message updated”
    //     Status code:200 `, async () => {
    //         const response = await request(app).put(`/0`).send({
    //             coordinate_latitude: 49,
    //             coordinate_longitude: -125,
    //             message_text: "Hello",
    //             user_account_id: "1"
    //         });
    //         await expect(response.text).toEqual(`Message updated`);
    //         await expect(response.statusCode).toBe(200);
    //     }
    //     );
    //     test(`Update message with non-existing id and get
    //     "Cannot update"
    //     Status code:404`, async () => {
    //         const response = await request(app).put(`/3`).send({
    //             coordinate_latitude: 49,
    //             coordinate_longitude: -125,
    //             message_text: "Hello",
    //             user_account_id: "1"
    //         });
    //         await expect(response.text).toEqual(`Cannot update`);
    //         await expect(response.statusCode).toBe(404);
    //     }
    //     );
       
    // }
    // );

    // describe(`DELETE /:id`, () => {
    //     test(`Delete message with blank id and get
    //     Cannot delete
    //     Status code:404`, async () => {
    //         const response = await request(app).delete(`/`);
    //         await expect(response.statusCode).toBe(404);
    //         await expect(response.text).toEqual(`Cannot delete`);
    //     }
    //     );
    //     test(`Delete message with existing id and get
    //     "Message deleted”
    //     Status code:200`, async () => {
    //         const response = await request(app).delete(`/0`);
    //         await expect(response.text).toEqual(`Message deleted`);
    //         await expect(response.statusCode).toBe(200);
    //     }
    //     );        
    //     test(`Delete message with non-existing id and get
    //     “Message deleted”
    //     Status code:200`, async () => {
    //         const response = await request(app).delete(`/3`);
    //         await expect(response.text).toEqual(`Message deleted`);
    //         await expect(response.statusCode).toBe(200);
    //     }
    //     );
    // }
    // );

    // describe(`GET / after DELETE`, () => {
    //     test(`Get message with deleted id and get
    //     all messages
    //     Status code:200`, async () => {
    //         const response = await request(app).get(`/`);
    //         await expect(response.statusCode).toBe(200);
    //         await expect(response.text).toEqual([message2]);
    //     }
    //     );
    // }
    // );
    


});
