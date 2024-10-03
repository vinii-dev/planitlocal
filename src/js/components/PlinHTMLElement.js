/**
 * @class
 * @extends {HTMLElement}
 */
export class PlinHTMLElement extends HTMLElement {
  proeprties = ['title', 'description', 'dueAt']
  /**
   * @type {string|null}
   */
  css = null;


  constructor() {
    super();
  }

  /**
   * 
   */
  render() { }

  connectedCallback() {
    this.proeprties.forEach(property => {
      this[property] = this.getAttribute(property) || '';
    });

    const template = this.render();
    this.innerHTML = template;
  }

  attributeChangedCallback() {
    this.innerHTML = '';
    this.render();
  }
}

