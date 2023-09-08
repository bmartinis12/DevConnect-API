const express = require('express');
const getFeedPosts = require('../contollers/post.js').getFeedPosts;
const getUserPosts = require('../contollers/post.js').getUserPosts;
const likePost = require('../contollers/post.js').likePost;
const commentOnPost = require('../contollers/post.js').commentOnPost;
const deletePost = require('../contollers/post.js').deletePost;
const verifyToken = require('../middleware/auth.js').verifyToken;

const router = express.Router();

// Read

router.get('/', verifyToken, getFeedPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);


// Update

router.patch('/:id/like', verifyToken, likePost);
router.patch('/:id/comment', verifyToken, commentOnPost);

// Delete

router.delete('/:id/delete', verifyToken, deletePost);


module.exports = router;
