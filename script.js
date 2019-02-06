import wishCard from '/wishCard.js';

console.log(wishCard);

const wishList = document.getElementById('withList');
const addWishForm = document.getElementById('addWishForm');

function renderWish (doc) {
    let li = document.createElement('li');
    let card = document.createElement('wish-card');

    let title = document.createElement('span');
    let category = document.createElement('span');
    let description = document.createElement('span');

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

function getWishesAll () {
    db.collection('wishes').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderWish (doc);
        })
    })
}

function refreshWishes () {
    wishList.innerHTML = "";
    getWishesAll();
}

addWishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('wishes').add({
        title: addWishForm.wishTitle.value,
        category: addWishForm.wishCategory.value,
        description: addWishForm.wishDescription.value,
        imageURL: addWishForm.wishImage.value
    });

    addWishForm.wishTitle.value = '';
    addWishForm.wishCategory.value = '';
    addWishForm.wishDescription.value = '';
    addWishForm.wishImage.value = '';
    refreshWishes();
})

getWishesAll();