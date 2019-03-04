const textBoxTemplate = document.createElement('template');

textBoxTemplate.innerHTML = `
    <style>
        :host {
            position: relative;
            width: 100%;
        }
        
        .textBox {
            border: none;
            border-radius: 4px;
            box-shadow: 0 0 1px 2px rgba(0,0,0,0.1);
            box-sizing: border-box;
            font-size: 16px;
            padding: 8px 12px 8px;
            transition: box-shadow var(--transition-speed);
            width: 100%;
        }
        
        .textBox::placeholder {
            color: transparent;
        }
        
        .textBox:focus {
            box-shadow: 0 0 1px 2px rgba(0,0,0,0.5);
        }
        
        .textBox:focus ~ .textBoxLabel,
        .textBox:not(:placeholder-shown) ~ .textBoxLabel {
          transform: translate(0, -24px);
          color: var(--colorPrimary_dark);
          font-size: 12px;
          opacity: 1;
        }
        
        .textBoxLabel {
            position: absolute;
            left: 8px;
            bottom: 11px;
            background: white;
            color: var(--colorPrimary_light);
            cursor: text;
            font-size: 16px;
            opacity: 0.25;
            padding: 0 8px;
            transform: translate(0, 0);
            transition: transform var(--transition-speed), 
                        color var(--transition-speed), 
                        font-size var(--transition-speed),
                        opacity var(--transition-speed);
        }
    </style>
    <input type="text"
            placeholder="Enter"
            class="textBox" />
    <label class="textBoxLabel"></label>
`

export default class TextBox extends HTMLElement {
    constructor() {
        super();



        let textBoxInstance = textBoxTemplate.content.cloneNode(true);

        this.textInput = textBoxInstance.querySelector('.textBox');
        this.textLabel = textBoxInstance.querySelector('.textBoxLabel');

        this.attachShadow({mode: 'open'}).appendChild(textBoxInstance);
    }

    get inputID() { return this.getAttribute('id'); }
    get inputLabel() { return this.getAttribute('input-label'); }

    get inputValue() {
        if (this.getAttribute('input-value')) {
            return this.getAttribute('input-value')
        };
        return '';
    }

    static get observedAttributes() { return ["input-value","input-label","id"]; }

    attributeChangedCallback() {
        this.textInput.id = this.inputID;
        this.textLabel.setAttribute('for', this.inputID);
        this.textInput.value = this.inputValue;
        this.textLabel.textContent = this.inputLabel
    }

    connectedCallback() {

    }
}

customElements.define('text-box', TextBox);