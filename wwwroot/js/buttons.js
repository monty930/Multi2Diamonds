let setDynamicContent = (content) => {
    document.getElementById("dynamic-content").innerHTML = content;
}

let show_one_left_elem = (visible_id) => {
    document.getElementById('input-dynamic').classList.add('hidden');
    document.getElementById('lightbulb-dynamic').classList.add('hidden');
    document.getElementById('settings-dynamic').classList.add('hidden');
    document.getElementById(visible_id).classList.remove('hidden');
}

let set_one_tab_active = (button) => {
    MyButtons.input.setActivePressed(false);
    MyButtons.lightbulb.setActivePressed(false);
    MyButtons.settings.setActivePressed(false);
    button.setActivePressed(true);
}

MyButton = function ({elementId, listener}) {
    this.elementId = elementId;
    this.listener = listener;

    this.rebind = () => {
        this.element = document.getElementById(this.elementId);
        if (this.element == null)
            return false;

        this.element.addEventListener('click', () => {
            this.defaultListener();
            this.listener();
        });
        return true;
    }

    this.setDeactivated = (deactivated) => {
        if (deactivated) {
            this.element.classList.add('deactivated');
        } else {
            this.element.classList.remove('deactivated');
        }
    }

    this.setActivePressed = (activePressed) => {
        if (activePressed) {
            this.element.classList.add('button-active-tab');
        } else {
            this.element.classList.remove('button-active-tab');
        }
    }

    this.isDeactivated = () => {
        return this.element.classList.contains('deactivated');
    }

    this.isActivePressed = () => {
        return this.element.classList.contains('button-active-tab');
    }

    this.defaultListener = () => {
        MyButtons.activeButtonId = this.elementId;
    }

    this.rebind();
}


