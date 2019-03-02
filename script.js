import wishCard from '/wishCard.js';

const wishList = document.getElementById('withList');
const addWishForm = document.getElementById('addWishForm');

const tabs = document.querySelectorAll('.tabButton');

tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
        event.preventDefault();
        tabs.forEach((tabItem) => tabItem.classList.remove('tabButton_active'));
        tab.classList.add('tabButton_active');
        wishList.innerHTML = "";
        if (tab.getAttribute('data-type') === 'all') {
            getWishes();
        }

        if (tab.getAttribute('data-type') === 'current') {
            getWishesGranted(false);
        }

        if (tab.getAttribute('data-type') === 'granted') {
            getWishesGranted(true);
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
    card.setAttribute('data-granted', doc.data().isGranted);
    card.appendChild(title);
    card.appendChild(category);
    card.appendChild(description);

    li.appendChild(card);
    wishList.appendChild(li);
}

function getWishes () {
    db.collection('wishes').orderBy('category').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderWish (doc);
        })
    })

}

function getWishesGranted (isGranted) {
    db.collection('wishes').where('isGranted', '==', isGranted).orderBy('category').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderWish (doc);
        })
    })
}

addWishForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let addedTitle = document.getElementById('addWishTitle').textInput;
    let addedCategory = document.getElementById('addWishCategory');
    let addedDescription = document.getElementById('addWishDescription').textInput;
    let addedImage = document.getElementById('addWishImage').textInput;

    db.collection('wishes').add({
        title: addedTitle.value,
        category: addedCategory.value,
        description: addedDescription.value,
        imageURL: addedImage.value,
        isGranted: false
    });

    addedTitle.value = '';
    addedCategory.value = '';
    addedDescription.value = '';
    addedImage.value = '';
})

db.collection('wishes').orderBy('category').onSnapshot( snapshot => {
    let changes = snapshot.docChanges();
    console.log(changes);
    changes.forEach( change => {
        if (change.type == 'added') {
            renderWish(change.doc);
        } else if (change.type == 'removed') {
            let li = wishList.querySelector('[data-id=' + change.doc.id + ']').parentNode;
            wishList.removeChild(li);
        } else if (change.type == 'modified') {
            let grantButton = wishList.querySelector('[data-id=' + change.doc.id + ']').grantButton;
            let grantRibon = wishList.querySelector('[data-id=' + change.doc.id + ']').grantedMark;
            grantButton.style.visibility='hidden';
            grantRibon.style.visibility='visible'
        }
    })
})

//getWishedFiltered();
