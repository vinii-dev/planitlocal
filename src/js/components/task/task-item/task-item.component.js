/**
 * @class
 * @extends {PlinHTMLElement}
 */
class TaskItem extends PlinHTMLElement {
  static observedAttributes = ['title', 'description', 'dueAt'];
  proeprties = ['title', 'description', 'dueAt'];

  template() {
    return `
      <div class="task-item">
        <div class="task-item-info">
          <input type="checkbox" class="task-item-info__checkbox">
          <div class="task-item-info-texts">
            <h2 class="task-item-info__title">${this.title}</h2>
            <p class="task-item-info__description">${this.description ?? "Sem descrição"}</p>
          </div>
          <span class="task-item-info__date">${this.dueAt}</span>
        </div>
      </div>
    `;
  }
}

customElements.define('plin-task-item', TaskItem);
