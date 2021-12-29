const express = require('express');
const cors = require('cors');

const loginRouter = require('./routers/login');

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/login', loginRouter);

app.listen(port, () => {
	console.log(`server runs on port: ${port}`);
});
