input = new MyButton({
    elementId: "inputButton",
    listener: () => {
        if (MyButtons.input.isDeactivated())
            return;

        show_one_left_elem('input-dynamic');
        document.getElementById('left-side-title').innerHTML = "Enter constraints:";
        set_one_tab_active(MyButtons.input);
    }
});

lightbulb = new MyButton({
    elementId: "lightbulbButton",
    listener: function () {
        if (MyButtons.lightbulb.isDeactivated())
            return;

        show_one_left_elem('lightbulb-dynamic');
        document.getElementById('left-side-title').innerHTML = "Readme";
        set_one_tab_active(MyButtons.lightbulb);
    }
});

settings = new MyButton({
    elementId: "settingsButton",
    listener: function () {
        if (MyButtons.settings.isDeactivated())
            return;

        show_one_left_elem('settings-dynamic');
        document.getElementById('left-side-title').innerHTML = "Settings";
        set_one_tab_active(MyButtons.settings);
    }
});

MyButtons.input = input;
MyButtons.lightbulb = lightbulb;
MyButtons.settings = settings;