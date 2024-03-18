document.addEventListener('DOMContentLoaded', () => {
    const fetchedContent = sessionStorage.getItem('fetchedSavedContent');

    if (fetchedContent !== null) {
        const codeInputElement = document.getElementById('codeInput');

        if(codeInputElement) {
            codeInputElement.value = fetchedContent;
        } else {
            console.error('Could not find code input element');
        }
        
        sessionStorage.removeItem('fetchedSavedContent');
    }
});
