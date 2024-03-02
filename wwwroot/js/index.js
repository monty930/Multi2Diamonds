const buttons =
    document.querySelectorAll('' +
        '.button-save, ' +
        '.button-readme, ' +
        '.button-settings, ' +
        '.button-input');


let originalInputContent, originalDynamicContent, codeContent;

let setTabDynamics = (content) => {
    document.getElementById("tab-dynamics").innerHTML = content;
}

let setDynamicContent = (content) => {
    document.getElementById("dynamic-content").innerHTML = content;
}

let saveCodeContent = () => {
    codeContent = document.getElementById("codeInput").value;
}

let restoreOriginalInputContent = () => setTabDynamics(originalInputContent);

let restoreCodeContent = () => document.getElementById("codeInput").innerHTML = codeContent;

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

    this.defaultListener = () => {
        if (MyButtons.activeButtonId === MyButtons.input.elementId)
            saveCodeContent();

        MyButtons.activeButtonId = this.elementId;
    }

    this.rebind();
}


MyButtons = {
    activeButtonId: "inputButton",

    input: new MyButton({
        elementId: "inputButton",
        listener: () => {
            // Restore the original content
            restoreOriginalInputContent();
            restoreCodeContent();
            updateLineNumbers();

            // if deactivated, do nothing
            if (MyButtons.input.isDeactivated())
                return;

            MyButtons.input.setActivePressed(true);
            MyButtons.lightbulb.setActivePressed(false);
            MyButtons.settings.setActivePressed(false);

            MyButtons.play.setDeactivated(false);
            MyButtons.generateDealSet.setDeactivated(false);
        }
    }),


    lightbulb: new MyButton({
        elementId: "lightbulbButton",
        listener: function () {
            var readmeHTML = document.getElementById('readme-hidden-content').innerHTML;
            setTabDynamics(readmeHTML);

            // if deactivated, do nothing
            if (MyButtons.lightbulb.isDeactivated())
                return;

            MyButtons.input.setActivePressed(false);
            MyButtons.lightbulb.setActivePressed(true);
            MyButtons.settings.setActivePressed(false);

            MyButtons.play.setDeactivated(true);
            MyButtons.generateDealSet.setDeactivated(true);
        }
    }),


    settings: new MyButton({
        elementId: "settingsButton",
        listener: function () {
            var settingsHTML = document.getElementById('settings-hidden-content').innerHTML;
            setTabDynamics(settingsHTML);

            // if deactivated, do nothing
            if (MyButtons.settings.isDeactivated())
                return;

            MyButtons.input.setActivePressed(false);
            MyButtons.lightbulb.setActivePressed(false);
            MyButtons.settings.setActivePressed(true);

            MyButtons.play.setDeactivated(true);
            MyButtons.generateDealSet.setDeactivated(true);
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

            MyButtons.play.setDeactivated(false);
            MyButtons.generateDealSet.setDeactivated(false);
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
}


let updateLineNumbers = function () {
    const textarea = document.getElementById('codeInput');
    if (textarea != null) {
        const lineNumbers = document.getElementById('lineNumbers');
        const lineCount = textarea.value.split('\n').length;

        // Get the computed line height of the textarea for accurate calculations
        const computedStyle = window.getComputedStyle(textarea);
        const lineHeight = parseInt(computedStyle.lineHeight, 10); // Convert the line-height value to an integer

        // Calculate visible lines based on textarea height and the computed line height
        const visibleLines = Math.floor(textarea.clientHeight / lineHeight);

        // Ensure we cover all lines that have content or are within the initial visible area
        const totalLines = Math.max(lineCount, visibleLines);

        let numbers = '';
        for (let i = 1; i <= totalLines; i++) {
            // Apply "used-line" class to lines with content, and "unused-line" to empty but visible lines
            numbers += i <= lineCount ? `<span class="used-line">${i}</span>\n` : `<span class="unused-line">${i}</span>\n`;
        }

        lineNumbers.innerHTML = numbers;
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const dynamicContent = document.getElementById('dynamic-content');
    originalDynamicContent = dynamicContent.innerHTML; // Store the original content

    const tabsDynamicContent = document.getElementById('tab-dynamics');
    originalInputContent = tabsDynamicContent.innerHTML; // Store the original input content

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