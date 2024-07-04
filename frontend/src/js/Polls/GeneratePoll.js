import React from 'react';
import {useNavigate} from "react-router-dom";
import '../../css/Polls/GeneratePoll.css';
import { usePollsSettingsProvider } from "./PollsSettingsProvider";

function GeneratePoll() {
    const navigate = useNavigate();

    const { numberOfDeals, bidding, keyBinds, constraint } = usePollsSettingsProvider();
    const [logMessage, setLogMessage] = React.useState("");
    const [logSuccess, setLogSuccess] = React.useState(true);

    const handleLog = (message, success) => {
        setLogMessage(message);
        setLogSuccess(success);
        setTimeout(() => handleLogTimeout(), 4000);
    }

    const handleLogTimeout = () => {
        setLogMessage('');
        setLogSuccess(true);
    }

    const handleGeneratePoll = async () => {
        const pollsSettings = { numberOfDeals, bidding, keyBinds, constraint };
        try {
            const response = await fetch('http://localhost:5015/Polls/GeneratePolls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pollsSettings),
            });

            if (response.ok) {
                const result = await response.json();
                handleLog(`Poll generated successfully.`, true);
                console.log(result);
            } else {
                handleLog(`Error generating poll: ${response.statusText}`, false);
            }
        } catch (error) {
            handleLog(`Error generating poll: ${error.message}`, false);
        }
    };

    return (
        <div className={"PollsGrid PollsGrid4 GeneratePoll"}>
            <div className={"LogMessage" }>
                <span className={logSuccess ? 'LogSuccess' : 'LogFailure'}>
                    {logMessage}
                </span>
            </div>
            <button className={"AnyButton PollsButton"} onClick={handleGeneratePoll}>
                Generate Poll
            </button>
            <button
                onClick={() => navigate('/scenarios/savedpolls')}
                className={"AnyButton PollsButton"}>
                My Polls
            </button>
        </div>
    );
}

export default GeneratePoll;
