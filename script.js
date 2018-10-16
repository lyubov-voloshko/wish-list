const wishList = document.getElementById('withList');
const addWishForm = document.getElementById('addWishForm');

function renderWish (doc) {
    let li = document.createElement('li');
    let title = document.createElement('span');
    let description = document.createElement('p');

    li.setAttribute('data-id', doc.id);
    li.classList.add('wish');

    title.classList.add('wish__title');
    description.classList.add('wish__description');

    title.textContent = doc.data().title;
    description.textContent = doc.data().description;

    li.appendChild(title);
    li.appendChild(description);

    wishList.appendChild(li);

}

db.collection('wishes').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        renderWish (doc);
    })
})

addWishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('wishes').add({
        title: addWishForm.wishTitle.value,
        description: addWishForm.wishDescription.value
    });

    addWishForm.wishTitle.value = '';
    addWishForm.wishDescription.value = '';
})