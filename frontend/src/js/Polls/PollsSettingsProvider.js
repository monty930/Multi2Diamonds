import React, { createContext, useContext, useState } from 'react';

const PollsSettingsContext = createContext();

export function usePollsSettingsProvider() {
    return useContext(PollsSettingsContext);
}

export const PollsProvider = ({ children }) => {
    const [numberOfDeals, setNumberOfDeals] = useState(30);
    const [constraint , setConstraint] = useState("NoConstraint");
    const [bidding , setBidding] = useState("");
    const [keyBinds , setKeyBinds] = useState("");

    const value = {
        numberOfDeals,
        setNumberOfDeals,
        bidding,
        setBidding,
        keyBinds,
        setKeyBinds,
        constraint,
        setConstraint
    };

    return <PollsSettingsContext.Provider value={value}>{children}</PollsSettingsContext.Provider>;
};
