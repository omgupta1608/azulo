const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
const { v4: uuidv4 } = require('uuid');

app.use('/peerjs', peerServer);
app.set('view engine', 'ejs');
app.use(express.static('public/'));


app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);

});


app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });

});
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log(`Room Joined! ${roomId}`);
        socket.join(roomId);
        
        socket.to(roomId).broadcast.emit('user-connected', userId);
    });
});

const port = process.env.PORT || 3030;
server.listen(port, () => console.log('started'))