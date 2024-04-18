import React, {useEffect, useState} from 'react';
import {useScenario} from './CompilerSettings';
import {addDealToDsi, removeDealFromDsi, replaceOneDeal} from "./DealHelper";
import SaveDialog from "./SaveDialogWindow";

function GenerateDealSet() {
    const [dealSet, setDealSet] = useState(null);
    const [dealSetRaw, setDealSetRaw] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentDealNo, setCurrentDealNo] = useState(parseInt(sessionStorage.getItem('currentDealNo') || '0'));
    const { vul, dealer, numberOfDeals } = useScenario();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchDealSetDetails = async (dealSetId) => {
        try {
            const response = await fetch(`http://localhost:5015/Scenarios/GetDealSetDetails?dealSetId=${dealSetId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch:', error);
        }
    }
    
    useEffect(() => {
        const checkForSaved = async () => {
            // Check for deal set got from the saved data
            const savedDealSetId = sessionStorage.getItem('savedDealSetId');
            if (savedDealSetId) {
                let response = await fetchDealSetDetails(savedDealSetId);
                console.log('response: ', response.dealSet);
                setdealSetRaw({ scriptRawOutput: response.dealSetRaw });
                setDealSet({ scriptRawOutput: response.dealSet });
                sessionStorage.removeItem('savedDealSetId');
            }
        }
        checkForSaved().then();
        
        // const storedDealSet = sessionStorage.getItem('generatedDealSet');
        // if (storedDealSet) {
        //     setDealSet(JSON.parse(storedDealSet));
        // }
    }, []);

    useEffect(() => {
        // Sync the currentDealNo with sessionStorage whenever it changes
        sessionStorage.setItem('currentDealNo', currentDealNo.toString());
    }, [currentDealNo]);

    const generateDealSet = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5015/Scenarios/GenerateDeals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vul, dealer, numberOfDeals }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setDealSetRaw(data);
            // sessionStorage.setItem('generatedDealSet', JSON.stringify(data));
            sessionStorage.setItem('NumOfDeals', numberOfDeals.toString());
            setCurrentDealNo(0); // Reset current deal number on new generation
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const nextDeal = () => {
        console.log('nextDeal');
        setCurrentDealNo((prev) => Math.min(prev + 1, parseInt(sessionStorage.getItem('NumOfDeals') || '0')));
    };

    const previousDeal = () => {
        setCurrentDealNo((prev) => Math.max(prev - 1, 0));
    };
    
    const getOneNewDeal = async () => {
        setIsLoading(true);
        console.log('getOneNewDeal');
        try {
            const response = await fetch('http://localhost:5015/Scenarios/GenerateDeals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vul, dealer, numberOfDeals: 1 }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            let responseJson = await response.json();
            console.log('responseJson', responseJson);
            return await responseJson;
        } catch (error) {
            console.error('Failed to fetch:', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }
    
    const regenerate = (dealNo) => async () => {
        let newDeal = await getOneNewDeal();
        let currentDealSet = dealSetRaw.scriptRawOutput;
        setDealSetRaw({ scriptRawOutput: replaceOneDeal(currentDealSet, newDeal.scriptRawOutput, dealNo) });
    }

    const removeDeal = (dealNum) => () => {
        let currentDealSet = dealSetRaw.scriptRawOutput;
        let newDealSet = removeDealFromDsi(currentDealSet, dealNum);
        setDealSet({ scriptRawOutput: newDealSet });
        let numOfDeals = parseInt(sessionStorage.getItem('NumOfDeals') || '0') - 1;
        sessionStorage.setItem('NumOfDeals', (numOfDeals).toString());
        if (numOfDeals === 0) {
            setDealSetRaw(null);
        } else if (dealNum === numOfDeals + 1) {
            setCurrentDealNo(dealNum - 1);
        }
    }
    
    const addDeal = () => async () => {
        console.log('addDeal1');
        let newDeal = await getOneNewDeal();
        console.log('addDeal2');
        console.log('addDeal new: ', newDeal);
        let currentDealSet = dealSetRaw.scriptRawOutput;
        let newDealSet = addDealToDsi(currentDealSet, newDeal.scriptRawOutput);
        setDealSetRaw({ scriptRawOutput: newDealSet });
        let numOfDeals = parseInt(sessionStorage.getItem('NumOfDeals') || '0') + 1;
        sessionStorage.setItem('NumOfDeals', (numOfDeals).toString());
        console.log('addDeal3 ', newDealSet);
        setCurrentDealNo(numOfDeals);
    }

    return (
        <div>
            <button onClick={generateDealSet} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate'}
            </button>
            <div>
                {dealSetRaw && (
                    <div>
                        <button onClick={() => setDealSetRaw(null)}>Clear</button>
                        <button onClick={() => setIsDialogOpen(true)}>Save</button>
                        {currentDealNo >= 1 && <button onClick={regenerate(currentDealNo)}>Regenerate</button>}
                        {currentDealNo > 1 && <button onClick={previousDeal}>Previous</button>}
                        {currentDealNo < parseInt(sessionStorage.getItem('NumOfDeals') || '0')
                            ? <button onClick={nextDeal}>Next</button>
                            : <button onClick={addDeal()}>AddDeal</button>}
                        {currentDealNo >= 1 && <button onClick={removeDeal(currentDealNo)}>RemoveDeal</button>}
                        Deal num: {currentDealNo}
                        <pre style={{ overflow: 'auto', height: '400px' }}>{dealSetRaw.scriptRawOutput}</pre>
                        <SaveDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} dsiString={dealSet.scriptRawOutput} />
                    </div>
                )}
                {!dealSetRaw && <p>Press 'Generate' to generate</p>}
            </div>
        </div>
    );
}

export default GenerateDealSet;
