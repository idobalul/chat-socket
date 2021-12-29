const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { getUsers, removeUser } = require('./controllers/main');

const loginRouter = require('./routers/login');

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/login', loginRouter);

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
	console.log(socket.id);
	const { name } = socket.handshake.query;

	io.emit('getUsers', getUsers());
	socket.broadcast.emit('receiveMessage', `${name} has joined the chat`);

	socket.on('sendMessage', (message) => {
		io.emit('receiveMessage', `${name}: ${message}`);
	});

	socket.on('disconnect', () => {
		removeUser(name);
		io.emit('getUsers', getUsers());
		socket.broadcast.emit('receiveMessage', `${name} has left the chat`);
	});
});

httpServer.listen(port, () => {
	console.log(`server runs on port: ${port}`);
});
