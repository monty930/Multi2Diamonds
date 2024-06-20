import React from "react";

function Hand({dealSet, hand, currentDealNo, longestSuitLength = 3}) {
    // hand is 'N', 'E', 'S', or 'W'
    const getSuit = (suit) => {
        let handCards = '';
        if (hand === 'N') {
            handCards = dealSet.deals[currentDealNo - 1].north;
        } else if (hand === 'E') {
            handCards = dealSet.deals[currentDealNo - 1].east;
        } else if (hand === 'S') {
            handCards = dealSet.deals[currentDealNo - 1].south;
        } else if (hand === 'W') {
            handCards = dealSet.deals[currentDealNo - 1].west;
        }
        const cards = handCards.split('.');
        const suitNo = suit === "spades" ? "0" : suit === "hearts" ? "1" : suit === "diamonds" ? "2" : "3";
        return cards[suitNo];
    }

    const handClass = `Hand Hand${hand}`;

    // Unique padding applies only to the West hand
    const padding = 2.8 > longestSuitLength * 0.49 ? 2.8 : longestSuitLength * 0.49;
    const handStyle = hand === 'W' ? {paddingRight: `calc(var(--main-padding-w) + ${padding} * var(--cards-line-height))`} : {};

    return (
        <div className={handClass} style={handStyle}>
            <div className="Suit">
                <div className="SuitImageContainer SpadeChar">
                    &#9824;
                </div>
                <div className="CardContainer">
                    {getSuit('spades')}
                </div>
            </div>
            <div className="Suit">
                <div className="SuitImageContainer HeartChar">
                    &#9829;
                </div>
                <div className="CardContainer">
                    {getSuit('hearts')}
                </div>
            </div>
            <div className="Suit">
                <div className="SuitImageContainer DiamondChar">
                    &#9830;
                </div>
                <div className="CardContainer">
                    {getSuit('diamonds')}
                </div>
            </div>
            <div className="Suit">
                <div className="SuitImageContainer ClubChar">
                    &#9827;
                </div>
                <div className="CardContainer">
                    {getSuit('clubs')}
                </div>
            </div>
        </div>
    );
}

export default Hand;
