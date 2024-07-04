import React from 'react';
import '../../css/Polls/EnterBidding.css';
import { usePollsSettingsProvider } from "./PollsSettingsProvider";

function EnterBidding() {
    const { setBidding } = usePollsSettingsProvider();

    const handleBiddingChange = (e) => {
        setBidding(e.target.value);
    };

    return (
        <div className={"PollsGrid PollsGrid3 EnterBidding"}>
            Enter bidding
            <textarea
                className={"PollsTextarea BiddingTextarea"}
                onChange={handleBiddingChange}
            ></textarea>
            You deal. Example: <br/>
            - 1NT 2H 2NT P 3C P
        </div>
    );
}

export default EnterBidding;
