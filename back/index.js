const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors());

app.listen(port, () => {
	console.log(`server runs on port: ${port}`);
});
