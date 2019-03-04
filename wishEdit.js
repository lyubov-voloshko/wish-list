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
            height: 320px;
            padding: 40px 32px;
            width: 480px;
        }
        
        .dialog__title {
            display: block;
            margin: 0 auto;
            width: 50%;
        }
        
        .dialog__textBox {
            display: block;
            margin: 20px 0;
            width: 100%;
        }
    </style>
    <div class="screenWrapper">
        <div class="screenWrapper__veil"></div>
        <div class="dialog">
            <text-box id="wishTitle" input-label="name of wish" class="dialog__title"></text-box>
            <select id="wishCategory">
                <option>book</option>
                <option>clothes</option>
                <option>food</option>
                <option>item</option>
                <option>job</option>
                <option>travelling</option>
            </select>
            <text-box id="wishDescription" input-label="short description" class="dialog__textBox"></text-box>
            <text-box id="imageURL" input-label="url of picture" class="dialog__textBox"></text-box>
            
            <div class="actions">
            
            </div>
        </div>
`

export default class WishEdit extends HTMLElement {
    constructor() {
        super();



        let wishEditInstance = wishEditTemplate.content.cloneNode(true);

        this.titleInput = wishEditInstance.getElementById('wishTitle');
        this.categoryOptions = wishEditInstance.getElementById('wishCategory').querySelectorAll('option');
        this.categoryOptions.forEach((option) => { console.log(option.innerHTML) });
        console.log(this.categoryOptions);
        this.descriptionInput = wishEditInstance.getElementById('wishDescription');
        this.imageInput = wishEditInstance.getElementById('imageURL');


        this.attachShadow({mode: 'open'}).appendChild(wishEditInstance);
    }

    get wishID() { return this.getAttribute('data-id'); }

    async connectedCallback() {
        try {
            const wish = await db.collection('wishes').doc(this.wishID).get();

            if (wish.exists) {
                console.log("Document data:", wish.data());
            } else {
                console.log("No such document!");
            };

            this.wish = wish;
            console.log(`this.wish: ${this.wish.data().imageURL}`);
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
    }

}

customElements.define('wish-edit', WishEdit);