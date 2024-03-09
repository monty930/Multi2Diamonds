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
    let currentDealNum = window.localStorage.getItem('CurrentDealNum');
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
    window.localStorage.setItem('DSIstring', dsiString);
    window.localStorage.setItem('CurrentDealNum', currentDealNum);
    window.localStorage.setItem('NumOfDeals', get_num_of_deals(dsiString).toString());
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
    return renumerated_deals;
}

get_pbn_from_dsi = (dsiString) => {
    let output = dsiString.split('Number of')[0];
    return output;
}

// TODO
get_lin_from_dsi = (dsiString) => {
    let output = "Lin will be here.\n" + dsiString;
    return output;
}