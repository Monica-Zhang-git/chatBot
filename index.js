const express = require('express');
const sockeio = require('socket.io');


const path = require('path');

const http = require('http');
const session = require('express-session');
const { log } = require('console');


const app = express();

app.use(express.static(path.join(__dirname, 'puclic')));

const sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
});

const server = http.createServer(app);
const io = sockeio(server);

app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(3000, ()=> {
    console.log('listening on * 3000');
})