const USERS = {};

exports.login = (req, res) => {
	const { username } = req.body;

	if (username.length < 2) {
		res.status(400).send({ message: 'username must be at least 2 characters long' });
		return;
	}

	const isExist = Object.prototype.hasOwnProperty.call(USERS, username);

	if (isExist) {
		res.status(409).send({ message: `${username} is already used, choose a different name` });
		return;
	}

	USERS[username] = undefined;

	res.status(201).send({ message: `welcome ${username}!` });
};

exports.assignSocket = (name, socket) => {
	USERS[name] = socket;
};

exports.getUsers = () => {
	const users = Object.keys(USERS);
	return users;
};

exports.removeUser = (name) => {
	delete USERS[name];
};

exports.findId = (name) => {
	const user = USERS.find((usr) => usr.name === name);
	return user.id;
};

exports.getUserSocket = (name) => USERS[name] || undefined;
