// CommonJS
const io = require("socket.io-client");


var socket = io.connect('http://localhost:8081', {reconnect: true});
console.log('check 1', socket.connected);
socket.on('connect', function() {
  console.log('check 2', socket.connected);
});

socket.emit("join", "messages");

socket.on('updateMessages', (data) => {
    console.log(data);
});
socket.on('deleteMessages', (data) => {
    console.log(data);
});
socket.on('addMessages', (data) => {
    console.log(data);
});

socket.on()