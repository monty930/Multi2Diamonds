console.clear();

const signupButton = document.getElementById('signup');
const loginButton = document.getElementById('login');

signupButton.addEventListener('click', (e) => {
    let parent = e.target.parentNode.parentNode;
    Array.from(e.target.parentNode.parentNode.classList).find((element) => {
        if(element !== "slide-up") {
            parent.classList.add('slide-up');
        }else{
            loginButton.parentNode.classList.add('slide-up');
            parent.classList.remove('slide-up');
        }
    });
});

loginButton.addEventListener('click', (e) => {
    let parent = e.target.parentNode;
    Array.from(e.target.parentNode.classList).find((element) => {
        if(element !== "slide-up") {
            parent.classList.add('slide-up')
        }else{
            signupButton.parentNode.parentNode.classList.add('slide-up')
            parent.classList.remove('slide-up')
        }
    });
});