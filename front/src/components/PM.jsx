/* eslint-disable react/prop-types */
import React from 'react';

export default function PM({ data }) {
	return Object.prototype.hasOwnProperty.call(data, 'from') ? (
		<div className="message PM">
			<section>(PM from {data.from})</section>
			{data.message}
		</div>
	) : (
		<div className="message PM">
			<section>(PM to {data.to})</section>
			{data.message}
		</div>
	);
}
