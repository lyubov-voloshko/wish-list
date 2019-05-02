/*const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');*/
const logoutButton = document.getElementById('logout-button');
const addWishButton = document.getElementById('add-wish-button');

auth.onAuthStateChanged( user => {
    if (user) {
        logoutButton.style.display = 'block';
    } else {
        logoutButton.style.display = 'none';
        addWishForm.remove();
        addWishButton.remove();
    }
});

/*signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    auth.createUserWithEmailAndPassword(email, password).then( cred => {
        console.log(cred.user);
    });
})

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password);
})*/

logoutButton.addEventListener('click', (e) => {
    e.preventDefault();

    auth.signOut();
})
