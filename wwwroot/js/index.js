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

let settingsHTML = `
<h4>Examples</h4>
    <div class="editor-container">
        <div class="line-numbers"></div>
        <div class="examples-container-inner">
            Tu jakieś readme<br>
            <pre>
final = E.spades > 7
            </pre>
        </div>
        <input type="hidden" name="action" id="actionField" value="save">
    </div>
`;


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

            MyButtons.save.setActivePressed(false);
            MyButtons.input.setActivePressed(true);
            MyButtons.lightbulb.setActivePressed(false);
            MyButtons.settings.setActivePressed(false);

            MyButtons.play.setDeactivated(false);
            document.getElementById('tabs-play').src = "/assets/play.png";
            MyButtons.save.setDeactivated(false);
            document.getElementById('tabs-save').src = "/assets/save.png";
        }
    }),


    lightbulb: new MyButton({
        elementId: "lightbulbButton",
        listener: function () {
            setTabDynamics(settingsHTML);

            // if deactivated, do nothing
            if (MyButtons.lightbulb.isDeactivated())
                return;

            MyButtons.save.setActivePressed(false);
            MyButtons.input.setActivePressed(false);
            MyButtons.lightbulb.setActivePressed(true);
            MyButtons.settings.setActivePressed(false);

            MyButtons.play.setDeactivated(true);
            document.getElementById('tabs-play').src = "/assets/play-deactivated.png";
            MyButtons.save.setDeactivated(true);
            document.getElementById('tabs-save').src = "/assets/save-deactivated.png";
        }
    }),


    settings: new MyButton({
        elementId: "settingsButton",
        listener: function () {
            setTabDynamics(originalInputContent);

            // if deactivated, do nothing
            if (MyButtons.settings.isDeactivated())
                return;

            MyButtons.save.setActivePressed(false);
            MyButtons.input.setActivePressed(false);
            MyButtons.lightbulb.setActivePressed(false);
            MyButtons.settings.setActivePressed(true);

            MyButtons.play.setDeactivated(true);
            document.getElementById('tabs-play').src = "/assets/play-deactivated.png";
            MyButtons.save.setDeactivated(true);
            document.getElementById('tabs-save').src = "/assets/save-deactivated.png";
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
            } else {
                console.log('entry-message is null');
            }
            
            // loading circle
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
                    MyButtons.error.rebind();
                })
                .catch(error => console.error('Error:', error));

            MyButtons.play.setDeactivated(false);
            MyButtons.save.setDeactivated(false);
        },
    }),

    save: new MyButton({
        elementId: "saveButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.save.isDeactivated())
                return;

            event.preventDefault();

            document.getElementById('actionField').value = 'save';

            var formData = new FormData(document.getElementById('FormGenSc'));

            fetch('/Index/Save', {
                method: 'POST',
                body: formData
            })
                .then(response => response.blob())
                .then(blob => {
                    var url = window.URL.createObjectURL(blob);
                    var a = document.createElement('a');
                    a.href = url;
                    a.download = "scenario.txt";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => console.error('Error:', error));
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