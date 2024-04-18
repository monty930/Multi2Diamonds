import React, { useState, useEffect } from 'react';
import "../css/SavedItemsPage.css";

function SavedItemsPage() {
    const [savedScenarios, setSavedScenarios] = useState([]);
    const [savedDealSets, setSavedDealSets] = useState([]);
    const [activeTab, setActiveTab] = useState('constraints');

    useEffect(() => {
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
                setSavedScenarios(data[0]);
                setSavedDealSets(data[1]);
                if (data[0].length === 0 && data[1].length === 0) {
                    fillWithDummyData();
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                fillWithDummyData();
            });
    }, []);
    
    const fillWithDummyData = () => {
        setSavedScenarios([
            { id: 1, name: 'Scenario 1 DUMMY' },
            { id: 2, name: 'Scenario 2 DUMMY' },
            { id: 6, name: 'Scenario 3 DUMMY' }
        ]);
        setSavedDealSets([
            { id: 4, name: 'Deal set 1 DUMMY' },
            { id: 5, name: 'Deal set 2 DUMMY' },
            { id: 3, name: 'Deal set 3 DUMMY' }
        ]);
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const handleDelete = (savedContentId, type) => {
        console.log('Handle delete called with id:', savedContentId, 'and type:', type);
        const endpoint = 'http://localhost:5015/ProfileData/' + (type === 'constraint' ? 'DeleteSavedScenario' : 'DeleteSavedDealSet');
        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ savedContentId })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete the item');
                }
                return response.json();
            }).then(data => {
                setSavedScenarios(data[0]);
                setSavedDealSets(data[1]);
            })
            .catch(error => console.error('Error deleting item:', error));
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
                            <div className="saved-dynamic saved-constraints-dynamic">
                                {savedScenarios.length > 0 ? (
                                    <div className="scrollable-list">
                                        {savedScenarios.map(item => (
                                            <div key={item.id} className="saved-item">
                                                <button className="saved-item-button">
                                                    <div>{item.name}</div>
                                                </button>
                                                <button
                                                    className="button-all red-button saved-item-delete-button"
                                                    onClick={() => handleDelete(item.id, 'constraint')}
                                                >
                                                    Del
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p>No saved constraints found.</p>}
                            </div>
                        )}
                        {activeTab === 'dealSets' && (
                            <div className="saved-dynamic saved-dealsets-dynamic">
                                {savedDealSets.length > 0 ? (
                                    <div className="scrollable-list">
                                        {savedDealSets.map(item => (
                                            <div key={item.id} className="saved-item">
                                                <button className="saved-item-button">
                                                    <div>{item.name}</div>
                                                </button>
                                                <button
                                                    className="button-all red-button saved-item-delete-button"
                                                    onClick={() => handleDelete(item.id, 'dealSet')}
                                                >
                                                    Del
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p>No saved deal sets found.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="right-border"></div>
        </div>
    );
  }
  
export default SavedItemsPage;
  