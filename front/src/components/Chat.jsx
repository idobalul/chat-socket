import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import { ListGroup, InputGroup, FormControl, Button } from 'react-bootstrap';

import Message from './Message';
import PM from './PM';

export default function Chat() {
	const location = useLocation();
	const { username } = location.state;
	const input = useRef();
	const chatLog = useRef();
	const socket = useRef();
	const [messages, setMessages] = useState([]);
	const [users, setUsers] = useState([]);
	const [to, setTo] = useState('all');

	useEffect(() => {
		socket.current = io('http://localhost:8080', {
			transports: ['websocket'],
			query: { name: username },
		});

		socket.current.on('connect', () => {
			socket.current.on('getUsers', (USERS) => {
				setUsers([...USERS]);
			});

			socket.current.on('receiveMessage', (message) => {
				setMessages((allMessages) => [...allMessages, message]);
			});

			socket.current.on('receivePrivate', (data) => {
				setMessages((allMessages) => [...allMessages, data]);
			});
		});
	}, []);

	useEffect(() => {
		chatLog.current.scrollTop = chatLog.current.scrollHeight;
	}, [messages]);

	const sendMessage = () => {
		if (input.current.value === '') {
			return;
		}
		const message = input.current.value;
		if (to !== 'all') {
			socket.current.emit('private', { to, message });
			setMessages((allMessages) => [...allMessages, { to, message }]);
		} else {
			socket.current.emit('sendMessage', input.current.value);
		}
		input.current.value = '';
	};

	return (
		<div id="chat-page">
			<div className="left">
				<h3>Users</h3>
				<ListGroup className="list">
					{users.map((user) => (
						<ListGroup.Item
							key={user}
							as="button"
							className="user"
							variant="light"
							action
							onClick={(event) => {
								const name = event.target.innerText.split(' ')[1];
								setTo(name);
							}}
						>
							<span>🟢</span> {user}
						</ListGroup.Item>
					))}
				</ListGroup>
			</div>
			<div className="right">
				<div ref={chatLog} className="messages">
					{messages.map((msg) => {
						if (msg.from || msg.to) {
							return <PM data={msg} />;
						}
						return <Message message={msg} />;
					})}
				</div>
				<InputGroup className="mb-0" size="lg">
					<FormControl
						ref={input}
						placeholder={to === 'all' ? 'Write you message here' : `PM to ${to}`}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								sendMessage();
							}
						}}
					/>
					<Button variant="outline-primary" id="button-addon" onClick={sendMessage}>
						Send
					</Button>
					{to !== 'all' && (
						<Button
							variant="outline-secondary"
							onClick={() => {
								setTo('all');
							}}
						>
							<i className="fas fa-times" />
						</Button>
					)}
				</InputGroup>
			</div>
		</div>
	);
}
