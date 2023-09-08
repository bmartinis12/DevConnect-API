const { User } = require('../models/user.js');
const Post = require('../models/post.js').Post;

// Create

const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        });
        await newPost.save();
        
        const post = await Post.find().sort({ createdAt: -1});
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

// Read

const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find().sort({ createdAt: -1});
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};


const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId }).sort({ createdAt: -1});
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// Update

const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if(isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

const commentOnPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const post = await Post.findById(id);
        post.comments.unshift(comment);

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { comments: post.comments },
            { new: true }
        );

        res.status(201).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// Delete 

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        let deletedPost = await Post.deleteOne(
            { _id: id },
            {new: true}
        );

        res.status(200).json(deletedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};


module.exports = { createPost, getFeedPosts, getUserPosts, likePost, commentOnPost, deletePost };