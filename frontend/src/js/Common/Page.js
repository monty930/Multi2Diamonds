import React from 'react';
import {BrowserRouter as Router, Link, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import ProfilePage from './ProfilePage';
import LoginPage from './LoginPage';
import Scenarios from '../Scenarios/Scenarios';
import SavedItemsPage from '../Scenarios/SavedItemsPage';
import WelcomePage from './WelcomePage';
import PollOverview from '../Polls/PollOverview';
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
import ErrorPage from "./ErrorPage";
import Polls from "../Polls/Polls";
import SavedPolls from "../Polls/SavedPolls";
import DebugTools from "./DebugTools";

function Page() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

function AppContent() {
    const { networkError, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="Page">
                <>
                    <div className="PageHeader"><Header /></div>
                    <div className="PageContent">
                        <Routes>
                            {networkError ? (
                                <>
                                    <Route path="/" element={<ErrorPage error = "Network error.&#10;Please try again later."/>}/>
                                    <Route path="*" element={<Navigate replace to="/"/>}/>
                                </>
                            ) : (
                                <>
                                    {isAuthenticated ? (
                                        <>
                                            <Route path="/" element={<WelcomePage/>}/>
                                            <Route path="/scenarios/make" element={<Scenarios/>}/>
                                            <Route path="/scenarios/use" element={<Scenarios/>}/>
                                            <Route path="/scenarios/polls" element={<Polls/>}/>
                                            <Route path="/scenarios/savedpolls" element={<SavedPolls/>}/>
                                            <Route path="/scenarios/pollset" element={<PollOverview/>}/>
                                            <Route path="/scenarios/savedscenarios" element={<SavedItemsPage/>}/>
                                            <Route path="/scenarios/saveddealsets" element={<SavedItemsPage/>}/>
                                            <Route path="/profile" element={<ProfilePage/>}/>
                                            <Route path="/contact" element={<ContactPage/>}/>
                                            <Route path="/dummy" element={<DummyPage/>}/>
                                            <Route path="/debug" element={<DebugTools/>}/>
                                        </>
                                    ) : (
                                        <Route path="*" element={<Navigate replace to="/login"/>}/>
                                    )}
                                    <Route path="/login" element={<LoginPage />} />
                                </>
                            )}
                        </Routes>
                    </div>
                    <div className="PageFooter">
                        <Footer />
                    </div>
                </>
            </div>
        </Router>
    );
}

export default Page;

function Header() {
    const {isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5015/Account/Logout', {}, { withCredentials: true });
            logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error: ', error);
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
