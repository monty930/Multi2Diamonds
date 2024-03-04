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
        let dealSetData = document.getElementById('dealSetContent').getAttribute('deal-set-data');
        let whichDeal = document.getElementById('dealSetContent').getAttribute('which-deal');

        let formData = new FormData(document.getElementById('FormGenSc'));
        formData.append('dealSetData', dealSetData);
        formData.append('whichDeal', whichDeal);

        fetch('/Index/AddDeal', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(html => {
                document.getElementById('right-partial').innerHTML = html;
                MyButtons.generateExample.rebind();
                MyButtons.generateDealSet.rebind();
                MyButtons.error.rebind();
                MyButtons.save.rebind();
                MyButtons.nextDeal.rebind();
                MyButtons.previousDeal.rebind();
                MyButtons.trash.rebind();
                MyButtons.regenerateOne.rebind();
                MyButtons.addDeal.rebind();
                document.getElementById('spinner').style.display = 'none';
            })
            .catch(error => console.error('Error:', error));
    }
});

MyButtons.generateExample = generateExample;
MyButtons.generateDealSet = generateDealSet;
MyButtons.nextDeal = nextDeal;
MyButtons.previousDeal = previousDeal;
MyButtons.addDeal = addDeal;