document.addEventListener('DOMContentLoaded', () => {
    let currentView = sessionStorage.getItem('currentView');
    if (currentView === null) {
        sessionStorage.setItem('currentView', 'entry');
    }
    restore_input_tab();
    initialize_save_buttons();
});
