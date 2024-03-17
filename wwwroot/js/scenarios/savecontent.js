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
    let view = window.localStorage.getItem('currentView');
    if (view !== "dealset") {
        displayMessage("Generate deal set first!", true);
        return;
    }

    let dealSetName = document.getElementById("dealSetName").value;
    if (!dealSetName) {
        displayMessage("Specify deal det name!", true);
        return;
    }
    
    displayMessage("Saving deal set...", false, 20000);
    let dealset = window.localStorage.getItem('DSIstring');

    fetch('/Profile/AddDealSet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': document.getElementsByName("__RequestVerificationToken")[0].value
        },
        body: JSON.stringify({name: dealSetName, content: dealset})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if(data.success) {
                displayMessage("Deal set saved!");
            } else {
                displayMessage(data.message || "An error occurred", true);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            displayMessage(error.message || "An error occurred", true);
        });
});

document.getElementById("addConstraint").addEventListener("click", function () {
    let constraintName = document.getElementById("constraintName").value;
    if (!constraintName) {
        displayMessage("Specify constraint name!", true);
        return;
    }

    displayMessage("Saving constraint...", false, 20000);
    let constraints = document.getElementById("codeInput").value;

    fetch('/Profile/AddConstraint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': document.getElementsByName("__RequestVerificationToken")[0].value
        },
        body: JSON.stringify({name: constraintName, content: constraints})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if(data.success) {
                displayMessage("Constraint saved!");
            } else {
                displayMessage(data.message || "An error occurred", true);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            displayMessage(error.message || "An error occurred", true);
        });
});
