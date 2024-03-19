function extract_deal(dsiString, dealNum) {
    const deals = dsiString.split("\n\n");
    const deal = deals[dealNum].trim();
    return deal;
}

function extract_suit(deal, handType, suitType) {
    deal = deal.split("[Deal \"N:")[1].split("\"]")[0]
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
    const suit = suits[suitIndex[suitType]];

    return suit;
}

let update_num_of_tries = (dsiString) => {
    let numOfTries = dsiString.split('Tries')[1].split('\n')[0];
    numOfTries = numOfTries.split('\n')[0];
    document.getElementById('num-of-tries').textContent = "Tries" + numOfTries;
    let currentDealNum = sessionStorage.getItem('CurrentDealNum');
    let numOfDeals = get_num_of_deals(dsiString);
    if (document.getElementById('deal-number-info') != null)
        document.getElementById('deal-number-info').textContent = "Deal: " + currentDealNum + "/" + numOfDeals;
}

let get_num_of_deals = (dsiString) => {
    const lines = dsiString.split('\n');
    const numOfDealsLine = lines.find(line => line.includes('Number of deals:'));
    const numOfDeals = parseInt(numOfDealsLine.split(':')[1].trim());
    return numOfDeals;
}

let init_new_deal = (dsiString, currentDealNum) => {
    sessionStorage.setItem('DSIstring', dsiString);
    sessionStorage.setItem('CurrentDealNum', currentDealNum);
    sessionStorage.setItem('NumOfDeals', get_num_of_deals(dsiString).toString());
    if (currentDealNum > 0) {
        update_hand_suit_content(dsiString, 1);
        update_num_of_tries(dsiString);
    } else {
        document.getElementById('entryNumOfDeals').innerHTML = get_num_of_deals(dsiString).toString()
    }
}

let add_deal_in_dsi = (dsiString, newDealDsiString) => {
    let deals = dsiString.split('\n\n');
    let numOfTries = "\n" + deals[deals.length - 1];
    deals.pop();
    let newDeal = newDealDsiString.split('\n\n')[1];
    deals.push(newDeal);
    deals.push(numOfTries);
    let with_new_deal = deals.join('\n\n');
    let numOfDeals = get_num_of_deals(with_new_deal) + 1;
    with_new_deal = with_new_deal.split('Number of deals: ');
    let with_new_deal_before = with_new_deal[0];
    with_new_deal_before = with_new_deal_before.slice(0, -1);
    let with_new_deal_after = with_new_deal[1].split('\n');
    with_new_deal_after.shift();
    with_new_deal_after = with_new_deal_after.join('\n');
    with_new_deal = with_new_deal_before + 'Number of deals: ' + numOfDeals + "\n" + with_new_deal_after;
    with_new_deal = renumerate_deals(with_new_deal);
    return with_new_deal;
}

let remove_deal_in_dsi = (dsiString, dealNum) => {
    let deal_to_remove = extract_deal(dsiString, dealNum) + "\n";
    let deals = dsiString.split(deal_to_remove);
    deals[0] = deals[0].slice(0, -1);
    let deals_with_removed = deals.join('');
    let numOfDeals = get_num_of_deals(deals_with_removed) - 1;
    deals_with_removed = deals_with_removed.split('Number of deals: ');
    let deals_with_removed_before = deals_with_removed[0];
    let deals_with_removed_after = deals_with_removed[1].split('\n');
    deals_with_removed_after.shift();
    deals_with_removed_after = deals_with_removed_after.join('\n');
    deals_with_removed = deals_with_removed_before + 'Number of deals: ' + numOfDeals + "\n" + deals_with_removed_after;
    deals_with_removed = renumerate_deals(deals_with_removed);
    return deals_with_removed;
}

let replace_deal_in_dsi = (dsiString, dealNum, newDealDsiString) => {
    let deal_to_remove = extract_deal(dsiString, dealNum);
    let deals = dsiString.split(deal_to_remove);
    let new_deal = newDealDsiString.split('\n\n')[1];
    deals.push(deals[1]);
    deals[1] = new_deal;
    let with_replaced_deal = deals.join('');
    with_replaced_deal = renumerate_deals(with_replaced_deal);
    return with_replaced_deal;
}