MyButtons = {
    activeButtonId: "inputButton",

    input: new MyButton({
        elementId: "inputButton",
        listener: () => {
            if (MyButtons.input.isDeactivated())
                return;

            show_one_left_elem('input-dynamic');
            set_one_tab_active(MyButtons.input);
            updateLineNumbers();
        }
    }),


    lightbulb: new MyButton({
        elementId: "lightbulbButton",
        listener: function () {
            if (MyButtons.lightbulb.isDeactivated())
                return;

            show_one_left_elem('lightbulb-dynamic');
            set_one_tab_active(MyButtons.lightbulb);
        }
    }),


    settings: new MyButton({
        elementId: "settingsButton",
        listener: function () {
            if (MyButtons.settings.isDeactivated())
                return;

            show_one_left_elem('settings-dynamic');
            set_one_tab_active(MyButtons.settings);
        }
    }),


    play: new MyButton({
        elementId: "generateExampleButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.play.isDeactivated())
                return;

            event.preventDefault();

            // if entry-message is not null, make it display none
            if (document.getElementById('entry-message') != null) {
                document.getElementById('entry-message').style.display = 'none';
            }

            document.getElementById('spinner').style.display = 'block';

            document.getElementById('actionField').value = 'play';

            var formData = new FormData(document.getElementById('FormGenSc'));

            fetch('/Index/GenerateExample', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(html => {
                    document.getElementById('right-partial').innerHTML = html;
                    MyButtons.play.rebind();
                    MyButtons.generateDealSet.rebind();
                    MyButtons.error.rebind();
                })
                .catch(error => console.error('Error:', error));
        },
    }),

    generateDealSet: new MyButton({
        elementId: "generateDealSetButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.generateDealSet.isDeactivated())
                return;

            // if entry-message is not null, make it display none
            if (document.getElementById('entry-message') != null) {
                document.getElementById('entry-message').style.display = 'none';
            }

            document.getElementById('spinner').style.display = 'block';

            event.preventDefault();

            document.getElementById('actionField').value = 'generateDealSet';

            var formData = new FormData(document.getElementById('FormGenSc'));

            fetch('/Index/GenerateDealSet', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(html => {
                    document.getElementById('right-partial').innerHTML = html;
                    MyButtons.play.rebind();
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
    }),

    nextDeal: new MyButton({
        elementId: "nextDealButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.nextDeal.isDeactivated())
                return;

            event.preventDefault();

            document.getElementById('actionField').value = 'nextDeal';
            var dealSetData = document.getElementById('dealSetContent').getAttribute('deal-set-data');
            var whichDeal = document.getElementById('dealSetContent').getAttribute('which-deal');

            var formData = new FormData(document.getElementById('FormGenSc'));
            formData.append('dealSetData', dealSetData);
            formData.append('whichDeal', whichDeal);

            fetch('/Index/NextDeal', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(html => {
                    document.getElementById('right-partial').innerHTML = html;
                    MyButtons.play.rebind();
                    MyButtons.generateDealSet.rebind();
                    MyButtons.error.rebind();
                    MyButtons.save.rebind();
                    MyButtons.nextDeal.rebind();
                    MyButtons.previousDeal.rebind();
                    MyButtons.trash.rebind();
                    MyButtons.regenerateOne.rebind();
                    MyButtons.addDeal.rebind();
                })
                .catch(error => console.error('Error:', error));
        }
    }),

    previousDeal: new MyButton({
        elementId: "previousDealButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.previousDeal.isDeactivated())
                return;

            event.preventDefault();

            document.getElementById('actionField').value = 'previousDeal';
            var dealSetData = document.getElementById('dealSetContent').getAttribute('deal-set-data');
            var whichDeal = document.getElementById('dealSetContent').getAttribute('which-deal');

            var formData = new FormData(document.getElementById('FormGenSc'));
            formData.append('dealSetData', dealSetData);
            formData.append('whichDeal', whichDeal);

            fetch('/Index/PreviousDeal', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(html => {
                    document.getElementById('right-partial').innerHTML = html;
                    MyButtons.play.rebind();
                    MyButtons.generateDealSet.rebind();
                    MyButtons.error.rebind();
                    MyButtons.save.rebind();
                    MyButtons.nextDeal.rebind();
                    MyButtons.previousDeal.rebind();
                    MyButtons.trash.rebind();
                    MyButtons.regenerateOne.rebind();
                    MyButtons.addDeal.rebind();
                })
                .catch(error => console.error('Error:', error));
        }
    }),

    save: new MyButton({
        elementId: "saveButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.save.isDeactivated())
                return;

            var dealSetData = document.getElementById('dealSetContent').getAttribute('deal-set-data');

            // save the deal set content on the client side
            var blob = new Blob([dealSetData], { type: 'text/plain' });
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "dealSetData.txt";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    }),

    error: new MyButton({
        elementId: "errorButton",
        listener: function () {
            // Store the original content
            originalDynamicContent = document.getElementById('dynamic-content').innerHTML;
            // The new content
            let errorContent = document.getElementById('log-hidden-content').innerHTML;
            setDynamicContent(errorContent);
            MyButtons.back.rebind();
            return false;
        }
    }),

    back: new MyButton({
        elementId: "backButton",
        listener: function () {
            // Restore the original content
            setDynamicContent(originalDynamicContent);
            MyButtons.error.rebind();
            MyButtons.play.rebind();
            MyButtons.generateDealSet.rebind();
            return false;
        }
    }),

    trash: new MyButton({
        elementId: "trashButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.trash.isDeactivated())
                return;

            event.preventDefault();

            document.getElementById('actionField').value = 'trash';
            var dealSetData = document.getElementById('dealSetContent').getAttribute('deal-set-data');
            var whichDeal = document.getElementById('dealSetContent').getAttribute('which-deal');

            var formData = new FormData(document.getElementById('FormGenSc'));
            formData.append('dealSetData', dealSetData);
            formData.append('whichDeal', whichDeal);

            fetch('/Index/Trash', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(html => {
                    document.getElementById('right-partial').innerHTML = html;
                    MyButtons.play.rebind();
                    MyButtons.generateDealSet.rebind();
                    MyButtons.error.rebind();
                    MyButtons.save.rebind();
                    MyButtons.nextDeal.rebind();
                    MyButtons.previousDeal.rebind();
                    MyButtons.trash.rebind();
                    MyButtons.regenerateOne.rebind();
                    MyButtons.addDeal.rebind();
                })
                .catch(error => console.error('Error:', error));
        }
    }),

    regenerateOne: new MyButton({
        elementId: "retryButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.regenerateOne.isDeactivated())
                return;

            document.getElementById('spinner').style.display = 'block';

            event.preventDefault();

            document.getElementById('actionField').value = 'regenerateOne';
            var dealSetData = document.getElementById('dealSetContent').getAttribute('deal-set-data');
            var whichDeal = document.getElementById('dealSetContent').getAttribute('which-deal');

            var formData = new FormData(document.getElementById('FormGenSc'));
            formData.append('dealSetData', dealSetData);
            formData.append('whichDeal', whichDeal);

            fetch('/Index/RegenerateOne', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(html => {
                    document.getElementById('right-partial').innerHTML = html;
                    MyButtons.play.rebind();
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
    }),

    addDeal: new MyButton({
        elementId: "addDealButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.addDeal.isDeactivated())
                return;

            document.getElementById('spinner').style.display = 'block';

            event.preventDefault();

            document.getElementById('actionField').value = 'addDeal';
            var dealSetData = document.getElementById('dealSetContent').getAttribute('deal-set-data');
            var whichDeal = document.getElementById('dealSetContent').getAttribute('which-deal');

            var formData = new FormData(document.getElementById('FormGenSc'));
            formData.append('dealSetData', dealSetData);
            formData.append('whichDeal', whichDeal);

            fetch('/Index/AddDeal', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(html => {
                    document.getElementById('right-partial').innerHTML = html;
                    MyButtons.play.rebind();
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
    }),
}
