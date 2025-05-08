import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = ({ onRegistrationSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!username || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/auth/register', {
                username,
                password,
            });

            setMessage(response.data.message); // Display success message from server
            console.log('Registration successful:', response.data);

            // Clear form
            setUsername('');
            setPassword('');
            setConfirmPassword('');


            if (onRegistrationSuccess) {
                onRegistrationSuccess(response.data.username); // Pass username or other data if needed
            }

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
            console.error('Registration error:', err);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="reg-username">Username:</label>
                    <input
                        type="text"
                        id="reg-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        // required
                    />
                </div>
                <div>
                    <label htmlFor="reg-password">Password:</label>
                    <input
                        type="password"
                        id="reg-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // required
                    />
                </div>
                <div>
                    <label htmlFor="reg-confirm-password">Confirm Password:</label>
                    <input
                        type="password"
                        id="reg-confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        // required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
};

export default RegistrationForm;