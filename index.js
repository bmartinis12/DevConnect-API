// Imports 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/users.js');
const postRoutes = require('./routes/post.js');
const { verifyToken } = require('./middleware/auth.js');
const createPost = require('./contollers/post.js').createPost;
const fileURLToPath = require('url').fileURLToPath;
const User = require('./models/user.js').User;
const Post = require('./models/post.js').Post;

const app = express();

// Middleware/configurations 

app.use(express.json());
app.use(helmet({
    frameguard: {
        action: 'deny'
    },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "*.fontawesome.com", "*.googleapis.com", "'unsafe-inline'"],
            scriptSrc: ["'self'", "https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js", "*.fontawesome.com", "*.googleapis.com"],
            connectSrc: ["'self'", "*.fontawesome.com", "*.googleapis.com"],
        },
    }
}));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static('public/assets'));
app.use(express.static('public'));
const register = require('./contollers/auth').register;

// File storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Routes with files 

app.post('/auth/register', upload.single('picture'), register);

app.post('/posts', verifyToken, upload.single('picture'), createPost);

// Routes 

app.use('/auth', authRoutes);

app.use('/users', userRoutes);

app.use('/posts', postRoutes)

// Database setup

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.DB, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
}).catch((error) => console.log(`${error} did not connect`));
