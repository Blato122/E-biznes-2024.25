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

const JWT_SECRET = 'secret-key-change-that-later!!!';

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