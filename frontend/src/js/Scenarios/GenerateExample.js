import React, {useState, useEffect} from 'react';
import Spinner from "../Common/Spinner";
import BiddingTable from "./DealView/BiddingTable.js";
import Hand from "./DealView/Hand";

function GenerateExample() {
    const [dealSet, setExample] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getVul = () => {
        return dealSet.deals[0].vul;
    }

    const getDealer = () => {
        return dealSet.deals[0].dealer;
    }

    const generateExample = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5015/Scenarios/GenerateDeals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ /* compilerSettings object structure here */}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setExample(data.dealSet);
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={"RightSideDealOuter"}>
            <div className={"RightSideDealGenerateButtonContainer"}>
                <button
                    className={"AnyButton GenerateDealSetButton"}
                    onClick={generateExample} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
                <div></div>
            </div>
            <div className={"RightSideDealSetContainer"}>
                {dealSet ? (
                    <div className={"ProperDealSet"}>
                        <div className={"DealSetCellN1"}></div>
                        <div className={"DealSetCellN2"}>
                            {Hand({dealSet, hand: 'N', currentDealNo: 1})}
                        </div>
                        <div className={"DealSetCellN3"}></div>
                        <div className={"DealSetCellEW1"}>
                            {Hand({dealSet, hand: 'W', currentDealNo: 1})}
                        </div>
                        <div className={"DealSetCellEW2"}>
                            {BiddingTable({currentDealNo: 1, vul: getVul(), dealer: getDealer(), loading: isLoading})}
                        </div>
                        <div className={"DealSetCellEW3"}>
                            {Hand({dealSet, hand: 'E', currentDealNo: 1})}
                        </div>
                        <div className={"DealSetCellS1"}>
                            <div className={"SaveButtonsContainer"}>
                                <div className={"DealSetEntryButtonsInnerContrainerPadding"}>
                                    <div className={"NavigateCellUpperRow"}></div>
                                    <div className={"NavigateCellLowerRowEntry"}></div>
                                </div>
                            </div>
                        </div>
                        <div className={"DealSetCellS2"}>
                            {Hand({dealSet, hand: 'S', currentDealNo: 1})}
                        </div>
                        <div className={"DealSetCellS3"}>
                            <div className={"NavigateCell"}>
                                <div className={"NavigateCellUpperRow"}></div>
                                <div className={"NavigateCellLowerRow"}></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={"GenerateMessageAndSpinner GenerateMessageAndSpinnerExample"}>
                        {isLoading && <Spinner/>}
                        {!isLoading &&
                            <div>Press 'Generate' to generate</div>
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

// TODO delete this
// function to add endls in stringified JSON before each '{'
function addEndls(jsonString) {
    return jsonString.replace(/({)/g, '\n$1');
}

export default GenerateExample;
