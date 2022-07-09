const Message = require('./world_server.js').Message;


describe("Message tests", () => {
    test('Delete all messages should return "All messages deleted"', () => {
      expect(Message.deleteAllMessages()).toBe("All messages deleted");
    });
   })