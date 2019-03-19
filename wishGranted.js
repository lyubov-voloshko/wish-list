const wishGrantTemplate = document.createElement('template');

wishGrantTemplate.innerHTML = `
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
            margin-bottom: 36px;          
        }
        
        .illustration {
            position: relative;
            display: block;
            width: 240px;
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
            margin-left: 136px;
            opacity: 0.99;
            text-shadow: 0 0 1px #000;
        }
        
        h1 .highlighted {
            color: var(--colorSecondary_dark);
            text-shadow: 0 0 5px #fff;

        }
        
        p {
            flex: 1 0 auto;
            margin-right: 8px;
        }
        
        .grantedBy, .grantOn {
            display: flex;
            align-items: center;
            margin: 8px 0;
        }
        
        .dialog__giver {
            margin-left: 8px;
        }
        
        .dialog__cancel {
            margin-right: 8px;
        }
    </style>
    <header class="screenWrapper">
        <div id="veil" class="screenWrapper__veil"></div>
        <form id="wishGranted" class="dialog">
           
            <header>
                <div class="illustration">
                    <img src="https://m.media-amazon.com/images/M/MV5BYzYyNThhNTQtZmQwNy00OTExLThmNGUtOTk1NzM0YWEzYTQ3XkEyXkFqcGdeQXVyMjAxMTI4Njc@._V1_.jpg">
                    <div class="illustration__frame"></div>        
                </div>
                <h1>
                    <span class="highlighted">Grant!</span>
                     One Wish</h1>
            </header>
            
            
            <div class="grantedBy">
                <p>It was granted</p>
                <select id="grantHelper">
                    <option>by me</option>
                    <option>by</option>
                    <option>with the help of</option>
                </select>
                <text-box id="grantPerson" input-label="person name" class="dialog__giver"></text-box>
            </div>
            <div class="grantOn">
                <p>on</p>
                <text-box id="grantDate" input-label="date and occasion" class="dialog__title"></text-box>
            </div>        
           
            <div class="actions">
                <app-button class="dialog__cancel"
                    id="cancelButton"
                    appearance="outlined"
                    caption="cancel">
                </app-button>
                <app-button
                    id="buttonGrant"
                    type="submit"
                    appearance="solid"
                    caption="grant">
                </app-button>

            </div>
        </form>
    </div>    
`

export default class WishGrant extends HTMLElement {
    constructor() {
        super();

        let wishGrantInstance = wishGrantTemplate.content.cloneNode(true);

        this.veil = wishGrantInstance.getElementById('veil');
        this.editForm = wishGrantInstance.getElementById('wishEdit');
        this.grantPerson = wishGrantInstance.getElementById('grantPerson');
        this.grantDate = wishGrantInstance.getElementById('grantDate');
        this.helpOptions = wishGrantInstance.getElementById('grantHelper').querySelectorAll('option');

        this.cancelButton = wishGrantInstance.getElementById('cancelButton');


        this.attachShadow({mode: 'open'}).appendChild(wishGrantInstance);
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

        this.veil.addEventListener('click', () => { this.handleCloseGrant(); });
        this.cancelButton.addEventListener('click', () => { this.handleCloseGrant(); });
        this.editForm.addEventListener('submit', (e) => { this.handleSubmit(e); });
    }

    handleCloseGrant() {
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

customElements.define('wish-grant', WishGrant);