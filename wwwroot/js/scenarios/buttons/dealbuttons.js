generateExample = new MyButton({
    elementId: "generateExampleButton",
    listener: function () {
        if (MyButtons.generateExample.isDeactivated())
            return;

        init_deal_generation();

        event.preventDefault();
        let compilerSettings = get_new_compiler_settings();

        fetch('/Index/GenerateExample', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(compilerSettings),
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('right-partial').innerHTML = data.htmlContent;
                rebind_right_buttons();
                if (data.correctDeal === "True") {
                    init_new_deal(data.dsiString, 1);
                    sessionStorage.setItem('currentView', 'example');
                } else {
                    sessionStorage.setItem('currentView', 'error');
                }
                document.getElementById('spinner').style.display = 'none';
            }).catch(error => console.error('Error:', error));
    },
});

generateDealSet = new MyButton({
    elementId: "generateDealSetButton",
    listener: function () {
        if (MyButtons.generateDealSet.isDeactivated())
            return;

        init_deal_generation();

        event.preventDefault();
        let compilerSettings = get_new_compiler_settings();

        fetch('/Index/GenerateDealSet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(compilerSettings),
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('right-partial').innerHTML = data.htmlContent;
                rebind_right_buttons();
                if (data.correctDeal === "True") {
                    init_new_deal(data.dsiString, 0);
                    sessionStorage.setItem('currentView', 'dealset');
                } else {
                    sessionStorage.setItem('currentView', 'error');
                }
                document.getElementById('spinner').style.display = 'none';
            })
            .catch(error => console.error('Error:', error));
    }
});

nextDeal = new MyButton({
    elementId: "nextDealButton",
    listener: function () {
        if (MyButtons.nextDeal.isDeactivated())
            return;

        let dsiString = sessionStorage.getItem('DSIstring');
        let whichDeal = sessionStorage.getItem('CurrentDealNum');
        if (0 === parseInt(whichDeal)) {
            event.preventDefault();
            fetch('/Index/DealSetGetView', {
                method: 'GET'
            })
                .then(response => response.text())
                .then(html => {
                    document.getElementById('right-partial').innerHTML = html;
                    rebind_right_buttons();
                    let active_deal_num = parseInt(whichDeal) + 1;
                    update_hand_suit_content(dsiString, active_deal_num);
                    sessionStorage.setItem('CurrentDealNum', active_deal_num.toString());
                    update_num_of_tries(dsiString);
                    disable_right_buttons();
                })
                .catch(error => console.error('Error:', error));
        } else {
            let active_deal_num = parseInt(whichDeal) + 1;
            update_hand_suit_content(dsiString, active_deal_num);
            sessionStorage.setItem('CurrentDealNum', active_deal_num.toString());
            update_num_of_tries(dsiString);
            disable_right_buttons();
        }
    }
});

previousDeal = new MyButton({
    elementId: "previousDealButton",
    listener: function () {
        if (MyButtons.previousDeal.isDeactivated())
            return;

        let dsiString = sessionStorage.getItem('DSIstring');
        let whichDeal = sessionStorage.getItem('CurrentDealNum');
        let active_deal_num = parseInt(whichDeal) - 1;
        update_hand_suit_content(dsiString, active_deal_num);
        sessionStorage.setItem('CurrentDealNum', active_deal_num.toString());
        update_num_of_tries(dsiString);
        disable_right_buttons();
    }
});

addDeal = new MyButton({
    elementId: "addDealButton",
    listener: function () {
        if (MyButtons.addDeal.isDeactivated())
            return;

        init_deal_generation();

        event.preventDefault();
        let compilerSettings = get_compiler_settings();

        fetch('/Index/AddDeal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(compilerSettings),
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('right-partial').innerHTML = data.htmlContent;
                rebind_right_buttons();

                if (data.correctDeal === "True") {
                    let dsiString = sessionStorage.getItem('DSIstring');
                    let newDsiString = add_deal_in_dsi(dsiString, data.newDealDsiString);
                    let whichDeal = sessionStorage.getItem('CurrentDealNum');
                    let active_deal_num = parseInt(whichDeal) + 1;
                    update_hand_suit_content(newDsiString, active_deal_num);
                    sessionStorage.setItem('CurrentDealNum', active_deal_num.toString());
                    sessionStorage.setItem('NumOfDeals', active_deal_num.toString());
                    sessionStorage.setItem('DSIstring', newDsiString);

                    update_num_of_tries(newDsiString);
                    disable_right_buttons();
                }

                document.getElementById('spinner').style.display = 'none';
            })
            .catch(error => console.error('Error:', error));
    }
});

