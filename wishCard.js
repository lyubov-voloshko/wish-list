import WishEdit from '/wishEdit.js';
import WishRemove from '/wishRemove.js';

const wishCardTemplate = document.createElement('template');

wishCardTemplate.innerHTML = `
    <style>
        :host {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;            
            border-radius: 12px;
            box-shadow: 0 0 12px 3px #0000001a;
            height: 100%;
            overflow: hidden;
            padding: 8px;
        }
        
        .granted {
            position: absolute;
            background: var(--colorSecondary_dark) ;
            //border: 1px solid var(--colorSecondary_dark);
            padding: 8px;
            color: white;
            transform: translate(-48px, 8px) rotate(-45deg);
            width: 120px;
            text-align: center;
            text-transform: uppercase;
            font-size: 12px;
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
            color: var(--colorPrimary_dark);
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
            background: var(--colorComplementary);
            border-radius: 0 0 8px 8px;
            padding: 8px;
        }
        
        .button_primary {
            position: absolute;
            top: 180px;
            right: 8px;
            background: var(--colorSecondary_dark);
            border: none;
            border-radius: 4px;
            color: #fff;
            font-size: 14px;
            line-height: 32px;
            text-transform: uppercase;
            width: 80px;
        }
        
        .button_primary:hover {
            background: var(--colorSecondary_light);
        }

        .button_secondary {
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

        .button_secondary:hover {
            background: var(--colorSecondary_light);
            color: white;
        }
        
        #removeDialog {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
        }
        
        .removeDialog__veil {
            position: fixed;
            top: 0;
            left: 0;
            background: black;
            opacity: 0.5;
            height: 100vh;
            width: 100vw;
        }
        
        .dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 8px;
            height: 320px;
            padding: 40px 32px;
            width: 480px;
        }
    </style>
    <div>
        <div id="grantedMark" class="granted">granted</div>
        <div id="wishImage" role="img"></div>
        <button type="button" id="grantWish" class="button_primary">grant</button>        
        <slot name="category" class="category">category</slot>
    </div>
    <h1><slot name="title">Name of wish</slot></h1>
    <div class="description">
        <slot name="description">Wish description</slot>
        <div class="description__veil"></div>
    </div>
    <div class="actions">
        <button type="button" id="opentWish" class="button_secondary">open</button>
        <button type="button" id="editWish" class="button_secondary">edit</button>
        <button type="button" id="removeWish" class="button_secondary">remove</button>
    </div>
    
    <template id="remove-dialog">
        <div id="veil" class="removeDialog__veil"></div>
        <div id="" class="dialog">
            <p>
                The wish will be deleted. <br/>
                Are you sure?
            </p>
            <button class="button button_outlined">cancel</button>
            <button class="button button_solid">delete</button>
        </div>
    </template>
`

export default class WishCard extends HTMLElement {
    constructor() {
        super();

        let wishCardInstance = wishCardTemplate.content.cloneNode(true);

        this.image = wishCardInstance.getElementById('wishImage');
        this.grantedMark = wishCardInstance.getElementById('grantedMark');
        this.grantButton = wishCardInstance.getElementById('grantWish');
        this.editButton = wishCardInstance.getElementById('editWish');
        this.removeButton = wishCardInstance.getElementById('removeWish');

        this.removeDialog = wishCardInstance.getElementById('remove-dialog');

        this.attachShadow({mode: 'open'}).appendChild(wishCardInstance);
    }

    get wishId() { return this.getAttribute('data-id'); }
    get imageURL() { return this.getAttribute('data-image'); }

    connectedCallback() {
        this.removeButton.addEventListener('click', (e) => { this.openWishRemove(e); });
        this.editButton.addEventListener('click', (e) => { this.openWishEdit(e); });
        this.grantButton.addEventListener('click', (e) => { this.grantWish(e); });

        if (this.getAttribute('data-granted') === 'true') {
            this.grantButton.style.visibility='hidden'
        } else {
            this.grantedMark.style.visibility='hidden'
        };

        this.image.style.backgroundImage = `url(${this.imageURL}`;

    }

    openWishEdit() {
        let editDialog = document.createElement('wish-edit');
        editDialog.setAttribute('data-id', this.wishId);
        document.body.appendChild(editDialog);
    }

    removeWish(e) {
        e.stopPropagation();
        let id = this.getAttribute('data-id');
        console.log('deleted id: ' + id);
        db.collection('wishes').doc(id).delete();
    }

    openWishRemove(){
        let removeDialog = document.createElement('wish-remove');
        removeDialog.setAttribute('data-id', this.wishId);
        document.body.appendChild(removeDialog);
    }

    grantWish() {
        let id = this.getAttribute('data-id');
        db.collection('wishes').doc(id).update({
            isGranted: true
        })
    }
}

customElements.define('wish-card', WishCard);