const dotenv = require('dotenv');
dotenv.config();
const SOCKET_PORT = process.env.PORT || 8900;
const SOCKET_HOST = process.env.HOST

const io = require("socket.io")(SOCKET_PORT, {
    cors: {
        origin: SOCKET_HOST ? SOCKET_HOST.split(',') : "*",
    },
})

let users = []

const addUser = (userId, socketId) => {
    users = users.filter(user => user.userId !== userId)
    !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId }) &&
        console.log(`user connected ${userId}  ${socketId}`);
}
const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}
const logoutUser = (userId) => {
    users = users.filter(user => user.userId !== userId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on("connection", (socket) => {
    // when connect
    // take socket id and user id 
    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        io.emit("getAllUsers", users);
    });

    // send and get message
    socket.on("sendMsg", ({ senderId, receiverId, text, image }) => {
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("getMsg", {
                senderId,
                text,
                image,
            })
        }
        io.emit("getAllUsers", users);
    })

    socket.on("sendUsers", () => {
        io.emit("getAllUsers", users);
    })

    socket.on("logout", (userId) => {
        console.log("a user logged out");
        logoutUser(userId);
        io.emit("getAllUsers", users);
    })

    // when disconnect
    socket.on("disconnect", () => {
        removeUser(socket.id);
        console.log(`a user disconnected ${socket.id}`);
        io.emit("getAllUsers", users);
    })
    // io.to(si).emit("welcome","hello this  is socket server");
})



