var message = `{
    "id":1,
    "coordinate_latitude": 49,
    "coordinate_longitude": -125,
    "message_text": "Hello",
    "user_account_id": 1
}`;
var message2 = `{
    "id":2,
    "coordinate_latitude": 49.25,
    "coordinate_longitude": -125.20,
    "message_text": "I have the highest latitude",
    "user_account_id": 2
}`;

const addMessage = jest.fn(() => {
    return message;
});
const addMessage2 = jest.fn(() => {
    return message2;
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
