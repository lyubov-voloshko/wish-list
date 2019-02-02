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

class WishCard extends HTMLElement {
    constructor() {
        super();
        let shadowWishCard = document.getElementById('wish-card').content.cloneNode(true);

        this.image = shadowWishCard.getElementById('wishImage');
        this.removeButton = shadowWishCard.getElementById('removeWish');

        this.attachShadow({mode: 'open'}).appendChild(shadowWishCard);
    }

    get imageURL() {
        return this.getAttribute('data-image');
    }

    connectedCallback() {
        this.removeButton.addEventListener('click', (e) => {
            this.removeWish(e);
        });
        this.image.style.backgroundImage = `url(${this.imageURL}`;

    }

    removeWish(e) {
        e.stopPropagation();
        let id = this.getAttribute('data-id');
        console.log('deleted id: ' + id);
        db.collection('wishes').doc(id).delete();
        refreshWishes();
    }
}

customElements.define('wish-card', WishCard);

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