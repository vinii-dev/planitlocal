/**
 * @class
 * @extends {HTMLElement}
 */
class PlinHTMLElement extends HTMLElement {
  proeprties = ['title', 'description', 'dueAt']
  
  constructor() {
    super();
  }

  /**
   * Define o template do componente
   * @returns {string}
   */
  template() { }

  connectedCallback() {
    this.proeprties.forEach(property => {
      this[property] = this.getAttribute(property) || '';
    });

    this.render();
  }

  /**
   * Adiciona o template ao html do componente
   * @private
   */
  render() {
    this.innerHTML = this.template();
  }

  attributeChangedCallback() {
    this.render();
  }

  /**
   * 
   * @param {Array} data 
   * @param {Function} renderingFn 
   * @param {String} container 
   */
  renderMap(data, renderingFn, container = '') {
    /**
     * @type {HTMLElement}
     */
    let containerElm;

    if(container === '') containerElm = this;
    else containerElm = this.querySelector(container);

    containerElm.innerHTML = '';
    containerElm.innerHTML = data.map(renderingFn).join('\n');
  }
}

