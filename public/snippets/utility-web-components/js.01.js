customElements.define('snippet-test', class extends HTMLElement {
    connectedCallback() {
        this.querySelector('p').textContent = "Modified from js snippet"
    }
})