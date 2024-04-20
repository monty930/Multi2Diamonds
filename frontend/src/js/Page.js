import React from "react";
import {BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate} from "react-router-dom";
import ProfilePage from "./ProfilePage";
import LoginPage from "./LoginPage";
import Scenarios from "./scenarios/Scenarios";
import SavedItemsPage from "./SavedItemsPage";
import {useAuth} from "./AuthContext";
import axios from "axios";

import "../css/Page.css";
import '../css/LoginPage.css';
import '../css/Scenarios.css';
import '../css/Scenarios/MakeScenarios.css';
import '../css/Scenarios/UseScenariosChoose.css';

import PageLogo from "../assets/2diams.png";
import SavedItemsImg from "../assets/folder3.png";
import LogOutImg from "../assets/logout.png";
import ProfileImg from "../assets/profile.png";
import GitHubLogo from "../assets/githublogo.png";

function Header() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5015/Account/Logout');
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="HeaderContent">
            <div className="PageTitle">
                <Link to="/" className="LinkNoDecor PageTitleLink">
                    Multi
                    <img src={PageLogo} alt="2diams logo" className="PageLogo" />
                </Link>
            </div>
            <div className="HeaderNav">
                <div className="HeaderNavItem">
                    <Link to="/saved" className="HeaderTab SavedItemsLink LinkNoDecor">
                        <img src={SavedItemsImg} alt="Saved items" className="SavedItemsImg" />
                    </Link>
                </div>
                <div className="HeaderNavItem">
                    <Link to="/profile" className="HeaderTab LinkNoDecor">
                        <img src={ProfileImg} alt="Profile" className="ProfileImg" />
                    </Link>
                </div>
                <div className="HeaderNavItem">
                    <button className="HeaderTab LogOutButton LinkNoDecor" onClick={handleLogout}>
                        <img src={LogOutImg} alt="Log out" className="LogOutImg" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function Footer() {
    return <footer className="PageFooter">
        <a className="HrefNoDecor" href="https://github.com/monty930/BridgeScenarios">
            <div className="GitHubLogo">
                <span>monty930/BridgeScenarios
                </span>
                <img src={GitHubLogo} alt="GitHub logo"/>
            </div>
        </a>
    </footer>;
}

function Page() {
    const { isAuthenticated } = useAuth();

    return (
        <Router>
            <div className="Page">
                <div className="PageHeader"><Header /></div>
                <div className="PageContent">
                    <Routes>
                        {isAuthenticated ? (
                            <>
                                <Route path="/" element={<Navigate replace to="/scenarios/make" />} />
                                <Route path="/scenarios/make" element={<Scenarios />} />
                                <Route path="/scenarios/use" element={<Scenarios />} />
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/saved" element={<SavedItemsPage />} />
                            </>
                        ) : (
                            <Route path="*" element={<Navigate replace to="/login" />} />
                        )}
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </div>
                <div className="PageFooter">
                    <Footer />
                </div>
            </div>
        </Router>
    );
}

export default Page;
