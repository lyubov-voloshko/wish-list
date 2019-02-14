const wishCardTemplate = document.createElement('template');

wishCardTemplate.innerHTML = `
    <style>
        :host {
            display: flex;
            flex-direction: column;
            justify-content: space-between;            border-radius: 12px;
            box-shadow: 0 0 12px 3px #0000001a;
            height: 100%;
            padding: 8px;
        }

        #wishImage {
            background-size: cover;
            background-position: center center;
            border-radius: 12px 12px 0 0;
            height: 180px;
            width: 100%;
        }

        .category {
            display: block;
            color: #888;
            font-size: 12px;
            letter-spacing: 0.15em;
            margin: 8px 0 4px;
            text-transform: uppercase;
        }

        h1 {
            color: cornflowerblue;
            font-family: 'Averia Serif Libre', cursive;
            font-weight: 400;
            font-size: 1.75em;
            line-height: 1.1em;
            margin: 16px 0 8px;
            text-transform: capitalize;
        }

        .description {
            position: relative;
            display: block;
            color: #666;
            font-size: 14px;
            height: 48px;
            line-height: 1.25em;
            margin: 8px 0;
            overflow: hidden;
        }

        .description__veil {
            position: absolute;
            bottom: 0;
            background: linear-gradient(transparent, white);
            height: 20px;
            width: 100%;
        }

        .actions {
            display: flex;
            justify-content: space-between;
            background: #f3f3f3;
            border-radius: 0 0 8px 8px;
            padding: 8px;
        }

        button {
            background: transparent;
            border: none;
            border-radius: 4px;
            color: #666;
            font-size: 12px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            padding: 2px 4px;
            transition: background 300ms, color 300ms;
        }

        button:hover {
            background: #6495ED88;
            color: white;
        }
    </style>
    <div>
        <div id="wishImage" role="img"></div>
        <slot name="category" class="category">category</slot>
    </div>
    <h1><slot name="title">Name of wish</slot></h1>
    <div class="description">
        <slot name="description">Wish description</slot>
        <div class="description__veil"></div>
    </div>
    <div class="actions">
        <button type="button" id="openWish">open</button>
        <button type="button" id="editWish">edit</button>
        <button type="button" id="removeWish">remove</button>
    </div>
`

export default class WishCard extends HTMLElement {
    constructor() {
        super();

        let wishCardInstance = wishCardTemplate.content.cloneNode(true);

        this.image = wishCardInstance.getElementById('wishImage');
        this.removeButton = wishCardInstance.getElementById('removeWish');

        this.attachShadow({mode: 'open'}).appendChild(wishCardInstance);
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
    }
}

customElements.define('wish-card', WishCard);