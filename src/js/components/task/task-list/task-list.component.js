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
        <section class="listing-wrapper" id="not-done">
          <h2>Não Feitos</h2>
          <ul class="listing">
          </ul>
        </section>
        <section class="listing-wrapper" id="done">
          <h2>Feitos</h2>
          <ul class="listing">
          </ul>
        <section>
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
        this.renderListing();

        event.target.value = "";
      }
    });
  }

  renderItem({ title, description, id, checked, dueAt }) {
    return `
      <plin-task-item title="${title}" id="task-${id}" dueAt="${dueAt}" checked="${checked}" description="${description}"></plin-task-item>
      `;
  }

  sortTasks(tasks) {
    return tasks.sort((a, b) => {
      const dueA = new Date(a.dueAt || Infinity);
      const dueB = new Date(b.dueAt || Infinity);

      if (dueA < dueB) return -1;
      if (dueA > dueB) return 1;
      return a.title.localeCompare(b.title);
    });
  }

  async renderListing() {
    const list = await this.tasksDb.getAll();

    const done = this.sortTasks(list.filter(task => task.checked));
    const notDone = this.sortTasks(list.filter(task => !task.checked));

    this.renderMap(notDone, (item) => this.renderItem(item), '#not-done .listing');
    this.renderMap(done, (item) => this.renderItem(item), '#done .listing');

    const plinTaskItems = this.querySelectorAll('plin-task-item');
    
    plinTaskItems.forEach((taskItem) => {
      taskItem.addEventListener('delete', (e) => this.handleDelete(e));
      taskItem.addEventListener('update', (e) => this.handleUpdate(e));
    });
  }

  handleDelete = async (event) => {
    const id = event.detail.id;

    await this.tasksDb.remove(id);
    await this.renderListing();
  }

  handleUpdate = async (event) => {
    const { id, ...obj } = event.detail;

    const task = await this.tasksDb.get(id);
    await this.tasksDb.update(id, { ...task, ...obj })
    await this.renderListing();
  }
}

customElements.define('plin-task-list', TaskList);
