function extractDeal(pbnString, dealNum) {
    const deals = pbnString.trim().split('\n');
    const index = dealNum - 1;

    if (index >= 0 && index < deals.length) {
        return deals[index];
    } else {
        return 'Deal number is out of range.';
    }
}

function extractSuit(deal, handType, suitType) {
    deal = deal.substring(9, deal.length - 2);
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

function updateHandSuitContent(pbnString, dealNum) {
    let deal = extractDeal(pbnString, dealNum);
    document.querySelectorAll('.hands').forEach(handDiv => {
        const handType = handDiv.classList[1];
        handDiv.querySelectorAll('.suit').forEach(suitDiv => {
            const suitType = suitDiv.querySelector('div').classList[0];
            suitDiv.querySelector('div').textContent = extractSuit(deal, handType, suitType)
        });
    });
}

let rebindButton = (button) => {
    if (button != null)
        button.rebind();
}

let rebind_right_buttons = () => {
    rebindButton(MyButtons.generateExample);
    rebindButton(MyButtons.generateDealSet);
    rebindButton(MyButtons.error);
    rebindButton(MyButtons.save);
    rebindButton(MyButtons.nextDeal);
    rebindButton(MyButtons.previousDeal);
    rebindButton(MyButtons.trash);
    rebindButton(MyButtons.regenerateOne);
    rebindButton(MyButtons.addDeal);
}

let init_deal_generation = () => {
    if (document.getElementById('entry-message') != null) {
        document.getElementById('entry-message').style.display = 'none';
    }

    document.getElementById('spinner').style.display = 'block';
}

let updateNumOfTries = (pbnString) => {
    let numOfTries = pbnString.split('Tries')[1];
    document.getElementById('num-of-tries').textContent = "Tries" + numOfTries;
    let currentDealNum = window.localStorage.getItem('CurrentDealNum');
    let numOfDeals = getNumOfDeals(pbnString);
    if (document.getElementById('deal-number-info') != null)
        document.getElementById('deal-number-info').textContent = "Deal: " + currentDealNum + "/" + numOfDeals;
}

let getNumOfDeals = (pbnString) => {
    return pbnString.split('[').length - 1;
}

let init_new_deal = (pbnString) => {
    window.localStorage.setItem('PBNstring', pbnString);
    window.localStorage.setItem('CurrentDealNum', "1");
    window.localStorage.setItem('NumOfDeals', getNumOfDeals(pbnString).toString());
    updateHandSuitContent(pbnString, 1);
    updateNumOfTries(pbnString);
}

let disable_right_buttons = () => {
    MyButtons.nextDeal.setDeactivated(false);
    MyButtons.previousDeal.setDeactivated(false);
    MyButtons.addDeal.setDeactivated(false);
    MyButtons.nextDeal.element.classList.remove('hidden');
    MyButtons.previousDeal.element.classList.remove('hidden');
    MyButtons.addDeal.element.classList.remove('hidden');
    if (window.localStorage.getItem('CurrentDealNum') === "1") {
        MyButtons.previousDeal.setDeactivated(true);
        MyButtons.previousDeal.element.classList.add('hidden');
    }
    if (window.localStorage.getItem('CurrentDealNum') === window.localStorage.getItem('NumOfDeals')) {
        MyButtons.nextDeal.setDeactivated(true);
        MyButtons.nextDeal.element.classList.add('hidden');
    }
    else {
        MyButtons.addDeal.setDeactivated(true);
        MyButtons.addDeal.element.classList.add('hidden');
    }
}

display_form = () => {
    document.getElementById("dialogSaveWindow").style.display = "block";
    // TODO: enable buttons
}

hide_form = () => {
    document.getElementById("dialogSaveWindow").style.display = "none";
}

disable_form_buttons = () => {
    // TODO
}

let add_deal_in_pbn = (pbnString, newDealPbnString) => {
    let deals = pbnString.split('\n\nTries');
    let numOfTries = "\nTries" + deals[deals.length - 1];
    deals.pop();
    let newDeal = newDealPbnString.split('\n')[0];
    deals.push(newDeal);
    deals.push(numOfTries);
    return deals.join('\n');
}

let remove_deal_in_pbn = (pbnString, dealNum) => {
    let deals = pbnString.split('\n\nTries');
    let numOfTries = "\n\nTries" + deals[deals.length - 1];
    deals.pop();
    deals = deals[0].split('\n');
    let dealsNew = [];
    for (let i = 0; i < deals.length; i++) {
        if (i !== dealNum - 1) {
            dealsNew.push(deals[i]);
        }
    }
    let pbn_with_removed = dealsNew.join('\n');
    pbn_with_removed += numOfTries;
    return pbn_with_removed;
}

let replace_deal_in_pbn = (pbnString, dealNum, newDealPbnString) => {
    let deals = pbnString.split('\n\nTries');
    let numOfTries = "\n\nTries" + deals[deals.length - 1];
    deals.pop();
    deals = deals[0].split('\n');
    deals[dealNum - 1] = newDealPbnString.split('\n')[0];
    let pbn_with_replaced = deals.join('\n');
    pbn_with_replaced += numOfTries;
    return pbn_with_replaced;
}