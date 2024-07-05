import React, { useEffect, useState } from 'react';

import Spinner from "./Spinner";
import ErrorPage from "./ErrorPage";

import '../../css/Common/DebugTools.css';

function DebugTools() {
    const [adminTools, setAdminTools] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchAdminCheck = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5015/ProfileData/CheckAdmin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                setAdminTools(true);
            } else {
                setAdminTools(false);
            }
        } catch (error) {
            console.error('Error fetching admin permission.', error);
            setAdminTools(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminCheck();
    }, []);

    const addDummyDealSets = async () => {
    }

    const addDummyConstraints = async () => {
    }

    const addDummyPollSet = async () => {
    }

    const deleteAllDealSets = async () => {
        try {
            const response = await fetch('http://localhost:5015/DB/DeleteAllDealSets', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
            } else {
            }
        } catch (error) {
            console.error('Error deleting deal sets.', error);
        }

        window.location.reload();
    }

    const deleteAllConstraints = async () => {
        try {
            const response = await fetch('http://localhost:5015/DB/DeleteAllScenarios', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
            } else {
            }
        } catch (error) {
            console.error('Error deleting constraints.', error);
        }

        window.location.reload();
    }

    const deleteAllPollSets = async () => {
        try {
            const response = await fetch('http://localhost:5015/DB/DeleteAllPollSets', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
            } else {
            }
        } catch (error) {
            console.error('Error deleting poll sets.', error);
        }

        window.location.reload();
    }

    return (
        loading ? <Spinner/> :
            !adminTools ? <ErrorPage error="Authorization error.&#10;You don't have permission to access this page."/> :
                <div className="DebugPage">
                    <div className={"DebugPageInner"}>
                        <div className="DebugButtons">
                            <div className="DebugTitle">
                                DEBUG TOOLS
                            </div>
                            <button className="AnyButton DebugButton" onClick={addDummyDealSets}>
                                Add dummy deal sets (TD)
                            </button>
                            <button className="AnyButton DebugButton" onClick={addDummyConstraints}>
                                Add dummy constraints (TD)
                            </button>
                            <button className="AnyButton DebugButton" onClick={addDummyPollSet}>
                                Add dummy poll set (TD)
                            </button>
                            <button className="AnyButton DebugButton" onClick={deleteAllDealSets}>
                                Delete all deal sets
                            </button>
                            <button className="AnyButton DebugButton" onClick={deleteAllConstraints}>
                                Delete all constraints
                            </button>
                            <button className="AnyButton DebugButton" onClick={deleteAllPollSets}>
                                Delete all poll sets
                            </button>
                        </div>
                        <div className="DBViewContainer">
                            <div className="DebugTitle">
                                DATABASE VIEW
                            </div>
                            <HierarchicalView/>
                        </div>
                    </div>
                </div>
    );
}

export default DebugTools;

function HierarchicalView() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPsswd, setShowPsswd] = useState(false);

    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:5015/DB/ShowDB', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                const json = await response.json();
                console.log('Fetched DB data:', json);
                setData(json);
            } else {
                console.error('Error fetching hierarchical data.');
            }
        } catch (error) {
            console.error('Error fetching hierarchical data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data || data.length === 0) {
        return <div>No data available</div>;
    }

    const getHash = () => {
        return Math.random().toString(36).substring(2, 12);
    }

    return (
        <div>
            {data.map(user => (
                <div>
                    <div className={"DbInfo"}>
                        <span className={"DbLabel"}>Username: </span>
                        <span>{user.username}</span>
                    </div>
                    <div className={"DbInfo"}>
                        <span className={"DbLabel"}>UserId: </span>
                        <span>{user.userId}</span>
                    </div>
                    <div className={"DbInfo"}>
                        <span className={"DbLabel"}>Email: </span>
                        <span>{user.email}</span>
                    </div>
                    <div className={"DbInfo"}>
                        <span className={"DbLabel"}>CreationDate: </span>
                        <span>{user.creationDate}</span>
                    </div>
                    <div className={"DbInfo"}>
                        <span className={"DbLabel"}>Password: </span>
                        <span>
                            {showPsswd ? user.password : ''}
                            &nbsp;
                            <button className={"AnyButton ShowPsswdDebug"} onClick={() => setShowPsswd(!showPsswd)}>
                                {showPsswd ? 'Hide' : 'Show password hash'}
                            </button>
                        </span>
                    </div>
                    <div className={"DbInfo"}>
                        <span className={"DbLabel"}>Is admin: </span>
                        <span>{user.isAdmin ? 'Yes' : 'No'}</span>
                    </div>
                    <div className={"DbInfo"}>
                        <span className={"DbLabel"}>Profile picture path: </span>
                        <span>{user.profilePicturePath}</span>
                    </div>
                    <span className={"DbLabel"}>Deal sets: </span>
                    <div className={"DbIds"}>
                        {user.dealSets.map(dealSet => (
                            <div>
                                {dealSet.dealSetId}
                            </div>
                        ))}
                    </div>
                    {user.dealSets.length === 0 && <div>No deal sets</div>}
                    <span className={"DbLabel"}>Constraints: </span>
                    <div className={"DbIds"}>
                        {user.scenarios.map(constraint => (
                            <div>
                                {constraint.scenarioId}
                            </div>
                        ))}
                    </div>
                    {user.scenarios.length === 0 && <div>No scenarios</div>}
                    <span className={"DbLabel"}>Poll sets: </span>
                    <div className={"DbIds"}>
                        {user.pollSets.map(pollset => (
                            <div>
                                {pollset.pollSetId}
                            </div>
                        ))}
                    </div>
                    {user.pollSets.length === 0 && <div>No poll sets</div>}
                    --------------
                </div>
            ))}

        </div>
    );
}
