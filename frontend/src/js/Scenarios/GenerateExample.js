import React, { useState, useEffect } from 'react';

function GenerateExample() {
    const [example, setExample] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
