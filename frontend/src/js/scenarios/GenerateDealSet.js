import React, {useEffect, useState} from 'react';
import {useScenario} from './CompilerSettings';
import {addDealToDsi, removeDealFromDsi, replaceOneDeal} from "./DealHelper";
import SaveDialog from "./SaveDialogWindow";

function GenerateDealSet() {
    const [dealSet, setDealSet] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentDealNo, setCurrentDealNo] = useState(parseInt(sessionStorage.getItem('currentDealNo') || '0'));
    const { vul, dealer, numberOfDeals } = useScenario();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const checkForDealSet = () => {
            const storedDealSet = sessionStorage.getItem('generatedDealSet');
            if (storedDealSet) {
                setDealSet(JSON.parse(storedDealSet));
            }
        };

        checkForDealSet();

        // Event listener to clear sessionStorage when the page is fully reloaded
        const handleBeforeUnload = () => {
            sessionStorage.removeItem('generatedDealSet');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
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
            setDealSet(data);
            sessionStorage.setItem('generatedDealSet', JSON.stringify(data));
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
        let currentDealSet = dealSet.scriptRawOutput;
        setDealSet({ scriptRawOutput: replaceOneDeal(currentDealSet, newDeal.scriptRawOutput, dealNo) });
    }

    const removeDeal = (dealNum) => () => {
        let currentDealSet = dealSet.scriptRawOutput;
        let newDealSet = removeDealFromDsi(currentDealSet, dealNum);
        setDealSet({ scriptRawOutput: newDealSet });
        let numOfDeals = parseInt(sessionStorage.getItem('NumOfDeals') || '0') - 1;
        sessionStorage.setItem('NumOfDeals', (numOfDeals).toString());
        if (numOfDeals === 0) {
            setDealSet(null);
        } else if (dealNum === numOfDeals + 1) {
            setCurrentDealNo(dealNum - 1);
        }
    }
    
    const addDeal = () => async () => {
        console.log('addDeal1');
        let newDeal = await getOneNewDeal();
        console.log('addDeal2');
        console.log('addDeal new: ', newDeal);
        let currentDealSet = dealSet.scriptRawOutput;
        let newDealSet = addDealToDsi(currentDealSet, newDeal.scriptRawOutput);
        setDealSet({ scriptRawOutput: newDealSet });
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
                {dealSet && (
                    <div>
                        <button onClick={() => setDealSet(null)}>Clear</button>
                        <button onClick={() => setIsDialogOpen(true)}>Save</button>
                        {currentDealNo >= 1 && <button onClick={regenerate(currentDealNo)}>Regenerate</button>}
                        {currentDealNo > 1 && <button onClick={previousDeal}>Previous</button>}
                        {currentDealNo < parseInt(sessionStorage.getItem('NumOfDeals') || '0')
                            ? <button onClick={nextDeal}>Next</button>
                            : <button onClick={addDeal()}>AddDeal</button>}
                        {currentDealNo >= 1 && <button onClick={removeDeal(currentDealNo)}>RemoveDeal</button>}
                        Deal num: {currentDealNo}
                        <pre style={{ overflow: 'auto', height: '400px' }}>{dealSet.scriptRawOutput}</pre>
                        <SaveDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} dsiString={dealSet.scriptRawOutput} />
                    </div>
                )}
                {!dealSet && <p>Press 'Generate' to generate</p>}
            </div>
        </div>
    );
}

export default GenerateDealSet;
