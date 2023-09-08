const express = require('express');
const getUser = require('../contollers/users.js').getUser;
const getUserFriends = require('../contollers/users.js').getUserFriends;
const addRemoveFriend = require('../contollers/users.js').addRemoveFriend;
const getUserByQuery = require('../contollers/users.js').getUserByQuery;
const verifyToken = require('../middleware/auth.js').verifyToken;

const router = express.Router();

// Read

router.get('/:id', verifyToken, getUser);
router.get('/:id/friends', verifyToken, getUserFriends);
router.get('/:name/search', verifyToken, getUserByQuery);

// Update

router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

module.exports = router;
