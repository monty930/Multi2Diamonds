const buttons =
    document.querySelectorAll('' +
        '.button-save, ' +
        '.button-readme, ' +
        '.button-settings, ' +
        '.button-input');

let setDynamicContent = (content) => {
    document.getElementById("dynamic-content").innerHTML = content;
}

let hide_left_elems = () => {
    document.getElementById('input-dynamic').classList.add('hidden');
    document.getElementById('lightbulb-dynamic').classList.add('hidden');
    document.getElementById('settings-dynamic').classList.add('hidden');
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
            // if deactivated, do nothing
            if (MyButtons.input.isDeactivated())
                return;
            
            hide_left_elems();
            document.getElementById('input-dynamic').classList.remove('hidden');
            
            updateLineNumbers();

            MyButtons.input.setActivePressed(true);
            MyButtons.lightbulb.setActivePressed(false);
            MyButtons.settings.setActivePressed(false);
        }
    }),


    lightbulb: new MyButton({
        elementId: "lightbulbButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.lightbulb.isDeactivated())
                return;

            hide_left_elems();
            document.getElementById('lightbulb-dynamic').classList.remove('hidden');

            MyButtons.input.setActivePressed(false);
            MyButtons.lightbulb.setActivePressed(true);
            MyButtons.settings.setActivePressed(false);
        }
    }),


    settings: new MyButton({
        elementId: "settingsButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.settings.isDeactivated())
                return;

            hide_left_elems();
            document.getElementById('settings-dynamic').classList.remove('hidden');

            MyButtons.input.setActivePressed(false);
            MyButtons.lightbulb.setActivePressed(false);
            MyButtons.settings.setActivePressed(true);
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


let updateLineNumbers = function () {
    const textarea = document.getElementById('codeInput');
    if (textarea != null) {
        const lineNumbers = document.getElementById('lineNumbers');
        const lineCount = textarea.value.split('\n').length;

        const computedStyle = window.getComputedStyle(textarea);
        const lineHeight = parseInt(computedStyle.lineHeight, 10);
        const visibleLines = Math.floor(textarea.clientHeight / lineHeight);

        const totalLines = Math.max(lineCount, visibleLines);

        let numbers = '';
        for (let i = 1; i <= totalLines; i++) {
            numbers += i <= lineCount ? `<span class="used-line">${i}</span>\n` : `<span class="unused-line">${i}</span>\n`;
        }

        lineNumbers.innerHTML = numbers;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Check if a saved scroll position exists and restore it
    const savedScrollTop = localStorage.getItem('textareaScrollTop');
    if (savedScrollTop !== null) {
        document.getElementById('codeInput').scrollTop = parseInt(savedScrollTop, 10);
    }

    document.getElementById('codeInput').addEventListener('input', updateLineNumbers);
    document.getElementById('codeInput').addEventListener('scroll', function () {
        document.getElementById('lineNumbers').scrollTop = this.scrollTop;
    });

    window.addEventListener('resize', updateLineNumbers);

    // Save the current scroll position of the textarea to localStorage
    window.addEventListener('beforeunload', function () {
        localStorage.setItem('textareaScrollTop', document.getElementById('codeInput').scrollTop.toString());
    });

    updateLineNumbers();
});