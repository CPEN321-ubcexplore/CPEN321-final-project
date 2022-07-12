var world_server = require('./world_server.js');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  

  


describe("Message tests", () => {
    beforeEach(async() => {
        await sleep(4000);
        //console.log(world_server);
      });


    test('Deleting all messages should return ', async () => {
        return world_server.deleteAllMessages()
            .then((result) => {
            expect(result).toBe("All messages deleted");
        });
    });
});
