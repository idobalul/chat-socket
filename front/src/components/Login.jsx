import React, { useRef } from 'react';
import axios from 'axios';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Notyf } from 'notyf';

const notyf = new Notyf({
	duration: 4000,
	position: {
		x: 'right',
		y: 'top',
	},
	types: [
		{
			type: 'error',
			background: 'indianred',
			dismissible: true,
		},
	],
});

export default function Login() {
	const navigate = useNavigate();
	const usernameInput = useRef();

	const login = async () => {
		try {
			if (usernameInput.current.value === '') {
				throw new Error('please enter username');
			} else if (usernameInput.current.length < 2) {
				throw new Error('username must be at least 2 characters long');
			}

			const response = await axios.post('/login', {
				username: usernameInput.current.value,
			});

			if (response.status === 201) {
				navigate('/chat', { replace: true, state: { username: usernameInput.current.value } });
			}
		} catch (error) {
			notyf.error(error.response.data.message);
		}
	};

	return (
		<div className="login-page">
			<InputGroup className="mb-3" size="lg">
				<InputGroup.Text>Username</InputGroup.Text>
				<FormControl
					ref={usernameInput}
					className="username-input"
					placeholder="Username must be at least 2 characters long"
				/>
			</InputGroup>
			<Button variant="primary" className="login-button" onClick={login} size="lg">
				Log In
			</Button>
		</div>
	);
}
