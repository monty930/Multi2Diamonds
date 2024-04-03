import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import GreetForm from "./GreetForm";
import ProfilePage from "./ProfilePage";
import LoginPage from "./LoginPage";
import Scenarios from "./scenarios/Scenarios";
import SavedItemsPage from "./SavedItemsPage";
import "../css/Page.css";

function Header() {
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
                    <Link to="/login" className="LinkNoDecor">Log out</Link>
                </div>
            </div>
        </div>
    );
}

function Footer() {
    return <footer className="PageFooter">Footer content</footer>;
}

function Page() {
    return (
        <Router>
            <div className="Page">
                <div className="PageHeader"><Header /></div>
                <div className="PageContent">
                    <Routes>
                        {/* <Route path="/" element={<GreetForm />} /> */}
                        <Route path="/" element={<Navigate replace to="/scenarios/make" />} />
                        <Route path="/scenarios/make" element={<Scenarios />} />
                        <Route path="/scenarios/use" element={<Scenarios />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/saved" element={<SavedItemsPage />} />
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
