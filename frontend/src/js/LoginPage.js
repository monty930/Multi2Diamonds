import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            fetch('http://localhost:5015/Account/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            }).then(r => {
                if (r.status === 200) {
                    login();
                    navigate('/');
                } else {
                    setError('Login failed. Please try again later.');
                }
            });
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message);
            } else {
                setError('Login failed. Please try again later.');
            }
        }
    };

    return (
        <div className={"LoginPageImageContrainer"}>
            <div className="LoginContainer">
                <form onSubmit={handleSubmit} className="LoginForm">
                    <div className={"LoginFormBreak"}></div><div className={"LoginFormBreak"}></div>
                    <div className={"LogginPageTitle"}>Log in</div>
                    <div className={"LoginFormBreak"}></div><div className={"LoginFormBreak"}></div>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            className="LoginInput"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={"LoginFormBreak"}></div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            className="LoginInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className={"LoginFormBreak"}></div><div className={"LoginFormBreak"}></div>
                    <button type="submit" className=" AnyButton LoginButton">Log in</button>
                    <div className={"LoginFormBreak"}></div>
                    {error && <span className="ErrorField">{error}</span>}
                    <div className={"BigDiv"}>aa</div>
                    <div className={"OrDiv"}>or</div>
                    <div className={"SignUpDiv"}>Sign up</div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
