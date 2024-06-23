import React, { useEffect, useState } from 'react';
import Spinner from "./Spinner";

import bridgeImage from "../../assets/bridge-inverted-transparent.png";
import profileImage from "../../assets/profile-picture.png";
import editProfileImg from "../../assets/input.png";
import crossImg from "../../assets/cross.png";

function ProfilePage() {
    const [profileData, setProfileData] = useState({ username: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [logMessage, setLogMessage] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            const response = await fetch('http://localhost:5015/ProfileData/GetProfile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setProfileData({
                    username: data.username,
                    email: data.email,
                    joined: data.creationDate,
                });
            } else {
                console.error('Failed to fetch profile data');
            }
            setIsLoading(false);
        };

        fetchProfileData().then();
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    function displayLogMessage(logMessage, success) {
        setLogMessage(logMessage);
        document.getElementById('ProfileLogMessage').style.display = 'flex';
        document.getElementById('ProfileLogMessage').className =
            success ?   'ProfileLogMessage ProfileLogMessageSuccess' :
                        'ProfileLogMessage ProfileLogMessageError';
        setTimeout(() => {
            setLogMessage('');
            document.getElementById('ProfileLogMessage').style.display = 'none';
        }, 5000);
    }

    function getCreationDate(creationDate) {
        const date = new Date(creationDate);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    }

    function handleSuccessEmailChange(message, email) {
        displayLogMessage(message, true);
        setProfileData({ ...profileData, email });
    }

    return (
        <div className={"CenterPageOuter"}>
            <div className="CenteredBackgroundContainer">
                <img src={bridgeImage} alt="Bridge" className="CenteredBackgroundBridgeImage"/>
            </div>
            <div className={"CenteredLayout"}>
                <div className={"CenterPageInner"}>
                    <div className={"ProfileCard"}>
                        <div className={"ProfilePicture"}>
                            <img src={profileImage} alt="Profile" className="ProfileImg"/>
                            <button className={"EditProfilePictureButton"}>
                                <img src={editProfileImg} alt="Edit profile" className="EditProfileImg"/>
                            </button>
                        </div>
                        <div className={"ProfileInfo"}>
                            <span className={"UserName"}>{profileData.username}</span>
                            email: {profileData.email}<br/>
                            joined on: {getCreationDate(profileData.joined)}
                        </div>
                    </div>
                    <div id={"ProfileLogMessage"} className={"ProfileLogMessage ProfileLogMessageError"}>
                        <span className={"ProfileLogMessageText"}>{logMessage}</span>
                    </div>
                    <div className={"ProfileButtonsOuter"}>
                        <div className={"ProfileButtonsInner"}>
                            <button className={"ProfileButton AnyButton"} onClick={() => setIsDialogOpen(true)}>
                                Change email address
                            </button>
                            <button className={"ProfileButton AnyButton"}>Change password</button>
                            <button className={"ProfileButton AnyButton RedButton"}>Delete account</button>
                        </div>
                    </div>
                </div>
            </div>
            <EmailChangeDialog
                oldValue={profileData.email}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onFailure={(s)=> displayLogMessage(s, false)}
                onSuccess={(email) => handleSuccessEmailChange('Email changed successfully.', email)}
            />
        </div>
    );
}

export default ProfilePage;

function EmailChangeDialog({ oldValue, isOpen, onClose, onFailure, onSuccess }) {
    console.log('EmailChangeDialog ' + oldValue);

    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsLoading(true);
        console.log('handle submit');
        console.log(email);
        if (notValid(email)) {
            setIsLoading(false);
            onFailure('New email address is not valid.');
            onClose();
            return;
        }
        const response = await fetch('http://localhost:5015/ProfileData/ChangeEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            onSuccess(email);
        } else {
            onFailure('Failed to change email address. Please try again later.');
        }

        setIsLoading(false);
        setEmail('');
        onClose();
    }

    return (
        <div className="DialogWindow">
            <div className="DialogWindowContent">
                <button className="CloseButton" onClick={onClose}>
                    <img src={crossImg} alt="Close" className={"CrossImg"}/>
                </button>
                <textarea
                    defaultValue={oldValue}
                    onChange={(e) => setEmail(e.target.value)}
                    rows="1"
                    cols="25"
                    placeholder="email"
                    style={{ resize: 'none' }}
                />
                <div className="SaveSpinnerContainer">
                    {isLoading && (
                        <Spinner />
                    )}
                </div>
                <button className="SaveSubmitButton" onClick={handleSubmit} disabled={isLoading}>Submit</button>
            </div>
        </div>
    );
}

function notValid(email) {
    return email.length === 0 || !email.includes('@') || !email.includes('.');
}
