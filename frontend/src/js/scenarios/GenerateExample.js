import React, { useState, useEffect } from 'react';

function GenerateExample() {
    const [example, setExample] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     const checkForExample = () => {
    //         const storedExample = sessionStorage.getItem('generatedExample');
    //         if (storedExample) {
    //             setExample(JSON.parse(storedExample));
    //         }
    //     };
    //
    //     checkForExample();
    //
    //     // Event listener to clear sessionStorage when the page is fully reloaded
    //     const handleBeforeUnload = (e) => {
    //         sessionStorage.removeItem('generatedExample'); // Data is cleared on full page reload
    //     };
    //
    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //
    //     return () => {
    //         window.removeEventListener('beforeunload', handleBeforeUnload);
    //     };
    // }, []);

    const generateExample = async () => {
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
            console.log(data);
            setExample(data.dealSet);
            // sessionStorage.setItem('generatedExample', JSON.stringify(data)); // Temporarily store the example
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={generateExample} disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate'}
            </button>
            {example ? (
                <div className="DealSetContainer">
                    <pre>{addEndls(JSON.stringify(example))}</pre>
                </div>
            ) : (
                <p>Press 'Generate' to generate</p>
            )}
        </div>
    );
}

// TODO delete this
// function to add endls in stringified JSON before each '{'
function addEndls(jsonString) {
    return jsonString.replace(/({)/g, '\n$1');
}

export default GenerateExample;
