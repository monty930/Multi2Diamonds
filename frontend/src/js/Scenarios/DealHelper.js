export const updateVul = (dsiString) => {
    let vul = dsiString.split('Vulnerability: ')[1].split('\n')[0];
    if (vul !== "Matching") {
        return dsiString;
    }
    let deals = dsiString.split('[Vulnerable \"');
    for (let i = 1; i < deals.length; i++) {
        let deal = deals[i];
        let deal_div = deal.split('\"');
        let new_vul = "None";
        if (i % 16 === 2 || i % 16 === 4 || i % 16 === 5 || i % 16 === 7 ||
            i % 16 === 10 || i % 16 === 12 || i % 16 === 13 || i % 16 === 15) {
            new_vul = "NS";
        }
        if (i % 16 === 3 || i % 16 === 4 || i % 16 === 6 || i % 16 === 7 ||
            i % 16 === 9 || i % 16 === 10 || i % 16 === 13 || i % 16 === 16) {
            if (new_vul === "NS") {
                new_vul = "All";
            } else {
                new_vul = "EW";
            }
        }
        deal_div[0] = new_vul;
        deals[i] = deal_div.join('\"');
    }
    return deals.join('[Vulnerable \"');
};

export const extractDeal = (dsiString, dealNum) => {
    const deals = dsiString.split('\n\n');
    return deals[dealNum].trim();
};

const extractSuit = (deal, handType, suitType) => {
    deal = deal.split("[Deal \"N:")[1].split("\"]")[0];
    const hands = deal.split(" ");

    const handIndex = {
        "hand-north": 0,
        "hand-east": 1,
        "hand-south": 2,
        "hand-west": 3
    };

    const suitIndex = {
        "suit-spades": 0,
        "suit-hearts": 1,
        "suit-diamonds": 2,
        "suit-clubs": 3
    };

    const hand = hands[handIndex[handType]];
    const suits = hand.split(".");
    return suits[suitIndex[suitType]];
}

export const renumerateDeals = (dsiString) => {
    let deals = dsiString.split('[Board \"');
    for (let i = 1; i < deals.length; i++) {
        let deal = deals[i];
        let deal_div = deal.split('\"');
        deal_div[0] = i.toString();
        deals[i] = deal_div.join('\"');
    }
    return updateVul(deals.join('[Board \"'));
};

export const replaceOneDeal = (dsiString, newDealDsiString, dealNum) => {
    let dealToReplace = extractDeal(dsiString, dealNum);
    let deals = dsiString.split(dealToReplace);
    let newDeal = extractDeal(newDealDsiString, 1);
    deals.push(deals[1]);
    deals[1] = newDeal;
    let withReplacedDeal = deals.join('');
    withReplacedDeal = renumerateDeals(withReplacedDeal);
    return withReplacedDeal;
};

export const addDealToDsi = (dsiString, newDealDsiString) => {
    let deals = dsiString.split('\n\n');
    let numOfTries = "\n" + deals[deals.length - 1];
    deals.pop();
    let newDeal = newDealDsiString.split('\n\n')[1];
    deals.push(newDeal);
    deals.push(numOfTries);
    let withNewDeal = deals.join('\n\n');
    let numOfDeals = getNumOfDeals(withNewDeal) + 1;
    withNewDeal = withNewDeal.split('Number of deals: ');
    let withNewDealBefore = withNewDeal[0];
    withNewDealBefore = withNewDealBefore.slice(0, -1);
    let withNewDealAfter = withNewDeal[1].split('\n');
    withNewDealAfter.shift();
    withNewDealAfter = withNewDealAfter.join('\n');
    withNewDeal = withNewDealBefore + 'Number of deals: ' + numOfDeals + "\n" + withNewDealAfter;
    withNewDeal = renumerateDeals(withNewDeal);
    console.log('here', withNewDeal);
    return withNewDeal;
}

export const removeDealFromDsi = (dsiString, dealNum) => {
    let dealToRemove = extractDeal(dsiString, dealNum);
    let deals = dsiString.split(dealToRemove);
    deals[0] = deals[0].slice(0, -2);
    let dealsWithRemoved = deals.join('');
    let numOfDeals = getNumOfDeals(dealsWithRemoved) - 1;
    dealsWithRemoved = dealsWithRemoved.split('Number of deals: ');
    let dealsWithRemovedBefore = dealsWithRemoved[0];
    console.log("1: ", dealsWithRemovedBefore);
    let dealsWithRemovedAfter = dealsWithRemoved[1].split('\n');
    dealsWithRemovedAfter.shift();
    dealsWithRemovedAfter = dealsWithRemovedAfter.join('\n');
    console.log("2: ", dealsWithRemovedAfter);
    dealsWithRemoved = dealsWithRemovedBefore + 'Number of deals: ' + numOfDeals + "\n" + dealsWithRemovedAfter;
    dealsWithRemoved = renumerateDeals(dealsWithRemoved);
    return dealsWithRemoved;
}

export const getNumOfDeals = (dsiString) => {
    const lines = dsiString.split('\n');
    const numOfDealsLine = lines.find(line => line.includes('Number of deals:'));
    return parseInt(numOfDealsLine.split(':')[1].trim());
};

