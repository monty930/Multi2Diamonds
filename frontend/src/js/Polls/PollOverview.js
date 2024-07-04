import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

function PollOverview() {
    const navigate = useNavigate();
    useEffect(() => {
        if (sessionStorage.getItem('savedPollSetId') === null) {
            navigate('/scenarios/polls');
        }
        fetch('http://localhost:5015/Polls/FetchPollSet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pollSetId: sessionStorage.getItem('savedPollSetId'),
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log("HERERERE: ")
                console.log(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div className="PollOverviewPage">

        </div>
    );
}

export default PollOverview;
