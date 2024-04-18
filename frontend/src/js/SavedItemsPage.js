import React, { useState, useEffect } from 'react';
import "../css/CenterProfileLayout.css";
import "../css/SavedItemsPage.css";

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
                console.log('Fetched saved content:', data);
                console.log('Saved cont:', data.savedContents);
                setSavedContents(data.savedContents);
            })
            .catch(error => {
                console.error('Failed to fetch saved content:', error);
            });
    }, []);

    useEffect(() => {
        console.log('Saved cont is now: ', savedContents);
    }, [savedContents]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleDelete = (savedContentId, type) => {
        // fetch('http://localhost:5015/ProfileData/DeleteSavedContent', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ savedContentId: savedContentId, savedContentType: type })
        // })
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error('Failed to delete the item');
        //     }
        //     return response.text();
        // }).then(text => {
        //     return text ? JSON.parse(text) : {};
        // }).then(data => {
        //     setSavedScenarios(data.savedScenarios);
        //     setSavedDealSets(data.savedDealSets);
        // }).catch(error => {
        //     console.error('Error deleting data:', error);
        // });
    };

    return (
        <div className="profile-view-container">
            <div className="left-border"></div>
            <div className="profile-view">
                <div className="saved-content-outer-container">
                    <div className="profile-saved-tabs">
                        <button onClick={() => handleTabClick('scenarios')}
                                className={`saved-tab-button ${activeTab !== 'dealSets' ? 'active' : ''}`}>
                            CONSTRAINTS
                        </button>
                        <button onClick={() => handleTabClick('dealSets')}
                                className={`saved-tab-button ${activeTab === 'dealSets' ? 'active' : ''}`}>
                            DEAL SETS
                        </button>
                    </div>
                    <div className="saved-content-container">
                        {activeTab === 'scenarios' && (
                            <SavedItemsList
                                savedContents={savedContents}
                                contentType="Constraint"
                                noContentMessage="No saved constraints found."
                            />
                        )}
                        {activeTab === 'dealSets' && (
                            <SavedItemsList
                                savedContents={savedContents}
                                contentType="DealSet"
                                noContentMessage="No saved deal sets found."
                            />
                        )}
                    </div>
                </div>
            </div>
            <div className="right-border"></div>
        </div>
    );
  }
  
export default SavedItemsPage;

function SavedItemsList({ savedContents, contentType, noContentMessage }) {
    return (
        <div className={`saved-dynamic saved-${contentType.toLowerCase()}-dynamic`}>
            {savedContents.length > 0 ? (
                <div className="scrollable-list">
                    {savedContents.map(item => (
                        item.savedContentType === contentType &&
                        <div key={item.savedContentId} className="saved-item">
                            <button className="saved-item-button">
                                <div>{item.name}</div>
                            </button>
                            <button
                                className="saved-item-delete-button"
                                onClick={() => handleDelete(item.savedContentId, item.savedContentType)}
                            >
                                Del
                            </button>
                        </div>
                    ))}
                </div>
            ) : <p>{noContentMessage}</p>}
        </div>
    );
}
