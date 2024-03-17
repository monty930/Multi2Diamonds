function deleteSavedContent(savedContentId) {
    fetch('/Profile/DeleteSavedContent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'RequestVerificationToken': document.getElementsByName("__RequestVerificationToken")[0].value
        },
        body: JSON.stringify(savedContentId)
    })
        .then(response => {
            if (response.ok) {
                location.reload(); // Reload the page to reflect changes
            } else {
                alert('Failed to delete the saved content.');
            }
        })
        .catch(error => console.error('Error:', error));
}