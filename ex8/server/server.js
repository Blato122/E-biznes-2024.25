const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:3000', // React app's URL
    credentials: true, // allow cookies to be sent
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes); // all auth routes will be prefixed with /api/auth

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});