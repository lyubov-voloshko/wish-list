const ButtonTemplate = document.createElement('template');

ButtonTemplate.innerHTML = `
    <style>
        button {
            border-radius: 4px;
            height: 36px;
            font-size: 14px;
            text-transform: uppercase;
            padding: 0 20px;
        }
        
        .button_solid {
            background: var(--colorSecondary_dark);
            border: 1px solid var(--colorSecondary_dark);
            color: white;
            transition: background var(--transition-speed), 
                        border var(--transition-speed),
                        color var(--transition-speed);
        }
        
        .button_solid:hover {
            background: var(--colorSecondary_light);
            border: 1px solid var(--colorSecondary_light);
        }
        
        .button_outlined {
            background: transparent;
            border: 1px solid var(--colorSecondary_dark);
            color: var(--colorSecondary_dark);
        }
        
        .button_outlined:hover {
            color: var(--colorSecondary_light);
            border: 1px solid var(--colorSecondary_light);
        }
        
        .caption {
            text-transform: uppercase;
        }
        
    </style>
`

export default class Button extends HTMLElement {
    constructor() {
        super();

        let ButtonInstance = ButtonTemplate.content.cloneNode(true);

        let button = document.createElement('button');
        //button.id = 'app-button';
        if (this.getType) button.type = this.getType;
        button.textContent = this.getCaption;
        button.classList.add(`button_${this.buttonAppearance}`);
        this.appendChild(button);

        this.button = button;

        this.appendChild(ButtonInstance);
    }

    //get getID() { return this.getAttribute('button-id'); }
    get getCaption() {return this.getAttribute('caption');}
    get getType() { return this.getAttribute('type'); }
    get buttonAppearance() { return this.getAttribute('appearance'); }

    static get observedAttributes() { return ["appearance","type","id"]; }

    attributeChangedCallback() {
    }

    connectedCallback() {
    }
}

customElements.define('app-button', Button);
