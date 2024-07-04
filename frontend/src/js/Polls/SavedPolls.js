// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../../css/Scenarios/SavedItemsPage.css";
//
// import trashImage from "../../assets/trash.png";
// import trashOpen from "../../assets/trash_open.png";
//
// function SavedPolls() {
//     const navigate = useNavigate();
//
//     const [savedPolls, setSavedPolls] = useState([]);
//
//     useEffect(() => {
//         console.log("Fetching saved polls");
//         fetch('http://localhost:5015/Polls/GetSavedPolls', {
//             method: 'GET',
//             headers: { 'Content-Type': 'application/json' }
//         })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 setSavedPolls(data.savedPolls);
//             })
//             .catch(error => {
//                 console.error('Failed to fetch saved polls:', error);
//             });
//     }, []);
//
//     return (
//         <div className="profile-view-container">
//             <div className="profile-view">
//                 <div className="saved-content-container">
//                         <SavedItemsList savedContents={savedPolls}
//                                         noContentMessage="No saved polls found."/>
//                 </div>
//             </div>
//             <button
//                 onClick={() => navigate('/scenarios/polls')}
//                 className={"AnyButton PollsButton"}>
//                 Generate new polll
//             </button>
//         </div>
//     );
// }
//
// export default SavedPolls;
//
// function SavedItemsList({ savedContents, noContentMessage }) {
//     const navigate = useNavigate();
//     const [hovered, setHovered] = useState(null);
//
//     const goToPollSet = (pollSetId) => {
//         sessionStorage.setItem('savedPollSetId', pollSetId);
//         navigate('/scenarios/pollset');
//     }
//
//     const todofunc = (savedContentId, contentType) => {
//         console.log("todo");
//     }
//
//     return (
//         <div className={`saved-dynamic saved-polls-dynamic`}>
//             {savedContents.length > 0 ? (
//                 <div className="scrollable-list">
//                     {savedContents.map(item => (
//                         <div key={item.savedContentId} className="saved-item">
//                             <button className="saved-item-button" onClick={() => goToPollSet(item.savedContentId)}>
//                                 <div>{item.name}</div>
//                             </button>
//                             <button
//                                 className="SavedItemDeleteButton"
//                                 onMouseEnter={() => setHovered(item.savedContentId)}
//                                 onMouseLeave={() => setHovered(null)}
//                                 onClick={() => todofunc(item.savedContentId, item.savedContentType)}
//                             >
//                                 <img src={hovered === item.savedContentId ? trashOpen : trashImage} alt="Delete" />
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             ) : <p>{noContentMessage}</p>}
//         </div>
//     );
// }


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../css/Scenarios/SavedItemsPage.css";

import trashImage from "../../assets/trash.png";
import trashOpen from "../../assets/trash_open.png";

function SavedPolls() {
    const navigate = useNavigate();
    const [savedContents, setSavedContents] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5015/Scenarios/GetSavedContent', {
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

    const handleDelete = (savedContentId, type) => {
        setSavedContents(savedContents.filter(item => { return item.savedContentId !== savedContentId || item.savedContentType !== type; }));
        fetch('http://localhost:5015/Scenarios/DeleteSavedContent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ savedContentId: savedContentId, savedContentType: type })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            }).catch(error => {
            console.error('Failed to delete saved content:', error);
        });
    };

    return (
        <div>
            <div className="saved-content-container">
                <SavedItemsList savedContents={savedContents} contentType="PollSet"
                                noContentMessage="No saved poll sets found." handleDelete={handleDelete}/>
            </div>
            <button
                onClick={() => navigate('/scenarios/polls')}
                className={"AnyButton PollsButton"}>
                Generate new poll
            </button>
        </div>
    );
}

export default SavedPolls;

function SavedItemsList({ savedContents, contentType, noContentMessage, handleDelete }) {
    const navigate = useNavigate();
    const [hovered, setHovered] = useState(null);

    const goToPollSet = (pollSetId) => {
        sessionStorage.setItem('savedPollSetId', pollSetId);
        navigate(`/scenarios/pollset`);
        console.log("TODO going to poll set with id: " + pollSetId);
    }

    return (
        <div className={`saved-dynamic saved-${contentType.toLowerCase()}-dynamic`}>
            {savedContents.length > 0 ? (
                <div className="ScrollableList">
                    {savedContents.map(item => (
                        item.savedContentType === contentType &&
                        <div key={item.savedContentId} className="saved-item">
                            <button className="saved-item-button" onClick={() => goToPollSet(item.savedContentId)}>
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
