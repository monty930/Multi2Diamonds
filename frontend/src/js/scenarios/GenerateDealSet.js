import React, { useState, useEffect } from 'react';

function GenerateDealSet() {
    const [dealSet, setDealSet] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkForDealSet = () => {
            const storedDealSet = sessionStorage.getItem('generatedDealSet');
            if (storedDealSet) {
                setDealSet(JSON.parse(storedDealSet));
            }
        };

        checkForDealSet();

        // Event listener to clear sessionStorage when the page is fully reloaded
        const handleBeforeUnload = (e) => {
            sessionStorage.removeItem('generatedDealSet'); // Data is cleared on full page reload
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const generateDealSet = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5015/Scenarios/GenerateDeals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ /* compilerSettings object structure here */ }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setDealSet(data);
            sessionStorage.setItem('generatedDealSet', JSON.stringify(data)); // Temporarily store the dealSet
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={generateDealSet} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate'}
            </button>
            {dealSet ? (
                <pre>{dealSet.scriptRawOutput}</pre>
            ) : (
                <p>Press 'Generate' to generate</p>
            )}
        </div>
    );
}

export default GenerateDealSet;
