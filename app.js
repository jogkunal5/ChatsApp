const express = require('express');
const socketio = require('socket.io');
const app = express();

app.set('view engine', 'ejs'); // Ejs is a JS template engine
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index');
})

const server = app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running on port 3000");
})

// initialize socket for the server
const io = socketio(server);

// io.on() will be triggered every time a new connection to the socket gets established
io.on('connection', socket => {
    let total = io.engine.clientsCount;
    let en = io.engine;
    //console.log("engine", en);
    console.log("New user connected. Total are: ", total);

    socket.username = "Anonymous";

    socket.on('change_username', data => {
        console.log("change_username: ", data);
        socket.username = data.username;
    })

    // handle the new message event
    socket.on('new_message', data => {
        console.log('new_message: ', data);
        
        io.sockets.emit('receive_message', {
            message: data.message,
            username: socket.username
        })
    })

    socket.on('typing', data => {
        // Here, socket.io uses the broadcast function to notify the connected clients. 
        // When we use broadcast, every user except the one who is typing the message receives the typing event from the server. 
        // So, every user except the one typing the message is shown the text  “ is typing…”. 
        socket.broadcast.emit('typing', {username: socket.username})
    })
})