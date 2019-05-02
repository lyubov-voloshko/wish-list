const loginForm = document.getElementById('login-form');
const addWishForm = document.getElementById('addWishForm');

auth.onAuthStateChanged( user => {
    if (user) {
        loginForm.style.display = 'none';
    } else {
        loginForm.style.display = 'block';
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let email = document.getElementById('login-email').textInput;
    let password = document.getElementById('login-password').textInput;

    auth.signInWithEmailAndPassword(email.value, password.value);
})

logoutButton.addEventListener('click', (e) => {
    e.preventDefault();

    auth.signOut();
})
