// An object that holds the username and the socket of the user.
const USERS = {};

// login handles the login process of a user.
exports.login = (req, res) => {
	// Gets the username from the request body.
	const { username } = req.body;

	// If the username is shorter then 2 characters return status 400 (bad request).
	if (username.length < 2) {
		res.status(400).send({ message: 'username must be at least 2 characters long' });
		return;
	}

	// If the username is already taken return status 409 (conflict).
	const isExist = Object.prototype.hasOwnProperty.call(USERS, username);
	if (isExist) {
		res.status(409).send({ message: `${username} is already used, choose a different name` });
		return;
	}

	// If everything is ok initiate the key fot the user in the USERS object and return status 200 (ok).
	USERS[username] = undefined;

	res.status(201).send({ message: `welcome ${username}!` });
};

// assignSocket assigns the socket to the user.
exports.assignSocket = (name, socket) => {
	USERS[name] = socket;
};

// getUsers returns an array of all the users.
exports.getUsers = () => {
	const users = Object.keys(USERS);
	return users;
};

// removeUser removes the user from the USERS object.
exports.removeUser = (name) => {
	delete USERS[name];
};

// findId returns the id of the user or undefined if the user does not exist.
exports.findId = (name) => {
	const user = USERS.find((usr) => usr.name === name);
	return user.id;
};

// getUserSocket returns the socket of the user or undefined if the user does not exist.
exports.getUserSocket = (name) => USERS[name] || undefined;
