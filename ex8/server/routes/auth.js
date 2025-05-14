// login, registration logic
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// 4.0
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3001/api/auth/google/callback';

const oauth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI);

const users = [
    {
        id: 1,
        username: 'testuser',
        // hashed password for "password123"
        passwordHash: '$2b$10$rXMRqBvTMeoi4tzDkVniHO6/jToUHQ.ejw.7T2sw4vcKHXOF3B3ne'
        // to generate: node -e "console.log(require('bcryptjs').hashSync('password123', require('bcryptjs').genSaltSync(10)))"
    }
];

let nextUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

const JWT_SECRET = process.env.JWT_SECRET;

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // check if user already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(409).json({ message: 'Username already taken' }); // 409 Conflict
    }

    try {
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // create new user
        const newUser = {
            id: nextUserId++, // increment ID for the new user
            username: username,
            passwordHash: passwordHash
        };
        users.push(newUser);

        console.log('User registered:', newUser); // for server-side debugging
        console.log('Current users:', users); // for server-side debugging


        // respond with success
        res.status(201).json({ message: 'User registered successfully. Please log in.', userId: newUser.id, username: newUser.username }); // 201 Created
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' }); // user not found
    }

    if (user.googleId) {
        return res.status(401).json({ message: 'Login using Google account' }); // no password, use google account
    } else if (user.githubId) {
        return res.status(401).json({ message: 'Login using Github account' }); // no password, use github account
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' }); // password incorrect
    }

    // if credentials are valid, generate a JWT
    const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' } // token expires in 1 hour
    );
    // console.log(token); // tokens are different, it's just the n first chars that are usually the same

    res.json({
        message: 'Login successful',
        token: token,
        user: { id: user.id, username: user.username }
    });
});

// GET /api/auth/google - redirect to Google's OAuth2 consent screen
router.get('/google', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
    });
    res.redirect(authUrl);
});

// GET /api/auth/google/callback - handle Google's OAuth2 callback
router.get('/google/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const ticket = await oauth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name } = payload;
        let username = name

        // check if user exists or create a new one
        let user = users.find(u => u.googleId === googleId);
        if (!user) {
            user = { id: nextUserId++, username, googleId, email };
            users.push(user);
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // set the token in an HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true, // prevent access via JavaScript
            secure: false, // normally would be true
            sameSite: 'Strict', // prevent cross-site requests
        });

        // redirect back to the React app
        res.redirect('http://localhost:3000');
    } catch (error) {
        console.error('Error during Google OAuth2 callback:', error);
        res.status(500).json({ message: 'Authentication failed' });
    }
});

router.get('/me', (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = users.find(u => u.id === decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
    });
    res.json({ message: 'Logged out successfully' });
});

// GitHub OAuth
router.get('/github', (req, res) => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3001/api/auth/github/callback&scope=user:email`;
    res.redirect(githubAuthUrl);
});

router.get('/github/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
        }, {
            headers: { Accept: 'application/json' },
        });

        const accessToken = tokenResponse.data.access_token;

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const { id: githubId, login: username, email } = userResponse.data;

        // check if user exists or create a new one
        let user = users.find(u => u.githubId === githubId);
        if (!user) {
            user = { id: nextUserId++, username, githubId, email };
            users.push(user);
        }

        // generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // set token in HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
        });

        res.redirect('http://localhost:3000');
    } catch (error) {
        console.error('GitHub OAuth error:', error);
        res.status(500).json({ message: 'Authentication failed' });
    }
});

module.exports = router;