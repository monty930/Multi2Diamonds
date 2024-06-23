import React, { useEffect, useState } from 'react';
import Spinner from "./Spinner";
import "../../css/Common/CenterProfileLayout.css";
import bridgeImage from "../../assets/bridge-inverted-transparent.png";
import profileImage from "../../assets/profile-picture.png";
import editProfileImg from "../../assets/input.png";
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

    function getCreationDate(creationDate) {
        const date = new Date(creationDate);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${month} ${year}`;
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
