constraint_tab = new MyButton({
    elementId: "constraintTabButton",
    listener: function () {
        if (MyButtons.constraint_tab.isDeactivated())
            return;

        show_one_saved_tab('saved-constraints-dynamic', MyButtons.constraint_tab);
    }
});

dealset_tab = new MyButton({
    elementId: "dealSetTabButton",
    listener: function () {
        if (MyButtons.dealset_tab.isDeactivated())
            return;

        show_one_saved_tab('saved-dealsets-dynamic', MyButtons.dealset_tab);
    }
});

MyButtons.constraint_tab = constraint_tab;
MyButtons.dealset_tab = dealset_tab;

show_one_saved_tab = (tabId, button) => {
    sessionStorage.setItem('activeSavedTab', tabId);
    
    document.getElementById('saved-constraints-dynamic').classList.add('hidden');
    document.getElementById('saved-dealsets-dynamic').classList.add('hidden');
    document.getElementById(tabId).classList.remove('hidden');

    MyButtons.constraint_tab.setActivePressed(false);
    MyButtons.dealset_tab.setActivePressed(false);
    button.setActivePressed(true);
}

restore_saved_tab = () => {
    const activeSavedTab = sessionStorage.getItem('activeSavedTab');
    if (activeSavedTab === null)
        return;

    const button = activeSavedTab.includes('constraint') ? MyButtons.constraint_tab : MyButtons.dealset_tab;
    show_one_saved_tab(activeSavedTab, button);
}

rebind_saved_tabs = () => {
    rebind_button(MyButtons.constraint_tab);
    rebind_button(MyButtons.dealset_tab);
}

document.addEventListener('DOMContentLoaded', function () {
    rebind_saved_tabs();
    restore_saved_tab();
    add_trash_animation();
    rebind_saved_items_buttons();
});

add_trash_animation = () => {
    const trashButtons = document.querySelectorAll('.saved-item-delete-button');

    trashButtons.forEach(button => {
        const trashImage = button.querySelector('.save-item-trash-img');

        button.addEventListener('mouseover', function () {
            trashImage.src = '../assets/trash_open.png';
        });

        button.addEventListener('mouseleave', function () {
            trashImage.src = '../assets/trash.png';
        });
    });
}

rebind_saved_items_buttons = () => {
    const savedItemsButtons =
        document.querySelectorAll('button.saved-item-button');

    savedItemsButtons.forEach(button => {
        button.addEventListener('click', function () {
            const savedContentId = this.id.split('-')[2];

            fetch(`/Index/SavedItem?savedContentId=${savedContentId}`)
                .then(response => response.json())
                .then(data => {
                    sessionStorage.setItem('savedContent', data.content);
                    sessionStorage.setItem('savedItemStatus', data.status);
                    if (data.status !== 'error') {
                        sessionStorage.setItem('savedItemId', savedContentId);
                        sessionStorage.setItem('savedItemName', data.name);
                        sessionStorage.setItem('rightpartial', data.partial);
                        if (data.status === 'dealset') {
                            sessionStorage.setItem('currentView', 'dealset');
                        }
                    } else { // error
                        sessionStorage.setItem('rightpartial', data.partial);
                    }
                    window.location.href = '/Index';
                })
                .catch(error => console.error('Error fetching data:', error));
        });
    });
}


        