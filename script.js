import wishCard from '/wishCard.js';

const wishList = document.getElementById('withList');
const addWishForm = document.getElementById('addWishForm');

const tabs = document.querySelectorAll('.tabButton');

tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
        event.preventDefault();
        tabs.forEach((tabItem) => tabItem.classList.remove('tabButton_active'));
        tab.classList.add('tabButton_active');
        if (tab.getAttribute('data-type') === 'all') {
            getWishesAll();
        }

        if (tab.getAttribute('data-type') === 'current') {
            refreshWishesGranted(false);
        }

        if (tab.getAttribute('data-type') === 'granted') {
            refreshWishesGranted(true);
        }
    })
});

function renderWish (doc) {
    let li = document.createElement('li');
    let card = document.createElement('wish-card');

    let title = document.createElement('span');
    let category = document.createElement('span');
    let description = document.createElement('span');

    li.classList.add('withList__item');
    title.setAttribute('slot', 'title');
    category.setAttribute('slot', 'category');
    description.setAttribute('slot', 'description');

    title.textContent = doc.data().title;
    category.textContent = doc.data().category;
    description.textContent = doc.data().description;

    card.setAttribute('data-id', doc.id);
    card.setAttribute('data-image', doc.data().imageURL);
    card.appendChild(title);
    card.appendChild(category);
    card.appendChild(description);

    li.appendChild(card);
    wishList.appendChild(li);
}

function getWishedGranted (isGranted) {
    db.collection('wishes').where('isGranted', '==', isGranted).orderBy('category').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderWish (doc);
        })
    })
}

function refreshWishesGranted (isGranted) {
    wishList.innerHTML = "";
    getWishedGranted(isGranted);
}

addWishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('wishes').add({
        title: addWishForm.wishTitle.value,
        category: addWishForm.wishCategory.value,
        description: addWishForm.wishDescription.value,
        imageURL: addWishForm.wishImage.value,
        isGranted: false
    });

    addWishForm.wishTitle.value = '';
    addWishForm.wishCategory.value = '';
    addWishForm.wishDescription.value = '';
    addWishForm.wishImage.value = '';
})

db.collection('wishes').orderBy('category').onSnapshot( snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach( change => {
        if (change.type == 'added') {
            renderWish(change.doc);
        } else if (change.type == 'removed') {
            let li = wishList.querySelector('[data-id=' + change.doc.id + ']').parentNode;
            wishList.removeChild(li);
        }
    })
})

//getWishedFiltered();
