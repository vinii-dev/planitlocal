/**
 * @class
 * @extends {PlinHTMLElement}
 */
class Sidebar extends PlinHTMLElement {
  template() {
    const pathFind = /^.*planitlocal.*\/src/;
    const root = pathFind.exec(window.location.href)[0];

    return `
      <nav class="sidebar">
        <header>
          <a class="logo">PlanItLocal</a>
        </header>
        <hr >
        <ul>
          <li class="nav-item">
            <a href="${root}/tasks/listing.html">
              <i class="fa-solid fa-list-check"></i>
              <span>Lista de tarefas</span>
            </a>
          </li>
          <li class="nav-item">
            <a href="${root}/events/listing.html">
              <i class="fa-solid fa-calendar-day"></i>
              <span>Eventos</span>
            </a>
          </li>
        </ul>
      </nav>
    `;
  }
}

customElements.define('plin-sidebar', Sidebar);
