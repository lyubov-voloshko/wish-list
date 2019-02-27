const textBoxTemplate = document.createElement('template');

textBoxTemplate.innerHTML = `
    <style>
        :host {
            --colorPrimary_dark: teal;
            --colorPrimary_light: cadetblue;
            --colorSecondary_dark: indianred;
            --colorSecondary_light: salmon;
            --colorComplementary: palegoldenrod;
            position: relative;
            width: 100%;
        }
        
        .textBox {
            border: none;
            border-radius: 4px;
            box-shadow: 0 0 1px 2px rgba(0,0,0,0.1);
            box-sizing: border-box;
            font-size: 16px;
            margin-top: 12px;
            margin-bottom: 12px;
            padding: 8px 12px 8px;
            transition: box-shadow 500ms;
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
        }
        
        .textBoxLabel {
            position: absolute;
            left: 8px;
            bottom: 22px;
            background: white;
            color: var(--colorPrimary_light);
            cursor: text;
            font-size: 16px;
            padding: 0 8px;
            transform: translate(0, 0);
            transition: transform 1s, color 1s, font-size 1s;
        }
    </style>
    <div>
        <input type="text"
            name="textBox"
            placeholder="Enter"
            class="textBox" />
        <label class="textBoxLabel"></label>
    </div>
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
    get inputName() { return this.getAttribute('name'); }
    get inputValue() {
        if (this.getAttribute('input-value')) {
            return this.getAttribute('input-value')
        };
        return '';
    }

    static get observedAttributes() { return ["input-value","input-label","id"]; }

    attributeChangedCallback() {

        console.log(`attributeChangedCallback: input value: ${this.inputValue}`);

        this.textInput.id = this.inputID;
        this.textLabel.setAttribute('for', this.inputID);
        this.textInput.value = this.inputValue;
        this.textLabel.textContent = this.inputLabel
    }

    connectedCallback() {

        console.log(`value for text input: ${this.inputValue}`);
        this.textInput.name = this.inputName;
    }
}

customElements.define('text-box', TextBox);