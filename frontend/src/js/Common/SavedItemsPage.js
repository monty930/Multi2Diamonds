import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../css/Common/CenterProfileLayout.css";
import "../../css/Common/SavedItemsPage.css";

import trashImage from "../../assets/trash.png";
import trashOpen from "../../assets/trash_open.png";

function SavedItemsPage() {
    const [savedContents, setSavedContents] = useState([]);
    const [activeTab, setActiveTab] = useState('constraints');
    
    useEffect(() => {
        console.log('Fetching saved content');
        fetch('http://localhost:5015/ProfileData/GetSavedContent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setSavedContents(data.savedContents);
            })
            .catch(error => {
                console.error('Failed to fetch saved content:', error);
            });
    }, []);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleDelete = (savedContentId, type) => {
        console.log('Deleting saved content:', savedContentId, type);
        setSavedContents(savedContents.filter(item => { return item.savedContentId !== savedContentId || item.savedContentType !== type; }));
        fetch('http://localhost:5015/ProfileData/DeleteSavedContent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ savedContentId: savedContentId, savedContentType: type })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('deleted!');
        }).catch(error => {
            console.error('Failed to delete saved content:', error);
        });
    };

    return (
        <div className="profile-view-container">
            <div className="left-border"></div>
            <div className="profile-view">
                <div className="saved-content-outer-container">
                    <div className="profile-saved-tabs">
                        <button onClick={() => handleTabClick('constraints')}
                                className={`saved-tab-button ${activeTab !== 'dealSets' ? 'active' : ''}`}>
                            CONSTRAINTS
                        </button>
                        <button onClick={() => handleTabClick('dealSets')}
                                className={`saved-tab-button ${activeTab === 'dealSets' ? 'active' : ''}`}>
                            DEAL SETS
                        </button>
                    </div>
                    <div className="saved-content-container">
                        {activeTab === 'constraints' && (
                            <SavedItemsList savedContents={savedContents} contentType="Constraint"
                                noContentMessage="No saved constraints found." handleDelete={handleDelete}/>
                        )}
                        {activeTab === 'dealSets' && (
                            <SavedItemsList savedContents={savedContents} contentType="DealSet"
                                noContentMessage="No saved deal sets found." handleDelete={handleDelete}/>
                        )}
                    </div>
                </div>
            </div>
            <div className="right-border"></div>
        </div>
    );
  }
  
export default SavedItemsPage;

function SavedItemsList({ savedContents, contentType, noContentMessage, handleDelete }) {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(null);
    
    const redirect = (id, type) => {
        if (type === 'Constraint') {
            goToConstraint(id);
        } else if (type === 'DealSet') {
            goToDealSet(id);
        }
    }
    
    const goToConstraint = (constraintId) => {
        sessionStorage.setItem('savedConstraintId', constraintId);
        navigate(`/scenarios/make`);
    }
    
    const goToDealSet = (dealSetId) => {
        sessionStorage.setItem('savedDealSetId', dealSetId);
        navigate(`/scenarios/use`);
    }
    
    return (
        <div className={`saved-dynamic saved-${contentType.toLowerCase()}-dynamic`}>
            {savedContents.length > 0 ? (
                <div className="scrollable-list">
                    {savedContents.map(item => (
                        item.savedContentType === contentType &&
                        <div key={item.savedContentId} className="saved-item">
                            <button className="saved-item-button" onClick={() => redirect(item.savedContentId, item.savedContentType)}>
                                <div>{item.name}</div>
                            </button>
                            <button
                                className="SavedItemDeleteButton"
                                onMouseEnter={() => setHovered(item.savedContentId)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => handleDelete(item.savedContentId, item.savedContentType)}
                            >
                                <img src={hovered === item.savedContentId ? trashOpen : trashImage} alt="Delete" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : <p>{noContentMessage}</p>}
        </div>
    );
}
