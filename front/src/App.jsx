import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import Chat from './components/Chat';

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/chat" element={<Chat />} />
			</Routes>
		</div>
	);
}

export default App;
