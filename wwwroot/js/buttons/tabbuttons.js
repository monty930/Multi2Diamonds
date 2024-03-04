input = new MyButton({
    elementId: "inputButton",
    listener: () => {
        if (MyButtons.input.isDeactivated())
            return;

        show_one_left_elem('input-dynamic');
        set_one_tab_active(MyButtons.input);
        updateLineNumbers();
    }
});

lightbulb = new MyButton({
    elementId: "lightbulbButton",
    listener: function () {
        if (MyButtons.lightbulb.isDeactivated())
            return;

        show_one_left_elem('lightbulb-dynamic');
        set_one_tab_active(MyButtons.lightbulb);
    }
});

settings = new MyButton({
    elementId: "settingsButton",
    listener: function () {
        if (MyButtons.settings.isDeactivated())
            return;

        show_one_left_elem('settings-dynamic');
        set_one_tab_active(MyButtons.settings);
    }
});

MyButtons.input = input;
MyButtons.lightbulb = lightbulb;
MyButtons.settings = settings;