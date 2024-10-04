/**
 * @class
 * @extends {PlinHTMLElement}
 */
class TaskItem extends PlinHTMLElement {
  proeprties = ['title', 'description', 'dueAt', 'id', 'checked'];

  template() {
    return `
      <div class="task-item ${this.checked === 'true' ? 'checked' : '' }">
        <div class="task-item-info">
          <input type="checkbox" ${this.checked === 'true' ? 'checked' : ''} class="task-item-info__checkbox">
          <div class="task-item-info-texts">
            <h2 contenteditable="true" class="task-item-info__title">
              ${this.title}
            </h2>
            <p contenteditable="true" class="task-item-info__description">${
              this.description || this.description !== ''
                ? this.description
                : "Sem descrição"
              }</p>
          </div>
          <div class="task-item-info__right">
            <input type="datetime-local" class="task-item-info__date" value="${this.dueAt}">
            <div class="trash-icon-wrapper">
              <i class="trash-icon fa-solid fa-trash"></i>
            </div>
          </div>
        </div>
      </div>
    `;

  }

  connectedCallback() {
    super.connectedCallback();
    const taskElm = this.querySelector('.task-item');
    const deleteElm = this.querySelector('.trash-icon-wrapper');
    const descriptionElm = this.querySelector('.task-item-info__description');
    const checkboxElm = this.querySelector('input[type="checkbox"');
    const titleElm = this.querySelector('.task-item-info__title');
    const dateElm = this.querySelector('.task-item-info__date');

    deleteElm
      .addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('delete', { detail: { id: +this.id.replace('task-', '') }, bubbles: true, composed: true }));
      })

    descriptionElm
      .addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
          descriptionElm.blur();
          e.preventDefault();
        }
      });

    descriptionElm
      .addEventListener('blur', () => {
        this.dispatchEvent(new CustomEvent('update', { detail: { id: +this.id.replace('task-', ''), description: descriptionElm.innerText }, bubbles: true, composed: true }));
      });

    checkboxElm.
      addEventListener('change', (e) => {
        const { checked } = e.target;
        this.dispatchEvent(new CustomEvent('update', { detail: { id: +this.id.replace('task-', ''), checked: checked }, bubbles: true, composed: true }));
        taskElm.classList.toggle('checked');
      });

    titleElm
      .addEventListener('keypress', (e) => {
        if(e.key === 'Enter') {
          titleElm.blur();
          e.preventDefault();
        }
      });


    titleElm
      .addEventListener('blur', () => {
        this.dispatchEvent(new CustomEvent('update', { detail: { id: +this.id.replace('task-', ''), title: titleElm.innerText }, bubbles: true, composed: true }));
      });

    dateElm
      .addEventListener('change', (e) => {
        this.dispatchEvent(new CustomEvent('update', { detail: { id: +this.id.replace('task-', ''), dueAt: dateElm.value }, bubbles: true, composed: true }));
      });
  }
}

customElements.define('plin-task-item', TaskItem);
