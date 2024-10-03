import { PlinHTMLElement } from "../../PlinHTMLElement.js";

/**
 * @class
 * @extends {PlinHTMLElement}
 */
class TaskItem extends PlinHTMLElement {
  css = '/js/components/task/task-item/task-item.style.css';

  static observedAttributes = ['title', 'description', 'dueAt'];
  proeprties = ['title', 'description', 'dueAt'];

  render() {
    return `
      <div class="task-item">
          <div class="task-item-info">
            <h2 class="task-item-info__title">${this.title}</h2>
            <span class="task-item-info__date">${this.dueAt}</span>
          </div>
          <div>

          </div>
      </div>
    `;
  }
}

customElements.define('plin-task-item', TaskItem);
