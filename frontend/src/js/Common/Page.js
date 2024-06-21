import React from "react";
import {BrowserRouter as Router, Link, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import axios from "axios";
import ProfilePage from "./ProfilePage";
import LoginPage from "./LoginPage";
import Scenarios from "../Scenarios/Scenarios";
import SavedItemsPage from "../Scenarios/SavedItemsPage";
import WelcomePage from "./WelcomePage";
import {useAuth} from "./AuthContext";
import ErrorPage from "./ErrorPage";
import ScenariosIntroPage from "../Scenarios/ScenariosIntroPage";

import "../../css/Common/Page.css";
import '../../css/Common/LoginPage.css';
import '../../css/Scenarios/Scenarios.css';
import '../../css/Scenarios/MakeScenarios.css';
import '../../css/Scenarios/UseScenariosChoose.css';
import '../../css/Scenarios/DealSetLayout.css';
import "../../css/Common/WelcomePage.css";
import "../../css/Scenarios/ScenariosIntroPage.css";

import PageLogo from "../../assets/2diams.png";
import SavedItemsImg from "../../assets/folder3.png";
import LogOutImg from "../../assets/logout.png";
import ProfileImg from "../../assets/profile.png";
import GitHubLogo from "../../assets/githublogo.png";
import menuImg from '../../assets/menu2.png';
import contactImg from '../../assets/contact-icon4.png';
import todoImg from '../../assets/todo-icon2.png';
import ContactPage from "./ContactPage";
import DummyPage from "./DummyPage";

function Page() {
    const {isAuthenticated, authError} = useAuth();

    return (
        <Router>
            <div className="Page">
                {authError && (
                    <ErrorPage error={authError}/>
                )}
                {!authError && (
                <span>
                    <div className="PageHeader"><Header auth={isAuthenticated && !authError}/></div>
                    <div className="PageContent">
                        <Routes>
                            {isAuthenticated ? (
                                <>
                                    <Route path="/" element={<WelcomePage/>}/>
                                    {/*<Route path="/scenarios" element={<ScenariosIntroPage/>}/>*/}
                                    <Route path="/scenarios/make" element={<Scenarios/>}/>
                                    <Route path="/scenarios/use" element={<Scenarios/>}/>
                                    <Route path="/scenarios/savedscenarios" element={<SavedItemsPage/>}/>
                                    <Route path="/scenarios/saveddealsets" element={<SavedItemsPage/>}/>
                                    <Route path="/profile" element={<ProfilePage/>}/>
                                    <Route path="/contact" element={<ContactPage/>}/>
                                    <Route path="/dummy" element={<DummyPage/>}/>
                                </>
                            ) : (
                                <Route path="*" element={<Navigate replace to="/login"/>}/>
                            )}
                            <Route path="/login" element={<LoginPage/>}/>
                        </Routes>
                    </div>
                    <div className="PageFooter">
                        <Footer/>
                    </div>
                </span>
                )}
            </div>
        </Router>

    );
}

export default Page;

function Header({auth}) {
    const {logout} = useAuth();
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
                    <img src={PageLogo} alt="2diams logo" className="PageLogo"/>
                </Link>
            </div>
            {auth && (
                <div className="HeaderNav">
                    <div className="HeaderNavItem">
                        <Link to="/dummy" className="HeaderTab LinkNoDecor">
                            <img src={todoImg} alt="Menu" className="ToDoImg"/>
                        </Link>
                    </div>
                    <div className="HeaderNavItem">
                        <Link to="/contact" className="HeaderTab LinkNoDecor">
                            <img src={contactImg} alt="Contact" className="ContactImg"/>
                        </Link>
                    </div>
                    <div className="HeaderNavItem">
                        <Link to="/profile" className="HeaderTab LinkNoDecor">
                            <img src={ProfileImg} alt="Profile" className="ProfileImg"/>
                        </Link>
                    </div>
                    <div className="HeaderNavItem">
                        <button className="HeaderTab LogOutButton LinkNoDecor" onClick={handleLogout}>
                            <img src={LogOutImg} alt="Log out" className="LogOutImg"/>
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
                <span>monty930/BridgeScenarios
                </span>
                <img src={GitHubLogo} alt="GitHub logo"/>
            </div>
        </a>
    </footer>;
}
