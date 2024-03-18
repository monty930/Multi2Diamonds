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

let deactivate_savetab = () => {
    MyButtons.saveconstraints.setActivePressed(false);
    const messageElement = document.querySelector('.save-message');
    messageElement.style.display = 'none';
}

let set_one_tab_active = (button) => {
    MyButtons.input.setActivePressed(false);
    MyButtons.lightbulb.setActivePressed(false);
    MyButtons.settings.setActivePressed(false);
    deactivate_savetab();
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

restore_input_tab = () => {
    const activeInputTab = sessionStorage.getItem('activeInputTab');
    if (activeInputTab === null)
        return;

    console.log('restore input tab ' + activeInputTab);
    document.getElementById('codeInput').value = activeInputTab;
}

save_code_on_input = () => {
    const codeInput = document.getElementById('codeInput');
    sessionStorage.setItem('activeInputTab', codeInput.value);
    console.log('save code on input ' + codeInput.value);
}

code_area_on_input = () => {
    console.log('code area on input');
    save_code_on_input();
}

vul_changed = () => {
    let vul_select = document.getElementById('vulnerability-choice');
    let dealer_select = document.getElementById('dealer-choice');
    let vul_value = vul_select.value;
    let dealer_value = dealer_select.value;
    if (vul_value === "Matching") {
        dealer_select.value = "Matching";
    }
    else if (dealer_value === "Matching") {
        dealer_select.value = "Random";
    }
}

dealer_changed = () => {
    let vul_select = document.getElementById('vulnerability-choice');
    let dealer_select = document.getElementById('dealer-choice');
    let vul_value = vul_select.value;
    let dealer_value = dealer_select.value;
    if (dealer_value === "Matching") {
        vul_select.value = "Matching";
    }
    else if (vul_value === "Matching") {
        vul_select.value = "Random";
    }
}
    