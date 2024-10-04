/**
 * @class
 * @extends {PlinHTMLElement}
 */
class Sidebar extends PlinHTMLElement {
  template() {
    console.log(this.children);

    return `
      <nav class="sidebar">
        <a class="logo">PlanItLocal</a>
        <hr >
        <ul>
          <li class="nav-item">
            <i class="fa-solid fa-list-check"></i>
            <span>Lista de tarefas</span>
          </li>
          <li class="nav-item">
            <i class="fa-solid fa-calendar-day"></i>
            <span>Eventos</span>
          </li>
        </ul>
      </nav>
    `;
  }
}

customElements.define('plin-sidebar', Sidebar);
