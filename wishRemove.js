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
            width: 420px;
        }
        
        header {
            margin-bottom: 36px;          
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
            margin-left: 100px;
            text-shadow: 0 0 1px #000;
        }
        
        h1 .highlighted {
            color: var(--colorSecondary_dark);
            text-shadow: 0 0 5px #fff;

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
            <header>
                <div class="illustration">
                    <img src="https://i1.wp.com/www.michaeljfoxdatabase.com/wp-content/gallery/2003-1014-interstate-60-a/still_I60_008_granted.jpg?resize=525%2C300">
                    <div class="illustration__frame"></div>        
                </div>
                <h1>
                    <span class="highlighted">Delete?</span>
                     Are you sure?</h1>
            </header>
            <p>
                Your wish will be deleted for good.
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