class PriceTable extends HTMLElement {
  constructor() {
    // call super method
    super();

    // Creates shadow root
    this.attachShadow({ mode: "open" });

    // Create template element
    this.template = document.createElement("template");

    // Create template strcture
    this.template.innerHTML = `
    <style>
    :host {
      display: block; /* by default, custom elements are display: inline */
      contain: content; /* CSS containment FTW. */
      background: blue;
    }
    
      button {
        color: red;
      }
  
    </style>

    <button>Sup?</button>
    `;
    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector("p").innerText = this.getAttribute("name");
    const button = this.shadowRoot.querySelector("button");
    button.addEventListener("click", this.handleClick);
  }
}

window.customElements.define("cove-markets-price-table", PriceTable);

module.exports = { PriceTable };
