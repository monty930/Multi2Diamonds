import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Spinner from "./Spinner";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [handleForm, setHandleForm] = useState('login');
    const [loginError, setLoginError] = useState('');
    const [signupError, setSignupError] = useState('');
    const [visibleForm, setVisibleForm] = useState('login');
    const [showForm, setShowForm] = useState('login');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const animationTime = 0.3;

    const handleViewToggle = async () => {
        setLoginError('');
        setSignupError('');
        if (visibleForm === 'login') {
            setShowForm('signup');
            setHandleForm('signup');
            await moveUp();
            setVisibleForm('signup');
        } else {
            setShowForm('login');
            setHandleForm('login');
            setVisibleForm('login');
            await moveDown();
        }
    };

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const moveUp = async () => {
        await delay(animationTime * 1000);
    };

    const moveDown = async () => {
        await delay(animationTime * 1000);
    };

    const handleSubmit = async (event) => {
        if (handleForm === 'login') {
            await handleLogin(event);
        } else {
            await handleSignup(event);
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5015/Account/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                login();
                navigate('/');
            } else {
                const data = await response.json();
                setLoginError(data.message);
            }
        } catch (error) {
            setLoginError('Login failed. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (event) => {
        // TODO
    };

    return (
        <div className="LoginPageImageContrainer">
            <div className="LoginContainer">
                <form onSubmit={handleSubmit} className="LoginForm">
                    <div
                        className="OrLogInDiv"
                        onClick={handleViewToggle}
                        style={{ display: `${visibleForm === 'login' ? 'none' : 'flex'}` }}
                    >
                        <span className="OrSpan">or</span>
                        <span className="LogInSpan">Log in</span>
                    </div>
                    {visibleForm === 'login' && (
                        <div className="LogInFormContent">
                            <div className="LoginFormBreak"></div>
                            <div className="LoginFormBreak"></div>
                            <div className="LogSignPageTitle">Log in</div>
                            <div className="LoginFormBreak"></div>
                            <div className="LoginFormBreak"></div>
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
                            <div className="LoginFormBreak"></div>
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
                            <div className="LoginFormBreak"></div>
                            <div className="LoginFormBreak"></div>
                            <div className="LoginFormBreak"></div>
                            {loading ?
                                <Spinner /> :
                                <button type="submit" className="AnyButton LogSignButton LoginButton">Log in</button>
                            }

                            <div className="LoginFormBreak"></div>
                            {loginError && <span className="ErrorField">{loginError}</span>}
                        </div>
                    )}

                    <div className="BigDiv"
                         onClick={handleViewToggle}
                         style={{
                             animation: `${showForm === 'login' ? 'slideDown' : 'slideUp'} ${animationTime}s ease-out forwards`
                         }}>
                    </div>
                    <div
                        className="OrDiv"
                        style={{
                            display: `${visibleForm === 'login' && showForm === 'login' ? 'flex' : 'none'}`
                        }}
                        onClick={handleViewToggle}>or
                    </div>
                    <div className="SignUpDiv"
                         style={{
                             display: `${visibleForm === 'login' && showForm === 'login' ? 'flex' : 'none'}`
                         }}
                         onClick={handleViewToggle}>Sign up
                    </div>
                    {(visibleForm === 'signup' || showForm === 'signup') &&
                        (<div
                            className="SignUpFormContent"
                            style={{
                                animation: `${showForm === 'login' ? 'slideDown' : 'slideUp'} ${animationTime}s ease-out forwards`
                            }}>
                            <div className="LoginFormBreak"></div>
                            <div className="LoginFormBreak"></div>
                            <div className="LogSignPageTitle">Sign up</div>
                            <div className="LoginFormBreak"></div>
                            <div className="LoginFormBreak"></div>
                            <div className="form-group">
                                <label htmlFor="email">Email:</label>
                                <input
                                    type="text"
                                    id="email"
                                    className="LoginInput SignUpText"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="LoginFormBreak"></div>
                            <div className="form-group">
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    className="LoginInput SignUpText"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="LoginFormBreak"></div>
                            <div className="form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="LoginInput SignUpText"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="LoginFormBreak"></div>
                            <div className="LoginFormBreak"></div>
                            <button type="submit" className="AnyButton LogSignButton SignUpButton">Sign up</button>
                            <div className="LoginFormBreak"></div>
                            {signupError && <span className="ErrorField">{signupError}</span>}
                        </div>)}
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
