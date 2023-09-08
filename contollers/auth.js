const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js').User;


// Register User

const register = async (req, res) => {
    try {
        const {
            firstName, 
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const adjustedFirstName = firstName.charAt(0).toUpperCase()+ firstName.toLowerCase().slice(1);
        const adjustedLastName =  lastName.charAt(0).toUpperCase()+ lastName.toLowerCase().slice(1);
        const adjustedEmail = email.toLowerCase();
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName: adjustedFirstName, 
            lastName: adjustedLastName,
            email: adjustedEmail,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Login user

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const adjustedEmail = email.toLowerCase();
        const user = await User.findOne({ email: adjustedEmail });
        if(!user) return res.status(400).json({ message: 'User does not exist.'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: 'Invalid password.'});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { register, login };