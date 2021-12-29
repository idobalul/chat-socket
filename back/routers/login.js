const express = require('express');
const { login } = require('../controllers/main');

const router = express.Router();

// POST request
router.post('/', login);

module.exports = router;
