let messageTimeout;

function displayMessage(message, isError = false, timeout = 3000) {
    const messageElement = document.querySelector('.save-message');
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    if (isError) {
        messageElement.style.color = 'red';
    } else {
        messageElement.style.color = '';
    }

    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        messageElement.style.display = 'none';
    }, timeout);
}

document.getElementById("addDealSetButton").addEventListener("click", function () {
    init_dealset_save();
});

document.getElementById("addConstraint").addEventListener("click", function () {
    init_constraint_save();
});

document.getElementById("addExistingDealSet").addEventListener("click", function () {
    init_dealset_save(true);
});

document.getElementById("addExistingConstraint").addEventListener("click", function () {
    init_constraint_save(true);
});

let init_constraint_save = (existing = false) => {
    let constraintName = document.getElementById("constraintName").value;
    if (!constraintName) {
        displayMessage("Specify constraint name!", true);
        return;
    }

    displayMessage("Saving constraint...", false, 20000);
    let constraints = document.getElementById("codeInput").value;

    save_content('constraint', constraintName, constraints, existing);
}

let init_dealset_save = (existing = false) => {
    let view = sessionStorage.getItem('currentView');
    if (view !== "dealset") {
        displayMessage("Generate deal set first!", true);
        return;
    }

    let dealSetName = document.getElementById("dealSetName").value;
    if (!dealSetName) {
        displayMessage("Specify deal set name!", true);
        return;
    }

    displayMessage("Saving deal set...", false, 20000);
    let dealset = sessionStorage.getItem('DSIstring');

    save_content('dealset', dealSetName, dealset, existing);
}

let save_content = (itemType, itemName, content, existing = false) => {
    console.log("Saving " + itemType + " " + itemName + " existing: " + existing);
    let to_send = {name: itemName, content: content, Exists: existing, SavedContentType: itemType};
    if (existing) {
        let id = sessionStorage.getItem('itemToSaveId');
        if (!id) {
            displayMessage("Internal error!", true);
            return;
        }
        to_send.SavedContentId = id;
    }
    console.log(to_send);
    fetch('/Index/AddItem', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': document.getElementsByName("__RequestVerificationToken")[0].value
        },
        body: JSON.stringify(to_send)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                let message = itemType === 'dealset' ? "Deal set saved!" : "Constraint saved!";
                let id = data.id;
                console.log("storing id " + id);
                sessionStorage.setItem('itemToSaveId', id);
                sessionStorage.setItem('itemToSaveName', itemName);
                sessionStorage.setItem('savedItemStatus', itemType);
                sessionStorage.setItem('savedContent', content);
                initialize_save_buttons(false);
                displayMessage(message);
            } else {
                displayMessage(data.message || "An error occurred", true);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            displayMessage(error.message || "An error occurred", true);
        });
}

let initialize_save_buttons = (update_partial = true) => {
    const savedItemStatus = sessionStorage.getItem('savedItemStatus');
    const savedItemId = sessionStorage.getItem('savedItemId');
    const savedItemName = sessionStorage.getItem('savedItemName');
    const addExistingDealSet = document.getElementById('addExistingDealSet');
    const addDealSet = document.getElementById('addDealSetButton');

    // show only 'save as new' button
    const addConstraint = document.getElementById('addConstraint');
    addConstraint.style.display = 'block';
    addConstraint.textContent = 'save';
    const addExistingConstraint = document.getElementById('addExistingConstraint');
    addExistingConstraint.style.display = 'none';

    addDealSet.style.display = 'block';
    addDealSet.textContent = 'save';
    addExistingDealSet.style.display = 'none';

    if (savedItemStatus !== null) {
        // initialize save constraint buttons
        if (savedItemStatus === 'constraint') {
            // show both buttons: 'save' and 'save as new'
            addExistingConstraint.style.display = 'block';
            addExistingConstraint.textContent = 'save';
            addConstraint.style.display = 'block';
            addConstraint.textContent = 'save as new';
            const textarea = document.getElementById('constraintName');
            textarea.innerHTML = savedItemName;
            const codeInputElement = document.getElementById('codeInput');
            let savedContent = sessionStorage.getItem('savedContent');
            if (savedContent !== "") {
                codeInputElement.value = sessionStorage.getItem('savedContent');
            }
        } else if (savedItemStatus === 'dealset') {
            // show both buttons: 'save' and 'save as new'
            addExistingDealSet.style.display = 'block';
            addExistingDealSet.textContent = 'save';
            addDealSet.style.display = 'block';
            addDealSet.textContent = 'save as new';
            const textarea = document.getElementById('dealSetName');
            textarea.innerHTML = savedItemName;

            if (update_partial)
                document.getElementById('right-partial').innerHTML = sessionStorage.getItem('rightpartial');
            init_new_deal(sessionStorage.getItem('savedContent'), 0);
            rebind_right_buttons();
        } else { // error
            if (update_partial)
                document.getElementById('right-partial').innerHTML = sessionStorage.getItem('rightpartial');
        }

        if (savedItemStatus !== 'error') {
            if (savedItemId !== null) {
                sessionStorage.setItem('itemToSaveId', savedItemId);
            }
            if (savedItemName !== null) {
                sessionStorage.setItem('itemToSaveName', savedItemName);
            }
        }
    }

    sessionStorage.removeItem('rightpartial');
    sessionStorage.removeItem('savedItemStatus');
    sessionStorage.removeItem('savedItemId');
    sessionStorage.removeItem('savedItemName');
    sessionStorage.removeItem('savedContent');
}
