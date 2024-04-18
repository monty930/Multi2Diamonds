import React, { useEffect, useState } from 'react';
import Spinner from "./Spinner";
import "../css/CenterProfileLayout.css";
function ProfilePage() {
    const [profileData, setProfileData] = useState({ username: '', dealSetsCount: 0, scenariosCount: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            const response = await fetch('http://localhost:5015/ProfileData/GetProfile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setProfileData({
                    username: data.username,
                    dealSetsCount: data.DealSetsCount,
                    scenariosCount: data.ScenariosCount
                });
            } else {
                console.error('Failed to fetch profile data');
            }
            setIsLoading(false);
        };

        fetchProfileData();
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
                <p>Number of Deal Sets: {profileData.dealSetsCount}</p>
                <p>Number of Scenarios: {profileData.scenariosCount}</p>
            </div>
            <div className="right-border"></div>
        </div>
    );
}

export default ProfilePage;
