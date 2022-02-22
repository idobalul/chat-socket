const express = require('express');
const cors = require('cors');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { getUsers, removeUser, assignSocket, getUserSocket } = require('./controllers/main');

const loginRouter = require('./routers/login');

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('./build'));

app.use('/login', loginRouter);

app.get('/', (req, res) => {
	res.sendFile(path.resolve('build/index.html'));
});

const httpServer = createServer(app);
const io = new Server(httpServer);

// Handles the socket connection.
io.on('connection', (socket) => {
	console.log(socket.id);

	// Gets the name of the user from the socket and assign the socket of the user in the USERS (see controllers/main.js) object.
	const { name } = socket.handshake.query;
	assignSocket(name, socket);

	// When the user is connected update the users list with the new user
	io.emit('getUsers', getUsers());
	// Broadcast to all users that the new user joined the chat.
	socket.broadcast.emit('receiveMessage', `${name} has joined the chat`);

	// Handles the send message event.
	socket.on('sendMessage', (message) => {
		io.emit('receiveMessage', `${name}: ${message}`);
	});

	// Handles the private message event.
	socket.on('private', (data) => {
		// Gets the message and the receiver of the private message.
		const { to, message } = data;
		// Gets the socket of the receiver.
		const user = getUserSocket(to);

		// if for some reason the user that should receive the message disconnected the sender gets a message
		if (!user) {
			socket.emit('receivePrivate', {
				from: 'system',
				message: `PM was not sent because ${to} is not connected`,
			});
			return;
		}

		// if a user try to send himself a PM the wizard will shame bell him in public
		if (name === to) {
			io.emit(
				'receiveMessage',
				`🔔 SYSTEM ALERT!!!!! -> 🧙‍♂️ THE MIGHTY WIZARD SAY: shame on ${name} for trying to be funny and send a PM to himself 🔔`
			);
			return;
		}

		// if everything is ok sent the PM
		user.emit('receivePrivate', { from: name, message });
	});

	// Handles the disconnect event.
	socket.on('disconnect', () => {
		// Removes the user from the USERS (see controllers/main.js) object.
		removeUser(name);

		// Updates the users list with disconnected user removed.
		io.emit('getUsers', getUsers());

		// Broadcast to all users that the user disconnected.
		socket.broadcast.emit('receiveMessage', `${name} has left the chat`);
	});
});

httpServer.listen(port, () => {
	console.log(`server runs on port: ${port}`);
});
