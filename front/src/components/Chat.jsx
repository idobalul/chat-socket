import React from 'react';
import { useLocation } from 'react-router-dom';
import { Stack, InputGroup, FormControl, Button } from 'react-bootstrap';

import User from './User';
import Message from './Message';

export default function Chat() {
	const location = useLocation();
	const { username } = location.state;

	return (
		<div id="chat-page">
			<div className="left">
				<h3>Users</h3>
				<Stack gap={2}>
					<User user={username} />
				</Stack>
			</div>
			<div className="right">
				<div className="messages">
					<Message message="hello world" />
				</div>
				<InputGroup className="mb-3" size="lg">
					<FormControl placeholder="Write you message here" />
					<Button variant="outline-primary" id="button-addon2">
						Send
					</Button>
				</InputGroup>
			</div>
		</div>
	);
}
