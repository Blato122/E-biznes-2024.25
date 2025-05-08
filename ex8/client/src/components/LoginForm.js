// displays the username and password input fields and a login button
import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!username || !password) {
            setError('Username and password are required.');
            return;
        }

        try {
            // the server is running on port 3001
            const response = await axios.post('http://localhost:3001/api/auth/login', {
                username,
                password,
            });

            setMessage(response.data.message);
            const token = response.data.token;

            // store the token (e.g. in localStorage)
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(response.data.user));


            console.log('Login successful, token:', token);
            console.log('User data:', response.data.user);

            if (onLoginSuccess) {
                onLoginSuccess(response.data.user, token);
            }

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Login failed. Please try again.');
            }
            console.error('Login error:', err);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default LoginForm;