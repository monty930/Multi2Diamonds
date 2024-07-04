import React from 'react';
import '../../css/Polls/BindKeys.css';
import { usePollsSettingsProvider } from "./PollsSettingsProvider";

function BindKeys() {
    const { setKeyBinds } = usePollsSettingsProvider();

    const handleKeyBindsChange = (e) => {
        setKeyBinds(e.target.value);
    };

    return (
        <div className={"PollsGrid PollsGrid2 BindKeys"}>
            Bind keys
            <textarea
                className={"PollsTextarea BindKeysTextarea"}
                onChange={handleKeyBindsChange}
            ></textarea>
            Example: <br/>
            1 1H 2 2H 0 P
        </div>
    );
}

export default BindKeys;
