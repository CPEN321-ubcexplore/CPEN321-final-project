// CommonJS
const io = require("socket.io-client");


var socket = io.connect('http://localhost:8083', {reconnect: true});
console.log('check 1', socket.connected);
socket.on('connect', function() {
  console.log('check 2', socket.connected);
});

socket.emit("join", "test");

socket.on('updateLocations', (data) => {
    console.log(data);
});
socket.on('deleteLocations', (data) => {
    console.log(data);
});
socket.on('addLocations', (data) => {
    console.log(data);
});

socket.on()