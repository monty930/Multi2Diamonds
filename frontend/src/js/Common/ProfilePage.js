import React, { useEffect, useState, useCallback } from 'react';
import Spinner from "./Spinner";
import bridgeImage from "../../assets/bridge-inverted-transparent.png";
import profileImage from "../../assets/profile-picture.png";
import editProfileImg from "../../assets/input.png";
import crossImg from "../../assets/cross.png";

function ProfilePage() {
    const [profileData, setProfileData] = useState({ username: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
    const [logMessage, setLogMessage] = useState('');

    useEffect(() => {
        const fetchProfileData = async () => {
            console.log('fetching profile data');
            try {
                const response = await fetch('http://localhost:5015/ProfileData/GetProfile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfileData({
                        username: data.username,
                        email: data.email,
                        joined: data.creationDate,
                        profilePicturePath: data.profilePicturePath,
                    });
                    console.log('fetched profile data: ', data.profilePicturePath);
                } else {
                    console.error('Failed to fetch profile data');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    const displayLogMessage = useCallback((logMessage, success) => {
        setLogMessage(logMessage);
        const logMessageElement = document.getElementById('ProfileLogMessage');
        if (logMessageElement) {
            logMessageElement.style.display = 'flex';
            logMessageElement.className =
                success ? 'ProfileLogMessage ProfileLogMessageSuccess' : 'ProfileLogMessage ProfileLogMessageError';
            setTimeout(() => {
                setLogMessage('');
                logMessageElement.style.display = 'none';
            }, 5000);
        }
    }, []);

    const getCreationDate = useCallback((creationDate) => {
        const date = new Date(creationDate);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${year}`;
    }, []);

    const handleSuccessEmailChange = useCallback((message, email) => {
        displayLogMessage(message, true);
        setProfileData((prevData) => ({ ...prevData, email }));
    }, [displayLogMessage]);

    const handleFileUpload = useCallback(async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5015/ProfileData/UploadProfilePicture', {
                method: 'POST',
                body: formData,
                contentType: false,
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData((prevData) => ({ ...prevData, profilePicturePath: data.filePath }));
                displayLogMessage('Profile picture updated successfully.', true);
            } else {
                displayLogMessage('Failed to upload profile picture.', false);
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            displayLogMessage('Error uploading profile picture. Please try again later.', false);
        }
    }, []);

    const handleFileChange = useCallback(async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const file = event.target.files[0];
        if (file) {
            await handleFileUpload(file);
        }
    }, [handleFileUpload]);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="CenterPageOuter">
            <div className="CenteredBackgroundContainer">
                <img src={bridgeImage} alt="Bridge" className="CenteredBackgroundBridgeImage" />
            </div>
            <div className="CenteredLayout">
                <div className="CenterPageInner">
                    <div className="ProfileCard">
                        <div className="ProfilePicture">
                            {profileData.profilePicturePath ? (
                                <img src={profileData.profilePicturePath} alt="Profile" className="ProfileImg" />
                            ) : (
                                <img src={profileImage} alt="Profile" className="ProfileImg" />
                            )}
                            <label htmlFor="profilePictureUpload" className="EditProfilePictureButton">
                                <img src={editProfileImg} alt="Edit profile" className="EditProfileImg" />
                            </label>
                            <input
                                type="file"
                                id="profilePictureUpload"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="ProfileInfo">
                            <span className="UserName">{profileData.username}</span>
                            email: {profileData.email}<br />
                            joined on: {getCreationDate(profileData.joined)}
                        </div>
                    </div>
                    <div id="ProfileLogMessage" className="ProfileLogMessage ProfileLogMessageError">
                        <span className="ProfileLogMessageText">{logMessage}</span>
                    </div>
                    <div className="ProfileButtonsOuter">
                        <div className="ProfileButtonsInner">
                            <button className="ProfileButton AnyButton" onClick={() => setIsEmailDialogOpen(true)}>
                                Change email address
                            </button>
                            <button className="ProfileButton AnyButton">Change password</button>
                            <button className="ProfileButton AnyButton RedButton">Delete account</button>
                        </div>
                    </div>
                </div>
            </div>
            <EmailChangeDialog
                oldValue={profileData.email}
                isOpen={isEmailDialogOpen}
                onClose={() => setIsEmailDialogOpen(false)}
                onFailure={(s) => displayLogMessage(s, false)}
                onSuccess={(email) => handleSuccessEmailChange('Email changed successfully.', email)}
            />
        </div>
    );
}

export default ProfilePage;

function EmailChangeDialog({ oldValue, isOpen, onClose, onFailure, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async () => {
        setIsLoading(true);
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
