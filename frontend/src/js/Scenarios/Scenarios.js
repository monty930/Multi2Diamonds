import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MakeScenarios from './MakeScenarios';
import GenerateExample from './GenerateExample';
import UseScenarios from './UseScenarios';

function Scenarios() {
    const [dealSettings, setDealSettings] = useState({
        NumberOfDeals: 1,
        Vul: 'None',
        Scoring: 'None',
        Flip: 'None',
        Dealer: 'None',
    });

    const [scenarioContent, setScenarioContent] = useState('');
    const location = useLocation();
    const pageLayoutRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [leftWidthRatio, setLeftWidthRatio] = useState(0.5);
    let dividerWidth = 8;

    const minWidth = 400;

    const getLongestWestSuitLength = (dealSet, hand, currentDealNo) => {
        let longestSuitLength = 0;
        const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
        const handCards = dealSet.deals[currentDealNo - 1].west;
        const cards = handCards.split('.');
        for (let i = 0; i < suits.length; i++) {
            if (cards[i].length > longestSuitLength) {
                longestSuitLength = cards[i].length;
            }
        }
        return longestSuitLength;
    }

    useEffect(() => {
        function updatePanelWidths() {
            if (!pageLayoutRef.current) return;

            const pageLayoutRect = pageLayoutRef.current.getBoundingClientRect();
            const totalWidth = pageLayoutRect.width;

            if (window.innerWidth <= 2 * minWidth + dividerWidth) {
                pageLayoutRef.current.style.gridTemplateColumns = `1fr ${dividerWidth}px 1fr`;
                return;
            }

            let leftWidth = totalWidth * leftWidthRatio - dividerWidth / 2;
            let rightWidth = totalWidth - leftWidth - dividerWidth / 2;

            if (leftWidth < minWidth) {
                leftWidth = minWidth;
                rightWidth = totalWidth - leftWidth - dividerWidth / 2;
            } else if (rightWidth < minWidth) {
                rightWidth = minWidth;
                leftWidth = totalWidth - rightWidth - dividerWidth / 2;
            }

            pageLayoutRef.current.style.gridTemplateColumns = `${leftWidth}px ${dividerWidth}px ${rightWidth}px`;
        }

        function handleMouseMove(e) {
            if (!isDragging || window.innerWidth <= 800) return;

            const pageLayoutRect = pageLayoutRef.current.getBoundingClientRect();
            let newLeftWidth = e.clientX - pageLayoutRect.left - dividerWidth / 2;
            let newRightWidth = pageLayoutRect.width - newLeftWidth - dividerWidth;

            const totalWidth = pageLayoutRect.width;
            let newLeftWidthRatio = newLeftWidth / totalWidth;

            if (newLeftWidth >= minWidth && newRightWidth >= minWidth) {
                setLeftWidthRatio(newLeftWidthRatio);
            }
        }

        function handleMouseUp() {
            setIsDragging(false);
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('resize', updatePanelWidths);

        updatePanelWidths();

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('resize', updatePanelWidths);
        };
    }, [isDragging, leftWidthRatio]);

    let content;
    if (location.pathname === "/scenarios/make") {
        content = (
            <div className="ScenariosPage" ref={pageLayoutRef}>
                <div className="MakeScenariosOuter">
                    <MakeScenarios scenarioContent={scenarioContent} setScenarioContent={setScenarioContent} />
                </div>
                <div className="Divider" onMouseDown={() => setIsDragging(true)}></div>
                <div className="GenerateExampleOuter">
                    <GenerateExample scenarioContent={scenarioContent} getLongestWestSuitLength={getLongestWestSuitLength} />
                </div>
            </div>
        );
    } else if (location.pathname === "/scenarios/use") {
        content = <UseScenarios setIsDragging={setIsDragging} getLongestWestSuitLength={getLongestWestSuitLength} />;
    } else {
        content = <div>ERROR!</div>
    }

    return content;
}

export default Scenarios;
