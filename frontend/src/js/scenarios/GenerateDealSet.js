import React, {useEffect, useState} from 'react';
import {useScenario} from './CompilerSettings';
import {replaceOneDeal} from "./DealHelper";

function GenerateDealSet() {
    const [dealSet, setDealSet] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentDealNo, setCurrentDealNo] = useState(parseInt(sessionStorage.getItem('currentDealNo') || '0'));
    const { vul, dealer, numberOfDeals } = useScenario();

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
        setCurrentDealNo((prev) => Math.min(prev + 1, parseInt(sessionStorage.getItem('NumOfDeals') || '0')));
    };

    const previousDeal = () => {
        setCurrentDealNo((prev) => Math.max(prev - 1, 0));
    };
    
    const regenerate = (dealNo) => async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5015/Scenarios/GenerateDeals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vul, dealer, numberOfDeals, dealNo }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            let currentDealSet = dealSet.scriptRawOutput;
            console.log('currentDealSet:', currentDealSet);
            let newDealSet = data.scriptRawOutput;
            setDealSet({ scriptRawOutput: replaceOneDeal(currentDealSet, newDealSet, dealNo) });
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
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
                        <button>SaveDealSet</button>
                        {currentDealNo >= 1 && <button onClick={regenerate(currentDealNo)}>Regenerate</button>}
                        {currentDealNo > 1 && <button onClick={previousDeal}>Previous</button>}
                        {currentDealNo < parseInt(sessionStorage.getItem('NumOfDeals') || '0')
                            ? <button onClick={nextDeal}>Next</button>
                            : <button>AddDeal</button>}
                        <button>RemoveDeal</button>
                        Deal num: {currentDealNo}
                        <pre style={{ overflow: 'auto', height: '400px' }}>{dealSet.scriptRawOutput}</pre>
                    </div>
                )}
                {!dealSet && <p>Press 'Generate' to generate</p>}
            </div>
        </div>
    );
}

export default GenerateDealSet;
