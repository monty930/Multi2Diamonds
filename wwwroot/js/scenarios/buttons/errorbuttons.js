error = new MyButton({
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
});

back = new MyButton({
    elementId: "backButton",
    listener: function () {
        // Restore the original content
        setDynamicContent(originalDynamicContent);
        MyButtons.error.rebind();
        MyButtons.generateExample.rebind();
        MyButtons.generateDealSet.rebind();
        return false;
    }
});

MyButtons.error = error;
MyButtons.back = back;