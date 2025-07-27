const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = process.env.PORT || 4500;

const users = {};

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello, it's working");
});

const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000", // frontend
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("New user connected:", socket.id);

    socket.on('join-room', ({ room, user }) => {
        console.log(`User ${user} joined room ${room}`);
        socket.join(room);
        users[socket.id] = user;

        io.to(room).emit('welcome', {
            user: "Admin",
            message: `Let's have a chat in Room ${room}!`
        });
    });

    socket.on('message', ({ message, room }) => {
        if (room) {
            io.to(room).emit('sendMessage', {
                user: users[socket.id],
                message,
                id: socket.id
            });
        } else {
            socket.emit('sendMessage', {
                user: 'Admin',
                message: 'Room not specified',
                id: socket.id
            });
        }
    });

    // 🔴 Real-time typing handlers
    socket.on('typing', (room) => {
        const user = users[socket.id];
        if (room && user) {
            socket.to(room).emit('showTyping', `${user} is typing...`);
        }
    });

    socket.on('stopTyping', (room) => {
        if (room) {
            socket.to(room).emit('hideTyping');
        }
    });

    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            console.log(`User ${user} disconnected`);
            socket.broadcast.emit('leave', {
                user: 'Admin',
                message: `${user} has left`
            });
            delete users[socket.id];
        }
    });

    socket.on('joined', ({ user }) => {
        users[socket.id] = user;
        socket.broadcast.emit('userJoined', {
            user: "Admin",
            message: `${user} has joined`
        });
        socket.emit('welcome', {
            user: "Admin",
            message: `Welcome to the chat, ${user}`
        });
    });
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});



// const http = require("http");
// const express = require("express");
// const cors = require("cors");
// const socketIO = require("socket.io");

// const app = express();
// const port = process.env.PORT || 4500;

// const users = {};

// app.use(cors());

// app.get("/", (req, res) => {
//     res.send("Hello, it's working");
// });

// const server = http.createServer(app);

// const io = socketIO(server, {
//     cors: {
//         origin: "http://localhost:3000", // frontend
//         methods: ["GET", "POST"]
//     }
// });

// io.on("connection", (socket) => {
//     console.log("New user connected:", socket.id);

//     socket.on('join-room', ({ room, user }) => {
//         console.log(`User ${user} joined room ${room}`);
//         socket.join(room);
//         users[socket.id] = user;

//         io.to(room).emit('welcome', {
//             user: "Admin",
//             message: `Let's have a chat in Room ${room}!`
//         });
//     });

//     socket.on('message', ({ message, room }) => {
//         if (room) {
//             io.to(room).emit('sendMessage', {
//                 user: users[socket.id],
//                 message,
//                 id: socket.id
//             });
//         } else {
//             socket.emit('sendMessage', {
//                 user: 'Admin',
//                 message: 'Room not specified',
//                 id: socket.id
//             });
//         }
//     });

//     socket.on('disconnect', () => {
//         const user = users[socket.id];
//         if (user) {
//             console.log(`User ${user} disconnected`);
//             socket.broadcast.emit('leave', {
//                 user: 'Admin',
//                 message: `${user} has left`
//             });
//             delete users[socket.id];
//         }
//     });

//     socket.on('joined', ({ user }) => {
//         users[socket.id] = user;
//         socket.broadcast.emit('userJoined', {
//             user: "Admin",
//             message: `${user} has joined`
//         });
//         socket.emit('welcome', {
//             user: "Admin",
//             message: `Welcome to the chat, ${user}`
//         });
//     });
// });

// server.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });
