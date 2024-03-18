constraint_tab = new MyButton({
    elementId: "constraintTabButton",
    listener: function () {
        console.log('constraintTabButton');
        if (MyButtons.constraint_tab.isDeactivated())
            return;

        console.log('constraintTabButton2');
        show_one_saved_tab('saved-constraints-dynamic', MyButtons.constraint_tab);
    }
});

dealset_tab = new MyButton({
    elementId: "dealSetTabButton",
    listener: function () {
        console.log('dealSetTabButton');
        if (MyButtons.dealset_tab.isDeactivated())
            return;
        
        console.log('dealSetTabButton2');

        show_one_saved_tab('saved-dealsets-dynamic', MyButtons.dealset_tab);
    }
});

MyButtons.constraint_tab = constraint_tab;
MyButtons.dealset_tab = dealset_tab;

show_one_saved_tab = (tabId, button) => {
    console.log('show_one_saved_tab' + tabId);
    document.getElementById('saved-constraints-dynamic').classList.add('hidden');
    document.getElementById('saved-dealsets-dynamic').classList.add('hidden');
    document.getElementById(tabId).classList.remove('hidden');
    
    MyButtons.constraint_tab.setActivePressed(false);
    MyButtons.dealset_tab.setActivePressed(false);
    button.setActivePressed(true);
}

rebind_saved_tabs = () => {
    rebind_button(MyButtons.constraint_tab);
    rebind_button(MyButtons.dealset_tab);
}

document.addEventListener('DOMContentLoaded', function() {
    rebind_saved_tabs();
    add_trash_animation();
    rebind_constraint_buttons();
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

rebind_constraint_buttons = () => {
    const savedDealsetButtons = 
        document.querySelectorAll('button.save-constraint-button');

    savedDealsetButtons.forEach(button => {
        button.addEventListener('click', function () {
            const savedContentId = this.id.split('-')[2];
            
            console.log('rebinding constraint button: savedContentId: ' + savedContentId);

            fetch(`/Index/SavedConstraint?savedContentId=${savedContentId}`)
                .then(response => response.json())
                .then(data => {
                    window.location.href = '/Index';
                    sessionStorage.setItem('fetchedSavedContent', data.content);
                })
                .catch(error => console.error('Error fetching data:', error));
        });
    });
}

        