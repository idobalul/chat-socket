const USERS = {};

exports.login = (req, res) => {
	const { username } = req.body;

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
