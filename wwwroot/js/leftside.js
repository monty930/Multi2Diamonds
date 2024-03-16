let setDynamicContent = (content) => {
    document.getElementById("dynamic-content").innerHTML = content;
}

let show_one_left_elem = (visible_id) => {
    document.getElementById('input-dynamic').classList.add('hidden');
    document.getElementById('lightbulb-dynamic').classList.add('hidden');
    document.getElementById('settings-dynamic').classList.add('hidden');
    document.getElementById('saveconstraints-dynamic').classList.add('hidden');
    document.getElementById(visible_id).classList.remove('hidden');
}

let set_one_tab_active = (button) => {
    MyButtons.input.setActivePressed(false);
    MyButtons.lightbulb.setActivePressed(false);
    MyButtons.settings.setActivePressed(false);
    MyButtons.saveconstraints.setActivePressed(false);
    button.setActivePressed(true);
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.number-spinner-decrement').addEventListener('click', function () {
        let input = document.getElementById('deals-in-set');
        let currentValue = parseInt(input.value, 10);
        let minValue = parseInt(input.min, 10);
        if (currentValue > minValue) {
            input.value = currentValue - 1;
        }
    });

    document.querySelector('.number-spinner-increment').addEventListener('click', function () {
        let input = document.getElementById('deals-in-set');
        let currentValue = parseInt(input.value, 10);
        let maxValue = parseInt(input.max, 10);
        if (currentValue < maxValue) {
            input.value = currentValue + 1;
        }
    });
});