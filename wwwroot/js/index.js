const buttons = document.querySelectorAll('.button-save, .button-readme, .button-settings, .button-input');

MyButton = function ({htmlObject, listener}) {
    this.htmlObject = htmlObject;
    this.listener = listener;

    this.setDeactivated = (deactivated) => {
        if (deactivated) {
            this.htmlObject.classList.add('deactivated');
        } else {
            this.htmlObject.classList.remove('deactivated');
        }
    }

    this.setActivePressed = (activePressed) => {
        if (activePressed) {
            this.htmlObject.classList.add('button-active-tab');
        } else {
            this.htmlObject.classList.remove('button-active-tab');
        }
    }

    this.isDeactivated = () => this.htmlObject.classList.contains('deactivated');
}


let originalInputContent, originalDynamicContent;

let setTabDynamics = (content) => {
    document.getElementById("tab-dynamics").innerHTML = content;
}

let setDynamicContent = (content) => {
    document.getElementById("dynamic-content").innerHTML = content;
}

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


let errorHTML = `
<div class="log-view">
    <div class="grid-log-columns">
        <div class="logs-output">
            @if (Model.ScriptOutput != string.Empty)
            {
                <pre>@Model.ScriptOutput</pre>
            }
        </div>
        <div>
            <button class="compile-error-button back" id="backButton">BACK</button>
        </div>
    </div>
</div>
`;


MyButtons = {
    input: new MyButton({
        htmlObject: document.getElementById("inputButton"),
        listener: function () {
            // Restore the original content
            setTabDynamics(originalInputContent);
            updateLineNumbers();
            MyButtons.forEach(button => {
                if (button === this)
                    button.setActivePressed(true);
                else
                    button.setActivePressed(false);
            });

            this.setActivePressed(true);
            this.setDeactivated(false);
            MyButtons.play.setDeactivated(false);
            MyButtons.save.setDeactivated(false);
        }
    }),


    lightbulb: new MyButton({
        htmlObject: document.getElementById("lightbulbButton"),
        listener: function () {
            setTabDynamics(originalInputContent);
        }
    }),


    settings: new MyButton({
        htmlObject: document.getElementById("settingsButton"),
        listener: function () {
            setTabDynamics(settingsHTML);

            buttons.forEach(button => {
                if (button === this)
                    button.setActivePressed(true);
                else
                    button.setActivePressed(false);
            });

            MyButtons.play.setDeactivated(false);
            MyButtons.save.setDeactivated(false);
        }
    }),


    play: new MyButton({
        htmlObject: document.getElementById("playButton"),
        listener: function () {
            if (MyButtons.play.isDeactivated())
                return;

            // loading circle
            document.getElementById('spinner').style.display = 'block';
            // Set the action value
            document.getElementById('actionField').value = 'play';
            // Submit the form
            let submitter = document.getElementById('formSubmitPlay');
            document.getElementById('FormGenSc').requestSubmit(submitter);
        },
    }),

    save: new MyButton({
        htmlObject: document.getElementById("saveButton"),
        listener: null
    }),

    error: new MyButton({
        htmlObject: document.getElementById("errorButton"),
        listener: function () {
            // The new content
            setDynamicContent(originalDynamicContent);
            return false;
        }
    })
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


    Object.values(MyButtons).forEach(button => {
        if (button.listener != null && button.htmlObject != null)
            button.htmlObject.addEventListener('click', button.listener);
    });

    console.log("Added listeners");

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
});