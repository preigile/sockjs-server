var http = require('http');
var sockjs = require('sockjs');

var clients = {};

// Broadcast to all clients
function broadcast(mark){
    // iterate through each client in clients object
    for (var client in clients){
    // send the message to that client
    clients[client].write(mark);
    }
}

var echo = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
echo.on('connection', function(conn) {
    clients[conn.id] = conn;

    conn.on('data', function(mark) {
        console.log('received ' + mark);
        broadcast(mark);
    });

    conn.on('close', function() {
        delete clients[conn.id];
    });

    conn.write("hello from the server, thanks for connectiong!");
    console.log("connected");
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/echo'});
server.listen(7000, '0.0.0.0');