export const getPbnFromDsi = (dsiString) => {
    let scoring = dsiString.split('Scoring: ')[1].split('\n')[0];
    let deals = dsiString.split('\n\n');
    let dataInfo = deals[0];
    deals.shift(); // removing data info
    deals.pop(); // removing final info lines (Tries, etc.)
    deals = dataInfo + "\n\n" + deals.join('\n[Scoring \"' + scoring + '\"]\n\n') + '\n[Scoring \"' + scoring + '\"]\n';
    return deals;
};

export const getLinFromDsi = (dsiString) => {
    let current_time = new Date().toISOString().slice(0, 10);
    let current_hour = new Date().getHours();
    let current_minute = new Date().getMinutes();
    let current_second = new Date().getSeconds();
    let output = "% lin file created at " + current_time + " " + current_hour + ":" + current_minute + ":" + current_second + "\n%\n";
    let deals = dsiString.split('\n\n');
    let dataInfo = deals[0];
    deals.shift(); // removing data info
    deals.pop(); // removing final info lines (Tries, etc.)
    for (let i = 0; i < deals.length; i++) {
        let deal = deals[i];
        let dealer = linDealer(extractDealer(deal))
        let vul = linVul(extractVul(deal));
        let boardNum = i + 1;
        let boardName = 'Board ' + boardNum;
        let linHandSouth = "S" +
            extractSuit(deal, 'hand-south', 'suit-spades') + "H" +
            extractSuit(deal, 'hand-south', 'suit-hearts') + "D" +
            extractSuit(deal, 'hand-south', 'suit-diamonds') + "C" +
            extractSuit(deal, 'hand-south', 'suit-clubs');
        let linHandWest = "S" +
            extractSuit(deal, 'hand-west', 'suit-spades') + "H" +
            extractSuit(deal, 'hand-west', 'suit-hearts') + "D" +
            extractSuit(deal, 'hand-west', 'suit-diamonds') + "C" +
            extractSuit(deal, 'hand-west', 'suit-clubs');
        let linHandNorth = "S" +
            extractSuit(deal, 'hand-north', 'suit-spades') + "H" +
            extractSuit(deal, 'hand-north', 'suit-hearts') + "D" +
            extractSuit(deal, 'hand-north', 'suit-diamonds') + "C" +
            extractSuit(deal, 'hand-north', 'suit-clubs');
        let lin =
            "qx|o" + boardNum + "|md|" +
            dealer + linHandSouth + "," +
            linHandWest + "," +
            linHandNorth + "," +
            "|rh||ah|" +
            boardName + "|sv|" + vul + "|pg||\n";
        output += lin;
    }
    return output;
}

export const getLinFromJson = (jsonDealSetString) => {
    let dsiString = getDsiFromJson(jsonDealSetString);
    return getLinFromDsi(dsiString);
}

export const getPbnFromJson = (jsonDealSetString) => {
    let dsiString = getDsiFromJson(jsonDealSetString);
    return getPbnFromDsi(dsiString);
}

export const getDsiFromJson = (jsonDealSetString) => {
    const json = JSON.parse(jsonDealSetString);

    let dsiString = `[Date "${new Date().toISOString().slice(0, 10).replace(/-/g, '.')}"]\n`;

    json.deals.forEach((deal, index) => {
        // Board and Dealer Information
        dsiString += `\n[Board "${index + 1}"]\n`;
        dsiString += `[Dealer "${deal.dealer[0].toUpperCase()}"]\n`;
        dsiString += `[Vulnerable "${deal.vul}"]\n`;

        // Creating the deal string
        const dealOrder = ['North', 'East', 'South', 'West'];
        const dealHands = dealOrder.map(pos => deal[pos.toLowerCase()]).join(" ");
        dsiString += `[Deal "N:${dealHands}"]\n`;
    });

    // TODO (we do not store this info for now)
    dsiString += `\nNumber of deals: ${json.deals.length}\n`;
    dsiString += "Compiler: Chai\n";
    dsiString += "Vulnerability: Random\n";
    dsiString += "Dealer: South\n";
    dsiString += "Flip: NoFlip\n";
    dsiString += "Scoring: IMP\n";
    dsiString += "Tries: 12\n";
    dsiString += "No constraints applied.\n";

    return dsiString;
};


const extractDealer = (deal) => {
    return deal.split('Dealer \"')[1].split('\"')[0];
}

const extractVul = (deal) => {
    let vul = deal.split('Vulnerable \"')[1].split('\"')[0];
    let north_south = vul === 'NS' || vul === 'All';
    let east_west = vul === 'EW' || vul === 'All';
    return [north_south, east_west];
}

const linVul = (vul) => {
    let lin_vul = '';
    if (vul[0] && vul[1]) {
        lin_vul = 'b';
    } else if (vul[0]) {
        lin_vul = 'n';
    } else if (vul[1]) {
        lin_vul = 'e';
    } else {
        lin_vul = 'o';
    }
    return lin_vul;
}

const linDealer = (dealer) => {
    let lin_dealer = '';
    if (dealer === 'N') {
        lin_dealer = '3';
    } else if (dealer === 'E') {
        lin_dealer = '4';
    } else if (dealer === 'S') {
        lin_dealer = '1';
    } else {
        lin_dealer = '2';
    }
    return lin_dealer;
}
