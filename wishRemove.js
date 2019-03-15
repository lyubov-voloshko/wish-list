const wishRemoveTemplate = document.createElement('template');

wishRemoveTemplate.innerHTML = `
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
            padding: 20px 24px;
            width: 280px;
        }
        
        .dialog__cancel {
            margin-right: 8px;
        }
        
        p {
            color: #666;
            line-height: 1.5em;
            margin-bottom: 20px;
            margin-top: 0;
        }
        
    </style>
    <div class="screenWrapper">
        <div id="veil" class="screenWrapper__veil"></div>
        <form class="dialog">
            <p>
                The wish will be deleted. <br/>
                Are you sure?
            </p>
            <app-button class="dialog__cancel"
                id="buttonCancel"
                button-name="cancel-button"
                appearance="outlined"
                caption="cancel">
            </app-button>
            <app-button 
                id="buttonRemove"
                type="button"
                appearance="solid"
                caption="remove">
            </app-button>
        </form>
    </div>    
`

export default class WishRemove extends HTMLElement {
    constructor() {
        super();

        let wishRemoveInstance = wishRemoveTemplate.content.cloneNode(true);

        this.veil = wishRemoveInstance.getElementById('veil');
        this.cancelButton = wishRemoveInstance.getElementById('buttonCancel');
        this.removeButton = wishRemoveInstance.getElementById('buttonRemove');

        this.attachShadow({mode: 'open'}).appendChild(wishRemoveInstance);
    }

    get wishID() { return this.getAttribute('data-id'); }

    static get observedAttributes() { return ["data-id"]; }

    connectedCallback() {

        this.veil.addEventListener('click', () => { this.handleCloseRemove(); });
        this.cancelButton.addEventListener('click', () => { this.handleCloseRemove(); });
        this.removeButton.addEventListener('click', (e) => { this.handleRemove(e); });
    }

    handleCloseRemove() {
        document.body.removeChild(this);
    }

    handleRemove(e) {
        e.stopPropagation();

        console.log('deleted id: ' + this.wishID);
        db.collection('wishes').doc(this.wishID).delete().then( () => {
            console.log("Document successfully deleted!");
            this.handleCloseRemove();
        }).catch(function(error) {
            console.error("Error: ", error);
        });
    }

}

customElements.define('wish-remove', WishRemove);