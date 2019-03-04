const ButtonTemplate = document.createElement('template');

ButtonTemplate.innerHTML = `
    <style>
        ::slotted(span) {
            
            border-radius: 4px;
            height: 42px;
            font-size: 14px;
            padding: 0 20px;
        }
        .button {
            border-radius: 4px;
            height: 42px;
            font-size: 14px;
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
    <slot name="caption" class="caption"></slot>
`

export default class Button extends HTMLButtonElement {
    constructor() {
        super();



        let ButtonInstance = ButtonTemplate.content.cloneNode(true);

        this.button = ButtonInstance.querySelector('.button');
        this.caption = ButtonInstance.getElementById('.caption');
        this.textLabel = ButtonInstance.querySelector('.textBoxLabel');

        this.appendChild(ButtonInstance);
    }

    get inputID() { return this.getAttribute('id'); }
    get buttonType() { return this.getAttribute('type'); }
    get buttonAppearance() { return this.getAttribute('button-appearance'); }

    static get observedAttributes() { return ["button-appearance","type","id"]; }

    attributeChangedCallback() {

        this.type = this.buttonType;
        if (this.buttonAppearance === "solid") {this.button.classList.add('button_solid');}
        if (this.buttonAppearance === "outlined") {this.button.classList.add('button_outlined');}
    }

    connectedCallback() {

    }
}

customElements.define('app-button', Button, { extends: 'button' });