trash = new MyButton({
    elementId: "trashButton",
    listener: function () {
        // if deactivated, do nothing
        if (MyButtons.trash.isDeactivated())
            return;

        let dsiString = sessionStorage.getItem('DSIstring');
        let whichDeal = sessionStorage.getItem('CurrentDealNum');
        let active_deal_num = parseInt(whichDeal);
        let howManyDeals = parseInt(sessionStorage.getItem('NumOfDeals'));
        if (howManyDeals > 1) {
            let newDsiString = remove_deal_in_dsi(dsiString, active_deal_num);
            if (active_deal_num > 1) {
                active_deal_num -= 1;
            }
            update_hand_suit_content(newDsiString, active_deal_num);
            sessionStorage.setItem('CurrentDealNum', active_deal_num.toString());
            sessionStorage.setItem('DSIstring', newDsiString);
            let oldNumOfDeals = parseInt(sessionStorage.getItem('NumOfDeals'));
            sessionStorage.setItem('NumOfDeals', (oldNumOfDeals - 1).toString());

            update_num_of_tries(newDsiString);
            disable_right_buttons();
            return;
        }
        sessionStorage.setItem('currentView', 'entry');
        event.preventDefault();
        fetch('/Index/DefaultPage', {
            method: 'GET'
        })
            .then(response => response.text())
            .then(html => {
                document.getElementById('right-partial').innerHTML = html;
                rebind_right_buttons();
            })
            .catch(error => console.error('Error:', error));
        rebind_right_buttons();
    }
});

regenerateOne = new MyButton({
    elementId: "retryButton",
    listener: function () {
        if (MyButtons.regenerateOne.isDeactivated())
            return;

        init_deal_generation();

        event.preventDefault();
        let compilerSettings = get_compiler_settings();

        fetch('/Index/RegenerateOne', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(compilerSettings),
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('right-partial').innerHTML = data.htmlContent;
                rebind_right_buttons();

                if (data.correctDeal === "True") {
                    let dsiString = sessionStorage.getItem('DSIstring');
                    let whichDeal = sessionStorage.getItem('CurrentDealNum');
                    let active_deal_num = parseInt(whichDeal);
                    let newDsiString = replace_deal_in_dsi(dsiString, active_deal_num, data.newDealDsiString);
                    update_hand_suit_content(newDsiString, active_deal_num);

                    sessionStorage.setItem('CurrentDealNum', active_deal_num.toString());
                    sessionStorage.setItem('DSIstring', newDsiString);

                    update_num_of_tries(newDsiString);
                    disable_right_buttons();
                }

                document.getElementById('spinner').style.display = 'none';
            }).catch(error => console.error('Error:', error));
    }
});

save = new MyButton({
    elementId: "saveButton",
    listener: function () {
        // if deactivated, do nothing
        if (MyButtons.save.isDeactivated())
            return;

        display_form();
    }
});

submitSaveForm = new MyButton({
    elementId: "submitButton",
    listener: async function () {
        disable_form_buttons();
        const selectedChoice = document.getElementById("saveChoices").value;
        const filename = document.getElementById("filenameArea").value;
        let dsiString = sessionStorage.getItem('DSIstring');
        let contentToSave = dsiString;

        if (selectedChoice === "lin-chosen") {
            contentToSave = get_lin_from_dsi(dsiString);
        } else if (selectedChoice === "pbn-chosen") {
            contentToSave = get_pbn_from_dsi(dsiString);
        } // otherwise the dsi format is chosen

        // save the deal set content on the client side
        let blob = new Blob([contentToSave], {type: 'text/plain'});
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download =
            (filename === "" ? "dealset" : filename) +
            (selectedChoice === "lin-chosen" ? ".lin" : (selectedChoice === "pbn-chosen" ? ".pbn" : ".dsi"));
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        document.getElementById('save-spinner').style.display = 'none';
        hide_form();
    }
});

closeForm = new MyButton({
    elementId: "closeButton",
    listener: function () {
        document.getElementById("dialogSaveWindow").style.display = "none";
    }
});

MyButtons.generateExample = generateExample;
MyButtons.generateDealSet = generateDealSet;
MyButtons.nextDeal = nextDeal;
MyButtons.previousDeal = previousDeal;
MyButtons.addDeal = addDeal;
MyButtons.save = save;
MyButtons.trash = trash;
MyButtons.regenerateOne = regenerateOne;
MyButtons.submitSaveForm = submitSaveForm;
MyButtons.closeForm = closeForm;

// get the compiler settings from the input fields
get_new_compiler_settings = function () {
    return {
        InputText: document.getElementById('codeInput').value,
        Compiler: document.getElementById('compiler-choice').value,
        NumberOfDeals: parseInt(document.getElementById('deals-in-set').value),
        Vul: document.getElementById('vulnerability-choice').value,
        Dealer: document.getElementById('dealer-choice').value,
        Flip: document.getElementById('flip-choice').value,
        Scoring: document.getElementById('scoring-choice').value,
    }
}

// get the compiler settings from the dsi string
get_compiler_settings = function () {
    let dsiString = sessionStorage.getItem('DSIstring');
    return {
        InputText: dsiString.split('Constraints:\n')[1],
        Compiler: dsiString.split('Compiler: ')[1].split('\n')[0],
        NumberOfDeals: sessionStorage.getItem('NumOfDeals'),
        Vul: dsiString.split('Vulnerability: ')[1].split('\n')[0],
        Dealer: dsiString.split('Dealer: ')[1].split('\n')[0],
        Flip: dsiString.split('Flip: ')[1].split('\n')[0],
        Scoring: dsiString.split('Scoring: ')[1].split('\n')[0],
    }
}
