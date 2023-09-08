const express = require('express');
const login = require('../contollers/auth.js').login;

const router = express.Router();

router.post('/login', login);

module.exports = router;