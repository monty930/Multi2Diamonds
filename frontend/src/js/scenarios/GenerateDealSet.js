import React, {useEffect, useState} from 'react';
import {useScenario} from './CompilerSettings';
import SaveDialog from "./SaveDialogWindow";
import Spinner from "../Spinner";

import saveImage from '../../assets/save.png';
import downloadImage from '../../assets/download-1.png';
import add from '../../assets/plus.png';
import remove from '../../assets/trash.png';
import trash_open from '../../assets/trash_open.png';
import retry from '../../assets/retry.png';
import previous from '../../assets/arrow-back.png';
import next from '../../assets/arrow.png';

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
        console.log('Saving deal set');
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
                            <div className={"Hand HandN"}>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer SpadeChar"}>
                                        &#9824;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('north', 'spades')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer HeartChar"}>
                                        &#9829;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('north', 'hearts')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer DiamondChar"}>
                                        &#9830;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('north', 'diamonds')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer ClubChar"}>
                                        &#9827;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('north', 'clubs')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"DealSetCellN3"}>

                        </div>
                        <div className={"DealSetCellEW1"}>
                            <div className={"Hand HandW"} id={"HandW"}>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer SpadeChar"}>
                                        &#9824;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('west', 'spades')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer HeartChar"}>
                                        &#9829;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('west', 'hearts')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer DiamondChar"}>
                                        &#9830;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('west', 'diamonds')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer ClubChar"}>
                                        &#9827;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('west', 'clubs')}
                                    </div>
                                </div>
                            </div>
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
                            <div className={"Hand HandE"}>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer SpadeChar"}>
                                        &#9824;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('east', 'spades')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer HeartChar"}>
                                        &#9829;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('east', 'hearts')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer DiamondChar"}>
                                        &#9830;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('east', 'diamonds')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer ClubChar"}>
                                        &#9827;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('east', 'clubs')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"DealSetCellS1"}>
                            <div className={"SaveButtonsContainer"}>
                                <div className={"DealSetEntryButtonsInnerContrainerPadding"}>
                                    <div className={"NavigateCellUpperRow"}></div>
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
                            <div className={"Hand HandS"}>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer SpadeChar"}>
                                        &#9824;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('south', 'spades')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer HeartChar"}>
                                        &#9829;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('south', 'hearts')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer DiamondChar"}>
                                        &#9830;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('south', 'diamonds')}
                                    </div>
                                </div>
                                <div className={"Suit"}>
                                    <div className={"SuitImageContainer ClubChar"}>
                                        &#9827;
                                    </div>
                                    <div className={"CardContainer"}>
                                        {getSuit('south', 'clubs')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"DealSetCellS3"}>
                            <div className={"NavigateCell"}>
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
                                                className={"AnyButton NextDealButton"}
                                                onClick={nextDeal}>
                                                <img src={next} alt={"Next"} className={"DealSetButtonImage NextImage"}/>
                                            </button>
                                            :
                                            <button
                                                className={"AnyButton AddDealButton"}
                                                onClick={addDeal()}>
                                                <img src={add} alt={"Add"} className={"DealSetButtonImage AddImage"}/>
                                            </button>}
                                    </div>
                                </div>
                                {/*<div className="DealSetContainer">*/}
                                {/*    <pre style={{overflow: 'auto', height: '400px'}}>{addEndls(JSON.stringify(dealSet))}</pre>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                )}
                {checkForDeals && currentDealNo === 0 && (
                    <div className={"EntryContainer"}>
                        <div className={"GenerateMessageAndSpinner EntryMessage"}>
                            Press > to see the deals.
                        </div>
                        <div className={"DealSetEntryButtonsOuterContrainer"}>
                            <div className={"DealSetEntryButtonsOuterContrainer1"}>
                                <div className={"SaveButtonsContainerEntry"}>
                                    <div className={"DealSetEntryButtonsInnerContrainerPadding"}>
                                        <div className={"NavigateCellUpperRow"}></div>
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
                            <div className={"DealSetEntryButtonsOuterContrainer2"}>
                                <div className={"DealSetEntryButtonsInnerContrainer"}>
                                    <div className={"DealSetEntryButtonsInnerContrainerPadding DealSetEntryButtonsInnerContrainerPaddingRight"}>
                                        <div className={"NavigateCellUpperRow"}>
                                            <div className={"PreviousButtonContrainer"}>
                                                {currentDealNo > 1 &&
                                                    <button
                                                        className={"AnyButton PreviousDealButton"}
                                                        onClick={previousDeal}>
                                                        <img src={previous} alt={"Previous"} className={"DealSetButtonImage PreviousImage"}/>
                                                    </button>}
                                            </div>
                                            <div></div>
                                        </div>
                                        <div className={"NavigateCellLowerRowEntry"}>
                                            <div></div>
                                            <div>
                                                <button
                                                    className={"AnyButton NextDealButton"}
                                                    onClick={nextDeal}>
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

// TODO delete this
// function to add endls in stringified JSON before each '{'
function addEndls(jsonString) {
    return jsonString.replace(/({)/g, '\n$1');
}

export default GenerateDealSet;
