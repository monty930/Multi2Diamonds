import React from 'react';
import ChooseScenarioForPoll from "./ChooseScenarioForPoll";
import EnterBidding from "./EnterBidding";
import GeneratePoll from "./GeneratePoll";
import BindKeys from "./BindKeys";
import {PollsProvider} from "./PollsSettingsProvider";

import '../../css/Polls/Polls.css';

function Polls() {
    return (
        <PollsProvider>
            <div className={"Polls"}>
                <ChooseScenarioForPoll/>
                <BindKeys/>
                <EnterBidding/>
                <GeneratePoll/>
            </div>
        </PollsProvider>

    )
}

export default Polls;
