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

io.on('connection', (socket) => {
	console.log(socket.id);
	const { name } = socket.handshake.query;
	assignSocket(name, socket);

	io.emit('getUsers', getUsers());
	socket.broadcast.emit('receiveMessage', `${name} has joined the chat`);

	socket.on('sendMessage', (message) => {
		io.emit('receiveMessage', `${name}: ${message}`);
	});

	socket.on('private', (data) => {
		const { to, message } = data;
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

	socket.on('disconnect', () => {
		removeUser(name);
		io.emit('getUsers', getUsers());
		socket.broadcast.emit('receiveMessage', `${name} has left the chat`);
	});
});

httpServer.listen(port, () => {
	console.log(`server runs on port: ${port}`);
});
