function update_hand_suit_content(dsiString, dealNum) {
    let deal = extract_deal(dsiString, dealNum);
    document.querySelectorAll('.hands').forEach(handDiv => {
        const handType = handDiv.classList[1];
        handDiv.querySelectorAll('.suit').forEach(suitDiv => {
            const suitType = suitDiv.querySelector('div').classList[0];
            suitDiv.querySelector('div').textContent = extract_suit(deal, handType, suitType)
        });
    });
    let vul = extract_vul(deal); // (bool bool)
    if (vul[0]) {
        document.getElementById('N-vul').classList.add('vul');
        document.getElementById('S-vul').classList.add('vul');
    } else {
        document.getElementById('N-vul').classList.remove('vul');
        document.getElementById('S-vul').classList.remove('vul');
    }
    
    if (vul[1]) {
        document.getElementById('E-vul').classList.add('vul');
        document.getElementById('W-vul').classList.add('vul');
    }
    else {
        document.getElementById('E-vul').classList.remove('vul');
        document.getElementById('W-vul').classList.remove('vul');
    }
    
    let dealer = extract_dealer(deal); // N / E / S / W
    document.getElementById('N-vul').classList.remove('dealer');
    document.getElementById('E-vul').classList.remove('dealer');
    document.getElementById('S-vul').classList.remove('dealer');
    document.getElementById('W-vul').classList.remove('dealer');
    let dealerDiv = document.getElementById(dealer + '-vul');
    dealerDiv.classList.add('dealer')
}

let rebind_button = (button) => {
    if (button != null)
        button.rebind();
}

let rebind_right_buttons = () => {
    rebind_button(MyButtons.generateExample);
    rebind_button(MyButtons.generateDealSet);
    rebind_button(MyButtons.error);
    rebind_button(MyButtons.save);
    rebind_button(MyButtons.nextDeal);
    rebind_button(MyButtons.previousDeal);
    rebind_button(MyButtons.trash);
    rebind_button(MyButtons.regenerateOne);
    rebind_button(MyButtons.addDeal);
}

// The function hides the entry message and shows the spinner
let init_deal_generation = () => {
    if (document.getElementById('entry-message') != null) {
        document.getElementById('entry-message').style.display = 'none';
    }

    document.getElementById('spinner').style.display = 'block';
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
    document.getElementById("filenameArea").disabled = false;
    document.getElementById("saveChoices").disabled = false;
    document.getElementById("submitButton").disabled = false;
    document.getElementById("closeButton").disabled = false;
}

hide_form = () => {
    document.getElementById("dialogSaveWindow").style.display = "none";
}

disable_form_buttons = () => {
    document.getElementById("filenameArea").disabled = true;
    document.getElementById("saveChoices").disabled = true;
    document.getElementById("submitButton").disabled = true;
    document.getElementById("closeButton").disabled = true;
}