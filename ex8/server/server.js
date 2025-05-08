const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // enable CORS for all routes
app.use(bodyParser.json());

app.use('/api/auth', authRoutes); // all auth routes will be prefixed with /api/auth

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});