import React, { useEffect, useState } from 'react';
import Spinner from "./Spinner";
import "../../css/Common/CenterProfileLayout.css";
function ProfilePage() {
    const [profileData, setProfileData] = useState({ username: '' });
    const [isLoading, setIsLoading] = useState(true);

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
                setProfileData({
                    username: data.username
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

    return (
        <div className="profile-view-container">
            <div className="left-border"></div>
            <div className="profile-view">
                <h1>My Profile</h1>
                <p>Username: {profileData.username}</p>
            </div>
            <div className="right-border"></div>
        </div>
    );
}

export default ProfilePage;
