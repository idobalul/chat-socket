import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { Stack, InputGroup, FormControl, Button } from 'react-bootstrap';

import User from './User';
import Message from './Message';

export default function Chat() {
	const location = useLocation();
	const { username } = location.state;
	const input = useRef();
	const socket = useRef();
	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		socket.current = io('http://localhost:8080', {
			transports: ['websocket'],
			query: { name: username },
		});
		socket.current.on('connect', () => {
			socket.current.on('getUsers', (USERS) => {
				setUsers(USERS);
			});
		});
		socket.current.on('receiveMessage', (message) => {
			setMessages((allMessages) => [...allMessages, message]);
		});
	}, []);

	const sendMessage = () => {
		if (input.current.value === '') {
			return;
		}
		socket.current.emit('sendMessage', input.current.value);
		setMessages([...messages, input.current.value]);
	};

	return (
		<div id="chat-page">
			<div className="left">
				<h3>Users</h3>
				<Stack gap={2}>
					{users.map((user) => (
						<User key={user} user={user} />
					))}
				</Stack>
			</div>
			<div className="right">
				<div className="messages">
					{messages.map((msg) => (
						<Message message={msg} />
					))}
				</div>
				<InputGroup className="mb-3" size="lg">
					<FormControl ref={input} placeholder="Write you message here" />
					<Button variant="outline-primary" id="button-addon" onClick={sendMessage}>
						Send
					</Button>
				</InputGroup>
			</div>
		</div>
	);
}
