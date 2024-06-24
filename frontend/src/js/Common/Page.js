import React from 'react';
import {BrowserRouter as Router, Link, Route, Routes, useNavigate} from 'react-router-dom';
import ProfilePage from './ProfilePage';
import LoginPage from './LoginPage';
import Scenarios from '../Scenarios/Scenarios';
import SavedItemsPage from '../Scenarios/SavedItemsPage';
import WelcomePage from './WelcomePage';
import { AuthProvider, useAuth } from './AuthContext';

import '../../css/Common/Page.css';
import '../../css/Common/LoginPage.css';
import '../../css/Common/DialogWindow.css';
import '../../css/Scenarios/Scenarios.css';
import '../../css/Scenarios/MakeScenarios.css';
import '../../css/Scenarios/UseScenariosChoose.css';
import '../../css/Scenarios/DealSetLayout.css';
import '../../css/Common/WelcomePage.css';
import '../../css/Scenarios/ScenariosIntroPage.css';
import '../../css/Common/CenterLayout.css';

import PageLogo from '../../assets/2diams.png';
import LogOutImg from '../../assets/logout.png';
import ProfileImg from '../../assets/profile.png';
import GitHubLogo from '../../assets/githublogo.png';
import contactImg from '../../assets/contact-icon4.png';
import todoImg from '../../assets/todo-icon2.png';
import ContactPage from './ContactPage';
import DummyPage from './DummyPage';
import axios from "axios";

function Page() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

function AppContent() {
    const { loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a spinner or some other loading indicator
    }

    return (
        <Router>
            <div className="Page">
                <span>
                    <div className="PageHeader"><Header /></div>
                    <div className="PageContent">
                        <Routes>
                            <Route path="/" element={<WelcomePage />} />
                            <Route path="/scenarios/make" element={<Scenarios />} />
                            <Route path="/scenarios/use" element={<Scenarios />} />
                            <Route path="/scenarios/savedscenarios" element={<SavedItemsPage />} />
                            <Route path="/scenarios/saveddealsets" element={<SavedItemsPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/dummy" element={<DummyPage />} />
                            <Route path="/login" element={<LoginPage />} />
                        </Routes>
                    </div>
                    <div className="PageFooter">
                        <Footer />
                    </div>
                </span>
            </div>
        </Router>
    );
}

export default Page;

function Header() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log('front: handle logout');
        try {
            await axios.post('http://localhost:5015/Account/Logout', {}, { withCredentials: true });
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
            {isAuthenticated && (
                <div className="HeaderNav">
                    <div className="HeaderNavItem">
                        <Link to="/dummy" className="HeaderTab LinkNoDecor">
                            <img src={todoImg} alt="Menu" className="ToDoImg" />
                        </Link>
                    </div>
                    <div className="HeaderNavItem">
                        <Link to="/contact" className="HeaderTab LinkNoDecor">
                            <img src={contactImg} alt="Contact" className="ContactImg" />
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
            )}
        </div>
    );
}

function Footer() {
    return <footer className="PageFooter">
        <a className="HrefNoDecor" href="https://github.com/monty930/BridgeScenarios">
            <div className="GitHubLogo">
                <span>monty930/BridgeScenarios</span>
                <img src={GitHubLogo} alt="GitHub logo" />
            </div>
        </a>
    </footer>;
}
