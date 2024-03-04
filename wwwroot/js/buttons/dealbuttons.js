generateExample = new MyButton({
    elementId: "generateExampleButton",
    listener: function () {
        if (MyButtons.generateExample.isDeactivated())
            return;

        init_deal_generation();

        event.preventDefault();
        document.getElementById('actionField').value = 'generateExample';
        let formData = new FormData(document.getElementById('FormGenSc'));

        fetch('/Index/GenerateExample', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('right-partial').innerHTML = data.htmlContent;
                rebind_right_buttons();
                init_new_deal(data.pbnString);
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
        document.getElementById('actionField').value = 'generateDealSet';
        let formData = new FormData(document.getElementById('FormGenSc'));

        fetch('/Index/GenerateDealSet', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('right-partial').innerHTML = data.htmlContent;
                rebind_right_buttons();
                init_new_deal(data.pbnString);
                disable_right_buttons();
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

        let pbnString = window.localStorage.getItem('PBNstring');
        let whichDeal = window.localStorage.getItem('CurrentDealNum');
        let active_deal_num = parseInt(whichDeal) + 1;
        updateHandSuitContent(pbnString, active_deal_num);
        window.localStorage.setItem('CurrentDealNum', active_deal_num.toString());
        updateNumOfTries(pbnString);
        disable_right_buttons();
    }
});

previousDeal = new MyButton({
    elementId: "previousDealButton",
    listener: function () {
        if (MyButtons.previousDeal.isDeactivated())
            return;

        let pbnString = window.localStorage.getItem('PBNstring');
        let whichDeal = window.localStorage.getItem('CurrentDealNum');
        let active_deal_num = parseInt(whichDeal) - 1;
        updateHandSuitContent(pbnString, active_deal_num);
        window.localStorage.setItem('CurrentDealNum', active_deal_num.toString());
        updateNumOfTries(pbnString);
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
        document.getElementById('actionField').value = 'addDeal';
        let formData = new FormData(document.getElementById('FormGenSc'));

        fetch('/Index/AddDeal', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                document.getElementById('right-partial').innerHTML = data.htmlContent;

                let pbnString = window.localStorage.getItem('PBNstring');
                let newPbnString = add_deal_in_pbn(pbnString, data.newDealPbnString);
                let whichDeal = window.localStorage.getItem('CurrentDealNum');
                let active_deal_num = parseInt(whichDeal) + 1;
                updateHandSuitContent(newPbnString, active_deal_num);
                window.localStorage.setItem('CurrentDealNum', active_deal_num.toString());
                window.localStorage.setItem('NumOfDeals', active_deal_num.toString());
                window.localStorage.setItem('PBNstring', newPbnString);
                
                updateNumOfTries(newPbnString);
                rebind_right_buttons();
                disable_right_buttons();
                
                document.getElementById('spinner').style.display = 'none';
            })
            .catch(error => console.error('Error:', error));
    }
});

save = new MyButton({
    elementId: "saveButton",
    listener: function () {
        // if deactivated, do nothing
        if (MyButtons.save.isDeactivated())
            return;

        let pbnString = window.localStorage.getItem('PBNstring');

        // save the deal set content on the client side
        let blob = new Blob([pbnString], {type: 'text/plain'});
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = "dealSetData.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
});

trash = new MyButton({
    elementId: "trashButton",
    listener: function () {
        // if deactivated, do nothing
        if (MyButtons.trash.isDeactivated())
            return;

        let pbnString = window.localStorage.getItem('PBNstring');
        let whichDeal = window.localStorage.getItem('CurrentDealNum');
        let active_deal_num = parseInt(whichDeal);
        let howManyDeals = parseInt(window.localStorage.getItem('NumOfDeals'));
        if (howManyDeals > 1) {
            let newPbnString = remove_deal_in_pbn(pbnString, active_deal_num);
            if (active_deal_num > 1) {
                active_deal_num -= 1;
            }
            updateHandSuitContent(newPbnString, active_deal_num);
            window.localStorage.setItem('CurrentDealNum', active_deal_num.toString());
            window.localStorage.setItem('PBNstring', newPbnString);
            let oldNumOfDeals = parseInt(window.localStorage.getItem('NumOfDeals'));
            window.localStorage.setItem('NumOfDeals', (oldNumOfDeals - 1).toString());

            updateNumOfTries(newPbnString);
            disable_right_buttons();
            return;   
        }
        // If deleting last deal go to main page
        event.preventDefault();
        document.getElementById('actionField').value = 'defaultPage';
        let formData = new FormData(document.getElementById('FormGenSc'));
        fetch('/Index/DefaultPage', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(html => {
            console.log("TU " + html);
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
        document.getElementById('actionField').value = 'regenerateOne';
        let formData = new FormData(document.getElementById('FormGenSc'));

        fetch('/Index/RegenerateOne', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('right-partial').innerHTML = data.htmlContent;

            let pbnString = window.localStorage.getItem('PBNstring');
            let whichDeal = window.localStorage.getItem('CurrentDealNum');
            let active_deal_num = parseInt(whichDeal);
            let newPbnString = replace_deal_in_pbn(pbnString, active_deal_num, data.newDealPbnString);
            updateHandSuitContent(newPbnString, active_deal_num);
            
            window.localStorage.setItem('CurrentDealNum', active_deal_num.toString());
            window.localStorage.setItem('PBNstring', newPbnString);

            updateNumOfTries(newPbnString);
            rebind_right_buttons();
            disable_right_buttons();

            document.getElementById('spinner').style.display = 'none';
        }).catch(error => console.error('Error:', error));
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