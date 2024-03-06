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