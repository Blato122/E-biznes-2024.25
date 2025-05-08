// login, registration logic
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

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

const JWT_SECRET = 'secret-key-change-that-later!';

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

    res.json({
        message: 'Login successful',
        token: token,
        user: { id: user.id, username: user.username }
    });
});

module.exports = router;