import React, { createContext, useContext, useState } from 'react';

const CompilerSettings = createContext();

export function useScenario() {
    return useContext(CompilerSettings);
}

export const ScenarioProvider = ({ children }) => {
    const [vul, setVul] = useState('Random');
    const [dealer, setDealer] = useState('Random');
    const [numberOfDeals, setNumberOfDeals] = useState(12);
    const [constraintsArray, setConstraintsArray] = useState([]);
    const [percentagesArray, setPercentagesArray] = useState([]);

    const value = {
        vul,
        setVul,
        dealer,
        setDealer,
        numberOfDeals,
        setNumberOfDeals,
        constraintsArray,
        setConstraintsArray,
        percentagesArray,
        setPercentagesArray
    };

    return <CompilerSettings.Provider value={value}>{children}</CompilerSettings.Provider>;
};
