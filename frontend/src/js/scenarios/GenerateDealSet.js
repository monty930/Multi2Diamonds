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
                setDealSetRaw(response.dealSetRaw);
                // setDealSet({ scriptRawOutput: response.dealSet });
                sessionStorage.removeItem('savedDealSetId');
            }
        }
        checkForSaved().then();
    }, []);

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
            setDealSetRaw(data.scriptOutputRaw);
            setDealSet(data.dealSet);
            setCurrentDealNo(0); // Reset current deal number on new generation
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const nextDeal = () => {
        setCurrentDealNo(Math.min(currentDealNo + 1, numOfDeals()));
    };

    const previousDeal = () => {
        setCurrentDealNo(Math.max(1, currentDealNo - 1));
    };
    
    const getOneNewDeal = async () => {
        setIsLoading(true);
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

    const regenerate = () => async () => {
        let newDealSet = await getOneNewDeal();
        let newDeal = newDealSet.dealSet.deals[0];
        let oldDealSet = dealSet;
        oldDealSet.deals[currentDealNo - 1] = newDeal;
        setDealSet(oldDealSet);
    }

    const removeDeal = (dealNum) => () => {
        // let newDealSet = removeDealFromDsi(dealSetRaw, dealNum);
        // setDealSet({ scriptRawOutput: newDealSet });
        // let numOfDeals = parseInt(sessionStorage.getItem('NumOfDeals') || '0') - 1;
        // sessionStorage.setItem('NumOfDeals', (numOfDeals).toString());
        // if (numOfDeals === 0) {
        //     setDealSetRaw(null);
        // } else if (dealNum === numOfDeals + 1) {
        //     setCurrentDealNo(dealNum - 1);
        // }
    }
    
    const addDeal = () => async () => {
        // let newDeal = await getOneNewDeal();
        // let newDealSet = addDealToDsi(dealSetRaw, newDeal.scriptRawOutput);
        // setDealSetRaw(newDealSet);
        // let numOfDeals = parseInt(sessionStorage.getItem('NumOfDeals') || '0') + 1;
        // sessionStorage.setItem('NumOfDeals', (numOfDeals).toString());
        // setCurrentDealNo(currentDealNo + 1);
    }
    
    const clearData = () => {
        setDealSetRaw(null);
        setDealSet(null);
    }
    
    const numOfDeals = () => {
        return dealSet.deals.length;
    }

    return (
        <div>
            <button onClick={generateDealSet} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate'}
            </button>
            <div>
                {dealSet && (
                    <div>
                        <button onClick={clearData}>Clear</button>
                        <button onClick={() => setIsDialogOpen(true)}>Save</button>
                        {currentDealNo >= 1 && <button onClick={regenerate}>Regenerate</button>}
                        {currentDealNo > 1 && <button onClick={previousDeal}>Previous</button>}
                        {currentDealNo < numOfDeals()
                            ? <button onClick={nextDeal}>Next</button>
                            : <button onClick={addDeal()}>AddDeal</button>}
                        {currentDealNo >= 1 && <button onClick={removeDeal(currentDealNo)}>RemoveDeal</button>}
                        Deal num: {currentDealNo}
                        <div className="DealSetContainer">
                            <pre style={{ overflow: 'auto', height: '400px' }}>{JSON.stringify(dealSet)}</pre>
                        </div>
                        <SaveDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} dsiString={dealSetRaw} />
                    </div>
                )}
                {!dealSet && <p>Press 'Generate' to generate</p>}
            </div>
        </div>
    );
}

export default GenerateDealSet;
