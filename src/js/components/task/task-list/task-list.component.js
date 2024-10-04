/**
 * @class
 * @extends {PlinHTMLElement}
 */
class TaskList extends PlinHTMLElement {
  tasksDb;

  constructor() {
    super();

    this.tasksDb = namedDb('tasks');
  }

  template() {
    return `
      <section class="task-list-wrapper">
        <h1>Tarefas</h1>
        <input class="task-list-wrapper__add" placeholder="Adicionar nova tarefa" />
        <ul class="listing">
        </ul>
      </section>
    `;
  }

  async connectedCallback() {
    super.connectedCallback();

    this.listenEvents();
    setTimeout(() => {
      this.renderListing();
    });
  }

  listenEvents() {
    this.querySelector('input').addEventListener('keypress', async (event) => {
      const value = event.target.value.trim();

      if (event.key === 'Enter' && value !== "") {
        const item = { title: value, description: '', checked: false };
        const itemId = await this.tasksDb.add(item);
        const listing = this.querySelector('.listing');
        listing.innerHTML += '\n' + this.renderItem({ ...item, id: itemId });

        event.target.value = "";
      }
    });
  }

  renderItem({ title, description, id, checked }) {
    return `
        <plin-task-item title="${title}" description="${description}"></plin-task-item>
      `;
  }

  async renderListing() {
    const list = await this.tasksDb.getAll();

    this.renderMap(list, (item) => this.renderItem(item), '.listing');
  }
}

customElements.define('plin-task-list', TaskList);
