const USERS = [];

exports.login = (req, res) => {
	const { username } = req.body;

	if (USERS.includes(username)) {
		res.status(409).send({ message: `${username} is already used, choose a different name` });
		return;
	}

	USERS.push(username);

	res.status(201).send({ message: `welcome ${username}!` });
};