let renumerate_deals = (dsiString) => {
    let deals = dsiString.split('[Board \"');
    for (let i = 1; i < deals.length; i++) {
        let deal = deals[i];
        let deal_div = deal.split('\"');
        deal_div[0] = i.toString();
        deals[i] = deal_div.join('\"');
    }
    let renumerated_deals = deals.join('[Board \"');
    return update_vul(renumerated_deals);
}

let update_vul = (dsiString) => {
    // check if vul is "Matching". If so, set the vulnerability of consecutive deals to:
    // NS is vulnerable in boards 2, 4, 5, 7, 10, 12, 13, 15 and
    // repeats for each 16 boards. EW is vulnerable in boards
    // 3, 4, 6, 7, 9, 10, 13, 16 and repeats for each 16 boards.

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
    let updated_vul = deals.join('[Vulnerable \"');
    return updated_vul;
}

get_pbn_from_dsi = (dsiString) => {
    let scoring = dsiString.split('Scoring: ')[1].split('\n')[0];
    let deals = dsiString.split('\n\n');
    let data_info = deals[0];
    deals.shift(); // removing data info
    deals.pop(); // removing final info lines (Tries, etc.)
    deals = data_info + "\n\n" + deals.join('\n[Scoring \"' + scoring + '\"]\n\n') + '\n[Scoring \"' + scoring + '\"]\n';
    return deals;
}

get_lin_from_dsi = (dsiString) => {
    let current_time = new Date().toISOString().slice(0, 10);
    let current_hour = new Date().getHours();
    let current_minute = new Date().getMinutes();
    let current_second = new Date().getSeconds();
    let output = "% lin file created at " + current_time + " " + current_hour + ":" + current_minute + ":" + current_second + "\n%\n";
    let deals = dsiString.split('\n\n');
    let data_info = deals[0];
    deals.shift(); // removing data info
    deals.pop(); // removing final info lines (Tries, etc.)
    for (let i = 0; i < deals.length; i++) {
        let deal = deals[i];
        let dealer = lin_dealer(extract_dealer(deal))
        let vul = lin_vul(extract_vul(deal));
        let board_num = i + 1;
        let board_name = 'Board ' + board_num;
        let lin_hand_south = "S" +
            extract_suit(deal, 'hand-south', 'suit-spades') + "H" +
            extract_suit(deal, 'hand-south', 'suit-hearts') + "D" +
            extract_suit(deal, 'hand-south', 'suit-diamonds') + "C" +
            extract_suit(deal, 'hand-south', 'suit-clubs');
        let lin_hand_west = "S" +
            extract_suit(deal, 'hand-west', 'suit-spades') + "H" +
            extract_suit(deal, 'hand-west', 'suit-hearts') + "D" +
            extract_suit(deal, 'hand-west', 'suit-diamonds') + "C" +
            extract_suit(deal, 'hand-west', 'suit-clubs');
        let lin_hand_north = "S" +
            extract_suit(deal, 'hand-north', 'suit-spades') + "H" +
            extract_suit(deal, 'hand-north', 'suit-hearts') + "D" +
            extract_suit(deal, 'hand-north', 'suit-diamonds') + "C" +
            extract_suit(deal, 'hand-north', 'suit-clubs');
        let lin =
            "qx|o" + board_num + "|md|" +
            dealer + lin_hand_south + "," +
            lin_hand_west + "," +
            lin_hand_north + "," +
            "|rh||ah|" +
            board_name + "|sv|" + vul + "|pg||\n";
        output += lin;
    }
    return output;
}

extract_vul = (deal) => {
    let vul = deal.split('Vulnerable \"')[1].split('\"')[0];
    let north_south = vul === 'NS' || vul === 'All';
    let east_west = vul === 'EW' || vul === 'All';
    return [north_south, east_west];
}

extract_dealer = (deal) => {
    let dealer = deal.split('Dealer \"')[1].split('\"')[0];
    return dealer;
}

lin_vul = (vul) => {
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

lin_dealer = (dealer) => {
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