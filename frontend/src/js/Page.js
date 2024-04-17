import React from "react";
import {BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate} from "react-router-dom";
import ProfilePage from "./ProfilePage";
import LoginPage from "./LoginPage";
import Scenarios from "./scenarios/Scenarios";
import SavedItemsPage from "./SavedItemsPage";
import "../css/Page.css";
import {useAuth} from "./AuthContext";
import axios from "axios";

function Header() {
    const { logout } = useAuth(); // Access the logout function from AuthContext
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5015/Account/Logout'); // Send logout request to backend
            logout(); // Call the logout function from AuthContext
            navigate('/login'); // Redirect to the login page after logout
        } catch (error) {
            console.error('Logout error:', error);
            // Handle logout error if needed
        }
    };

    return (
        <div className="HeaderContent">
            <div className="PageTitle">
                <Link to="/" className="LinkNoDecor">Page title</Link>
            </div>
            <div className="HeaderNav">
                <div className="HeaderNavItem">
                    <Link to="/saved" className="LinkNoDecor">Saved items</Link>
                </div>
                <div className="HeaderNavItem">
                    <Link to="/profile" className="LinkNoDecor">Profile</Link>
                </div>
                <div className="HeaderNavItem">
                    <button className="LinkNoDecor" onClick={handleLogout}>Log out</button>
                </div>
            </div>
        </div>
    );
}

function Footer() {
    return <footer className="PageFooter">Footer content</footer>;
}

function Page() {
    // isAuthenticated should be taken from the AuthContext
    const { isAuthenticated } = useAuth();
    
    console.log('isAuthenticated from Page:', isAuthenticated);

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
