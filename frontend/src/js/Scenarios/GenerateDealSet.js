import React, {useEffect, useState} from 'react';
import {useScenario} from './CompilerSettings';
import SaveDialog from "./SaveDialogWindow";
import Spinner from "../Common/Spinner";
import BiddingTable from "./DealView/BiddingTable.js";
import Hand from "./DealView/Hand.js";

import saveImage from '../../assets/save.png';
import downloadImage from '../../assets/download-1.png';
import add from '../../assets/plus.png';
import remove from '../../assets/trash.png';
import retry from '../../assets/retry.png';
import previous from '../../assets/arrow-back.png';
import next from '../../assets/arrow.png';

function GenerateDealSet({ getLongestWestSuitLength }) {
    const [dealSet, setDealSet] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentDealNo, setCurrentDealNo] = useState(parseInt(sessionStorage.getItem('currentDealNo') || '0'));
    const {vul, dealer, numberOfDeals, constraintsArray, percentagesArray} = useScenario();
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

    const getDealSet = async (numOfDeals) => {
        setIsLoading(true);
        let result = "";
        try {
            const settings = {
                Vul: vul,
                Dealer: dealer,
                NumberOfDeals: numOfDeals,
                ConstraintsNames: constraintsArray,
                Percentages: percentagesArray,
            };
            const response = await fetch('http://localhost:5015/Scenarios/GenerateDeals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            result = data.dealSet;
        } catch (error) {
            console.error('Failed to fetch:', error);
        } finally {
            setIsLoading(false);
        }
        return result;
    }

    const generateDealSet = async () => {
        let result = await getDealSet(numberOfDeals);
        setCurrentDealNo(0);
        setDealSet(result);
    };

    const nextDeal = () => {
        setCurrentDealNo(Math.min(currentDealNo + 1, numOfDeals()));
    };

    const previousDeal = () => {
        setCurrentDealNo(Math.max(1, currentDealNo - 1));
    };

    const getOneNewDeal = async () => {
        return await getDealSet(1);
    }

    const regenerate = () => async () => {
        let newDealSet = await getOneNewDeal();
        let newDeal = newDealSet.deals[0];
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
        let newDeal = newDealSet.deals[0];
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

    const getSuit = (hand, suit) => {
        let handCards = '';
        if (hand === 'north') {
            handCards = dealSet.deals[currentDealNo - 1].north;
        } else if (hand === 'east') {
            handCards = dealSet.deals[currentDealNo - 1].east;
        } else if (hand === 'south') {
            handCards = dealSet.deals[currentDealNo - 1].south;
        } else if (hand === 'west') {
            handCards = dealSet.deals[currentDealNo - 1].west;
        }
        let cards = handCards.split('.');
        let suitNo = suit === "spades" ? "0" : suit === "hearts" ? "1" : suit === "diamonds" ? "2" : "3";
        return cards[suitNo];
    }
    
    const saveDealSet = async () => {
        console.error('Saving deal set [not implemented]');
    }
    
    const getVul = () => {
        return dealSet.deals[currentDealNo - 1].vul;
    }
    
    const getDealer = () => {
        return dealSet.deals[currentDealNo - 1].dealer;
    }

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
                            Deal {currentDealNo} / {numOfDeals()}
                        </div>
                        <div className={"DealSetCellN2"}>
                            {Hand({ dealSet, hand: 'N', currentDealNo: currentDealNo })}
                        </div>
                        <div className={"DealSetCellN3"}></div>
                        <div className={"DealSetCellEW1"}>
                            {Hand({ dealSet, hand: 'W', currentDealNo: currentDealNo, longestSuitLength: getLongestWestSuitLength(dealSet, 'W', currentDealNo)})}
                        </div>
                        <div className={"DealSetCellEW2"}>
                            {BiddingTable({ currentDealNo, vul: getVul(), dealer: getDealer(), loading: isLoading })}
                        </div>
                        <div className={"DealSetCellEW3"}>
                            {Hand({ dealSet, hand: 'E', currentDealNo: currentDealNo })}
                        </div>
                        <div className={"DealSetCellS1"}>
                            <div className={"SaveButtonsContainer"}>
                                <div className={"DealSetEntryButtonsInnerContrainerPadding"}>
                                    <div className={"NavigateCellUpperRow"}>
                                        <div>
                                            <button
                                                className={"AnyButton RegenerateDealButton"}
                                                onClick={regenerate()}>
                                                <img src={retry} alt={"Regenerate"} className={"DealSetButtonImage RegenerateImage"}/>
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                className={"AnyButton RemoveDealButton RedButton"}
                                                onClick={removeDeal()}>
                                                <img src={remove} alt={"Remove"} className={"DealSetButtonImage RemoveImage"}/>
                                            </button>
                                        </div>
                                    </div>
                                    <div className={"NavigateCellLowerRowEntry"}>
                                        <div>
                                            <button
                                                className={"AnyButton SaveDealSetButton"}
                                                onClick={saveDealSet}>
                                                <img src={saveImage} alt={"Save"} className={"DealSetButtonImage SaveImage"}/>
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                className={"AnyButton DownloadButton"}
                                                onClick={() => setIsDialogOpen(true)}>
                                                <img src={downloadImage} alt={"Download"} className={"DealSetButtonImage DownloadImage"}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"DealSetCellS2"}>
                            {Hand({ dealSet, hand: 'S', currentDealNo: currentDealNo })}
                        </div>
                        <div className={"DealSetCellS3"}>
                            <div className={"NavigateCell"}>
                                <div className={"NavigateCellUpperRow"}></div>
                                <div className={"NavigateCellLowerRow"}>
                                    <div className={"PreviousButtonContrainer"}>
                                        {currentDealNo > 1 &&
                                            <button
                                                className={"AnyButton PreviousDealButton"}
                                                onClick={previousDeal}>
                                                <img src={previous} alt={"Previous"} className={"DealSetButtonImage PreviousImage"}/>
                                            </button>}
                                    </div>
                                    <div>
                                        {currentDealNo < numOfDeals()
                                            ? <button
                                                className={"AnyButton NextDealButton"} onClick={nextDeal}>
                                                <img src={next} alt={"Next"} className={"DealSetButtonImage NextImage"}/>
                                            </button>
                                            :
                                            <button
                                                className={"AnyButton AddDealButton"} onClick={addDeal()}>
                                                <img src={add} alt={"Add"} className={"DealSetButtonImage AddImage"}/>
                                            </button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {checkForDeals && currentDealNo === 0 && (
                    <div className={"EntryContainer"}>
                        <div className={"GenerateMessageAndSpinner"}>
                            {isLoading && <Spinner/>}
                            {!isLoading &&
                                <div>Press > too see the deal set.</div>
                            }
                        </div>
                        <div className={"DealSetEntryButtonsOuterContrainer"}>
                            <div className={"DealSetEntryButtonsOuterContrainer1"}>
                                <div className={"SaveButtonsContainerEntry"}>
                                    <div className={"DealSetEntryButtonsInnerContrainerPadding"}>
                                        <div className={"NavigateCellUpperRow"}></div>
                                        <div className={"NavigateCellLowerRowEntry"}>
                                            <div>
                                                <button
                                                    className={"AnyButton SaveDealSetButton"} onClick={saveDealSet}>
                                                    <img src={saveImage} alt={"Save"} className={"DealSetButtonImage SaveImage"}/>
                                                </button>
                                            </div>
                                            <div>
                                                <button
                                                    className={"AnyButton DownloadButton"} onClick={() => setIsDialogOpen(true)}>
                                                    <img src={downloadImage} alt={"Download"} className={"DealSetButtonImage DownloadImage"}/>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={"DealSetEntryButtonsOuterContrainer2"}>
                                <div className={"DealSetEntryButtonsInnerContrainer"}>
                                    <div className={"DealSetEntryButtonsInnerContrainerPadding DealSetEntryButtonsInnerContrainerPaddingRight"}>
                                        <div className={"NavigateCellUpperRow"}>
                                            <div className={"PreviousButtonContrainer"}>
                                                {currentDealNo > 1 &&
                                                    <button
                                                        className={"AnyButton PreviousDealButton"} onClick={previousDeal}>
                                                        <img src={previous} alt={"Previous"} className={"DealSetButtonImage PreviousImage"}/>
                                                    </button>}
                                            </div>
                                            <div></div>
                                        </div>
                                        <div className={"NavigateCellLowerRowEntry"}>
                                            <div></div>
                                            <div>
                                                <button
                                                    className={"AnyButton NextDealButton"} onClick={nextDeal}>
                                                    <img src={next} alt={"Next"} className={"DealSetButtonImage NextImage"}/>
                                                </button>
                                            </div>
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
            <SaveDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}
                        jsonDealSetString={JSON.stringify(dealSet)}/>
        </div>
    );
}

export default GenerateDealSet;
