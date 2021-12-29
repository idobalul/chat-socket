import React from 'react';

// eslint-disable-next-line react/prop-types
export default function User({ user }) {
	return (
		<div className="user">
			<span>🟢</span> {user}
		</div>
	);
}
