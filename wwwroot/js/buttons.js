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
        MyButtons.activeButtonId = this.elementId;
    }

    this.rebind();
}


MyButtons = {
    activeButtonId: "inputButton",

    save: new MyButton({
        elementId: "saveButton",
        listener: function () {
            // if deactivated, do nothing
            if (MyButtons.save.isDeactivated())
                return;

            let dealSetData = document.getElementById('dealSetContent').getAttribute('deal-set-data');

            // save the deal set content on the client side
            let blob = new Blob([dealSetData], {type: 'text/plain'});
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
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
            MyButtons.generateExample.rebind();
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
            let dealSetData = document.getElementById('dealSetContent').getAttribute('deal-set-data');
            let whichDeal = document.getElementById('dealSetContent').getAttribute('which-deal');

            let formData = new FormData(document.getElementById('FormGenSc'));
            formData.append('dealSetData', dealSetData);
            formData.append('whichDeal', whichDeal);

            fetch('/Index/Trash', {
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
            let dealSetData = document.getElementById('dealSetContent').getAttribute('deal-set-data');
            let whichDeal = document.getElementById('dealSetContent').getAttribute('which-deal');

            let formData = new FormData(document.getElementById('FormGenSc'));
            formData.append('dealSetData', dealSetData);
            formData.append('whichDeal', whichDeal);

            fetch('/Index/RegenerateOne', {
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
    }),
}
