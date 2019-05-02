const wishEditTemplate = document.createElement('template');

wishEditTemplate.innerHTML = `
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
        
        .screenWrapper {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
        }
        
        .screenWrapper__veil {
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
            padding: 40px 32px;
            width: 600px;
        }
        
        header {
            margin-bottom: 44px;          
        }
        
        .illustration {
            position: relative;
            display: block;
            width: 224px;
        }
        
        .illustration__frame {
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            background: linear-gradient(white, transparent 25%),
            linear-gradient(-90deg, white, transparent 25%),
            linear-gradient(360deg, white, transparent 25%),
            linear-gradient(90deg, white, transparent 25%);
            margin-top: -1px;
            height: 100%;
            width: 100%;
        }
        
        img {
            filter: sepia(1) hue-rotate(320deg) opacity(0.75);
            width: 100%;
        }
        
        h1 {
            margin-top: -44px;
            opacity: 0.99;
            margin-left: 108px;
            text-shadow: 0 0 1px #000;
        }
        
        h1 .highlighted {
            color: var(--colorSecondary_dark);
            text-shadow: 0 0 5px #fff;

        }
        
        fieldset {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            border: none;
            margin-bottom: 12px;
            padding: 0;
        }
        
        .dialog__title {
            display: block;
            margin: 12px 0;
            width: 50%;
        }
        
        .dialog__textBox {
            display: block;
            margin: 12px 0;
            width: 100%;
        }
        
        .dialog__cancel {
            margin-right: 8px;
        }
    </style>
    <div class="screenWrapper">
        <div id="veil" class="screenWrapper__veil"></div>
        <form id="wishEdit" class="dialog">
            
            <header>
                <div class="illustration">
                    <img src="https://m.media-amazon.com/images/M/MV5BZTgxMWU0MTItMzdmNC00OTAyLTgxN2ItOWFlYjkyOWEyNTIwXkEyXkFqcGdeQXVyMzE2MzgxNDk@._V1_.jpg">
                    <div class="illustration__frame"></div>        
                </div>
                <h1>
                    <span class="highlighted">Specify!</span>
                     It's important</h1>
            </header>
            
            <fieldset>
                <text-box id="editWishTitle" input-label="name of wish" class="dialog__title"></text-box>
                <select id="editWishSelect">
                    <option>book</option>
                    <option>clothes</option>
                    <option>food</option>
                    <option>item</option>
                    <option>job</option>
                    <option>travelling</option>
                </select>
                <text-box id="editWishDescription" input-label="short description" class="dialog__textBox"></text-box>
                <text-box id="editWishImage" input-label="url of picture" class="dialog__textBox"></text-box>
            </fieldset>
            
            
            <div class="actions">
                <app-button class="dialog__cancel"
                    type="button"
                    id="cancelButton"
                    appearance="outlined"
                    caption="cancel">
                </app-button>
                <app-button
                    id="buttonEdit"
                    type="submit"
                    appearance="solid"
                    caption="edit">
                </app-button>

            </div>
        </form>
    </div>    
`

export default class WishEdit extends HTMLElement {
    constructor() {
        super();

        let wishEditInstance = wishEditTemplate.content.cloneNode(true);

        this.veil = wishEditInstance.getElementById('veil');
        this.editForm = wishEditInstance.getElementById('wishEdit');
        this.titleInput = wishEditInstance.getElementById('editWishTitle');
        this.categorySelect = wishEditInstance.getElementById('editWishSelect');
        this.categoryOptions = wishEditInstance.getElementById('editWishSelect').querySelectorAll('option');
        this.descriptionInput = wishEditInstance.getElementById('editWishDescription');
        this.imageInput = wishEditInstance.getElementById('editWishImage');
        this.cancelButton = wishEditInstance.getElementById('cancelButton');


        this.attachShadow({mode: 'open'}).appendChild(wishEditInstance);
    }

    get wishID() { return this.getAttribute('data-id'); }

    async connectedCallback() {
        try {
            const wish = await db.collection('wishes').doc(this.wishID).get();

            if (wish.exists) {
                console.log("Wish for editing:", wish.data());
            } else {
                console.log("No such document!");
            };

            this.wish = wish;
        } catch (error) {
            console.log("Error getting document:", error);
        }

        this.titleInput.setAttribute('input-value', this.wish.data().title);
        this.categoryOptions.forEach((option) => {
            if (option.innerHTML === this.wish.data().category) {
                option.selected = "selected"
            }
        });
        this.descriptionInput.setAttribute('input-value', this.wish.data().description);
        this.imageInput.setAttribute('input-value', this.wish.data().imageURL);

        this.veil.addEventListener('click', () => { this.handleCloseEdit(); });
        this.cancelButton.addEventListener('click', () => { this.handleCloseEdit(); });
        this.editForm.addEventListener('submit', (e) => { this.handleSubmit(e); });
    }

    handleCloseEdit() {
        document.body.removeChild(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        let editedTitle = this.titleInput.textInput;
        let editedCategory = this.categorySelect.value;
        let editedDescription = this.descriptionInput.textInput;
        let editedImage = this.imageInput.textInput;

        console.log(`submitted wish id: ${this.wishID}`);
        console.log(`submitted wish image url: ${editedImage.value}`);

        //debugger;

        db.collection('wishes').doc(this.wishID).update({
            title: editedTitle.value,
            category: editedCategory,
            description: editedDescription.value,
            imageURL: editedImage.value,
            isGranted: false
        }).then(() => {
            console.log("Document successfully edited!");
            this.handleCloseEdit();
        }).catch(function(error) {
            console.error("Error: ", error);
        });
    }

}

customElements.define('wish-edit', WishEdit);
