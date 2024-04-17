import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming AuthContext is correctly set up as per previous instructions

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setAuthenticated } = useAuth(); // Function to update auth state in context

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Login form submitted');
        try {
            fetch('http://localhost:5015/Account/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            }).then(r => {
                if (r.status === 200) {
                    setAuthenticated(true); // Update the Auth context
                    navigate('/'); // Redirect to the home page or dashboard
                } else {
                    setError('Login failed. Please try again later.');
                }
            });
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message); // Handling error response from server
            } else {
                setError('Login failed. Please try again later.');
            }
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
