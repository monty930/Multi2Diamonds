import React, { useEffect, useState } from 'react';
import Spinner from "./Spinner";
import "../../css/Common/CenterProfileLayout.css";
import bridgeImage from "../../assets/bridge-inverted-transparent.png";
import profileImage from "../../assets/profile-picture.png";

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
        <div className={"ProfilePageOuter"}>
            <div className="CenteredBackgroundContainer">
                <img src={bridgeImage} alt="Bridge" className="CenteredBackgroundBridgeImage"/>
            </div>
            <div className={"CenteredLayout"}>
                <div className={"ProfilePageInner"}>
                    <div className={"ProfileCard"}>
                        <div className={"ProfilePicture"}>
                            <img src={profileImage} alt="Bridge" className="ProfileImg"/>
                        </div>
                        <div className={"ProfileInfo"}>
                            <span className={"UserName"}>{profileData.username}</span>
                            email: costam@costam.com<br/>
                            joined on: July 2024
                        </div>
                    </div>
                    <div className={"ProfileButtonsOuter"}>
                        <div className={"ProfileButtonsInner"}>
                            <button className={"ProfileButton AnyButton"}>Change email adress</button>
                            <button className={"ProfileButton AnyButton"}>Change password</button>
                            <button className={"ProfileButton AnyButton RedButton"}>Delete account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
