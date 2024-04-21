import React, {useEffect, useState} from 'react';
import {useScenario} from './CompilerSettings';
import SaveDialog from "./SaveDialogWindow";
import Spinner from "../Spinner";

function GenerateDealSet() {
    const [dealSet, setDealSet] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentDealNo, setCurrentDealNo] = useState(parseInt(sessionStorage.getItem('currentDealNo') || '0'));
    const {vul, dealer, numberOfDeals} = useScenario();
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
                setDealSet(response.dealSet);
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
                body: JSON.stringify({vul, dealer, numberOfDeals}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            // setDealSetRaw(data.scriptOutputRaw);
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
                body: JSON.stringify({vul, dealer, numberOfDeals: 1}),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            let responseJson = await response.json();
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
        let updatedDeals = dealSet.deals.map((deal, index) =>
            index === currentDealNo - 1 ? newDeal : deal
        );
        setDealSet({...dealSet, deals: updatedDeals});
    }

    const removeDeal = () => () => {
        let newDealSet = {...dealSet, deals: [...dealSet.deals]};
        newDealSet.deals.splice(currentDealNo - 1, 1);
        setDealSet(newDealSet);
        setCurrentDealNo(Math.min(currentDealNo, newDealSet.deals.length));

    }

    const addDeal = () => async () => {
        let newDealSet = await getOneNewDeal();
        let newDeal = newDealSet.dealSet.deals[0];
        let updatedDeals = [...dealSet.deals, newDeal];
        setDealSet({...dealSet, deals: updatedDeals});
        setCurrentDealNo(updatedDeals.length);
    }


    const clearData = () => {
        setDealSet(null);
    }

    const numOfDeals = () => {
        return dealSet.deals.length;
    }

    const checkForDeals = dealSet && dealSet.deals.length > 0;

    return (
        <div className={"RightSideDealOuter"}>
            <div className={"RightSideDealGenerateButtonContainer"}>
                <button
                    className={"AnyButton GenerateDealSetButton"}
                    onClick={generateDealSet} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate'}
                </button>
                <div>
                    {checkForDeals &&
                        <button
                            className={"AnyButton ClearDealSetButton"}
                            onClick={clearData}>
                            Clear
                        </button>}
                </div>
            </div>
            <div className={"RightSideDealSetContainer"}>
                {checkForDeals && currentDealNo > 0 && (
                    <div className={"ProperDealSet"}>
                        <div className={"DealSetCellN1"}>

                        </div>
                        <div className={"DealSetCellN2"}>

                        </div>
                        <div className={"DealSetCellN3"}>

                        </div>
                        <div className={"DealSetCellEW1"}>

                        </div>
                        <div className={"DealSetCellEW2"}>
                            <div className={"BiddingTable"}>
                                <div className={"BiddingTableCell BiddingTableCellN1"}>

                                </div>
                                <div className={"BiddingTableCell BiddingTableCellN2"}>
                                    N
                                </div>
                                <div className={"BiddingTableCell BiddingTableCellN3"}>

                                </div>
                                <div className={"BiddingTableCell BiddingTableCellEW1"}>
                                    W
                                </div>
                                <div className={"BiddingTableCell BiddingTableCellEW2"}>
                                    {currentDealNo}
                                </div>
                                <div className={"BiddingTableCell BiddingTableCellEW3"}>
                                    E
                                </div>
                                <div className={"BiddingTableCell BiddingTableCellS1"}>

                                </div>
                                <div className={"BiddingTableCell BiddingTableCellS2"}>
                                    S
                                </div>
                                <div className={"BiddingTableCell BiddingTableCellS3"}>

                                </div>
                            </div>
                        </div>
                        <div className={"DealSetCellEW3"}>

                        </div>
                        <div className={"DealSetCellS1"}>

                        </div>
                        <div className={"DealSetCellS2"}>

                        </div>
                        <div className={"DealSetCellS3"}>
                            <div className={"NavigateCell"}>
                                <div className={"NavigateCellUpperRow"}>
                                    <div className={"PreviousButtonContrainer"}>
                                        {currentDealNo > 1 &&
                                            <button
                                                className={"AnyButton PreviousDealButton"}
                                                onClick={previousDeal}>
                                                p
                                            </button>}
                                    </div>
                                    <div>
                                        {currentDealNo < numOfDeals()
                                            ? <button
                                                className={"AnyButton NextDealButton"}
                                                onClick={nextDeal}>n
                                            </button>
                                            :
                                            <button
                                                className={"AnyButton AddDealButton"}
                                                onClick={addDeal()}>+
                                            </button>}
                                    </div>
                                </div>
                                <div className={"NavigateCellLowerRow"}>
                                    <div>
                                        <button
                                            className={"AnyButton RemoveDealButton"}
                                            onClick={removeDeal()}>
                                            X
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className={"AnyButton RegenerateDealButton"}
                                            onClick={regenerate()}>
                                            r
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            className={"AnyButton SaveDealSetButton"}
                                            onClick={() => setIsDialogOpen(true)}>
                                            s
                                        </button>
                                    </div>
                                </div>
                                {/*<div className="DealSetContainer">*/}
                                {/*    <pre style={{overflow: 'auto', height: '400px'}}>{addEndls(JSON.stringify(dealSet))}</pre>*/}
                                {/*</div>*/}
                            </div>
                            <SaveDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}
                                        jsonDealSetString={JSON.stringify(dealSet)}/>
                        </div>
                    </div>
                )}
                {checkForDeals && currentDealNo === 0 && (
                    <div className={"EntryContainer"}>
                        <div className={"GenerateMessageAndSpinner EntryMessage"}>
                            Press > to see the deals.
                        </div>
                        <div className={"DealSetEntryButtonsOuterContrainer"}>
                            <div className={"DealSetEntryButtonsInnerContrainer"}>
                                <div className={"DealSetEntryButtonsInnerContrainerPadding"}>
                                <div className={"NavigateCellUpperRow"}>
                                    <div className={"PreviousButtonContrainer"}>
                                        {currentDealNo > 1 &&
                                            <button
                                                className={"AnyButton PreviousDealButton"}
                                                onClick={previousDeal}>
                                                p
                                            </button>}
                                    </div>
                                    <div>
                                        {currentDealNo < numOfDeals()
                                            ? <button
                                                className={"AnyButton NextDealButton"}
                                                onClick={nextDeal}>n
                                            </button>
                                            :
                                            <button
                                                className={"AnyButton AddDealButton"}
                                                onClick={addDeal()}>+
                                            </button>}
                                    </div>
                                </div>
                                <div className={"NavigateCellLowerRowEntry"}>
                                    <div></div>
                                    <div>
                                        <button
                                            className={"AnyButton SaveDealSetButton"}
                                            onClick={() => setIsDialogOpen(true)}>
                                            s
                                        </button>
                                    </div>
                                </div>
                                </div>
                            </div>    
                        </div>
                    </div>
                )}
                {!checkForDeals &&
                    <div className={"GenerateMessageAndSpinner"}>
                        {isLoading && <Spinner/>}
                        {!isLoading &&
                            <div>Press 'Generate' to generate</div>
                        }
                    </div>}
            </div>
        </div>
    );
}

// TODO delete this
// function to add endls in stringified JSON before each '{'
function addEndls(jsonString) {
    return jsonString.replace(/({)/g, '\n$1');
}

export default GenerateDealSet;
