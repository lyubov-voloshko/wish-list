const wishList = document.getElementById('withList');
const addWishForm = document.getElementById('addWishForm');

function renderWish (doc) {
    let li = document.createElement('li');
    let title = document.createElement('span');
    let category = document.createElement('span');
    let description = document.createElement('p');
    let deleteButton = document.createElement('button');

    li.setAttribute('data-id', doc.id);
    li.classList.add('wish');

    title.classList.add('wish__title');
    category.classList.add('wish__category');
    description.classList.add('wish__description');
    deleteButton.classList.add('wish__delete');

    title.textContent = doc.data().title;
    category.textContent = doc.data().category;
    description.textContent = doc.data().description;
    deleteButton.textContent = 'remove';

    li.appendChild(title);
    li.appendChild(category);
    li.appendChild(description);
    li.appendChild(deleteButton);

    wishList.appendChild(li);

    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('wishes').doc(id).delete();
    })

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
        category: addWishForm.wishCategory.value,
        description: addWishForm.wishDescription.value
    });

    addWishForm.wishTitle.value = '';
    addWishForm.wishCategory.value = '';
    addWishForm.wishDescription.value = '';
})