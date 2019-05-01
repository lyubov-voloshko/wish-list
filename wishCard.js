import WishEdit from '/wishEdit.js';
import WishRemove from '/wishRemove.js';
import WishGrant from '/wishGrant.js';

const wishCardTemplate = document.createElement('template');

wishCardTemplate.innerHTML = `
    <style>
        :host {
            position: relative;
            display: flex;            
            border-radius: 12px;
            box-shadow: 0 0 5px 1px #0000001a;
            height: 100%;
            overflow: hidden;
            padding: 8px;
        }
        
        .granted {
            position: absolute;
            background: var(--colorComplementary) ;
            border: 2px solid var(--colorSecondary_dark);
            padding: 8px;
            transform: translate(-48px, 8px) rotate(-45deg);
            width: 120px;
            text-align: center;
            text-transform: uppercase;
            font-size: 12px;
        }

        #wishImage {
            background-size: cover;
            background-position: center center;
            border-radius: 8px 0 0 8px;
            height: 100%;
            margin-right: 8px;
            min-width: 50%;
            width: 50%;
        }
        
        .wishInfo {
            flex: 1 1 auto;
            display: grid;
            grid-template-columns: 1fr auto;
            grid-template-rows: 1fr auto;
        }
        
        .info {
            flex: 1 1 auto;
        }

        .category {
            display: block;
            color: #888;
            font-size: 12px;
            letter-spacing: 0.15em;
            margin: 4px 0;
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
            flex-direction: column;
            align-items: flex-end;
            justify-content: space-between;
        }
        
        .actions__notGranted {
            display: flex;
            align-items: flex-end;
            flex-direction: column;
            gap: 8px;
        }
        
        .button_primary {
            //position: absolute;
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
            transition: background 300ms;
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
            transition: text-shadow 300ms, color 300ms;
        }

        .button_secondary:hover {
            color: #333;
            text-shadow: 0.5px 0 0 #333;
        }
        
        .gratitude {
            grid-column: 1 / span 2;
            align-items: center;
            background: var(--colorComplementary);
            padding: 8px 8px;
            border-radius: 0 0 8px 0;
        }
    </style>
    <div id="grantedMark" class="granted">granted</div>
    <div id="wishImage" role="img"></div>
    <div class="wishInfo">
        <div class="info">      
        <slot name="category" class="category">category</slot>
        <h1><slot name="title">Name of wish</slot></h1>
        <div class="description">
            <slot name="description">Wish description</slot>
            <div class="description__veil"></div>
        </div>
        </div>
        <div class="actions">
            <div id="actions" class="actions__notGranted">
                <button type="button" id="grantWish" class="button_primary">grant</button>  
                <button type="button" id="editWish" class="button_secondary">edit</button>
            </div>
            <button type="button" id="removeWish" class="button_secondary">remove</button>
        </div>
        <div id="gratitude" class="gratitude">
            The wish was granted 
            <slot name="grantHelper"></slot>
            <slot name="grantPerson"></slot>
            <slot name="grantDate"></slot>
        </div>
    </div>
`

export default class WishCard extends HTMLElement {
    constructor() {
        super();

        let wishCardInstance = wishCardTemplate.content.cloneNode(true);

        this.image = wishCardInstance.getElementById('wishImage');
        this.grantedMark = wishCardInstance.getElementById('grantedMark');
        this.grantButton = wishCardInstance.getElementById('grantWish');
        this.actions = wishCardInstance.getElementById('actions');
        this.editButton = wishCardInstance.getElementById('editWish');
        this.removeButton = wishCardInstance.getElementById('removeWish');
        this.gratitude = wishCardInstance.getElementById('gratitude');

        this.removeDialog = wishCardInstance.getElementById('remove-dialog');

        this.attachShadow({mode: 'open'}).appendChild(wishCardInstance);
    }

    get wishId() { return this.getAttribute('data-id'); }
    get imageURL() { return this.getAttribute('data-image'); }

    connectedCallback() {
        this.removeButton.addEventListener('click', (e) => { this.openWishRemove(e); });
        this.editButton.addEventListener('click', (e) => { this.openWishEdit(e); });
        this.grantButton.addEventListener('click', (e) => { this.openWishGrant(e); });

        if (this.getAttribute('data-granted') === 'true') {
            this.grantButton.style.visibility='hidden'
            this.actions.style.display = 'none';
            this.gratitude.style.display = 'block';
        } else {
            this.grantedMark.style.visibility='hidden'
            this.actions.style.display = 'flex';
            this.gratitude.style.display = 'none';
        };

        this.image.style.backgroundImage = `url(${this.imageURL}`;

    }

    openWishEdit() {
        let editDialog = document.createElement('wish-edit');
        editDialog.setAttribute('data-id', this.wishId);
        document.body.appendChild(editDialog);
    }

    openWishRemove() {
        let removeDialog = document.createElement('wish-remove');
        removeDialog.setAttribute('data-id', this.wishId);
        document.body.appendChild(removeDialog);
    }

    openWishGrant() {
        let grantDialog = document.createElement('wish-grant');
        grantDialog.setAttribute('data-id', this.wishId);
        document.body.appendChild(grantDialog);
    }

    grantWish() {
        let id = this.getAttribute('data-id');
        db.collection('wishes').doc(id).update({
            isGranted: true
        })
    }
}

customElements.define('wish-card', WishCard);
