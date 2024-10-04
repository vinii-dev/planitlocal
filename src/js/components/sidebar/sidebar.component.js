/**
 * @class
 * @extends {PlinHTMLElement}
 */
class Sidebar extends PlinHTMLElement {
  template() {
    const pathFind = /^.*planitlocal.*\/src/;
    const root = pathFind.exec(window.location.href)[0];

    return `
      <div class="sidebar">
        <header>
          <a class="logo" href="${root}/index.html">PlanItLocal</a>
        </header>
        <hr >
        <nav class="nav-listing">
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
          <ul class="footer-list">
            <li class="nav-item">
              <a href="${root}/storage.html" class="space-link">
                <span class="space-info" id="space-info">Espaço Utilizado: <span id="used-space-info">0</span> MB / <span id="total-space-info">0</span> MB</span>
                <div class="space-bar-container">
                  <div class="space-bar" id="used-space-bar"></div>
                </div>
              </a>
            </li>
            <li class="nav-item nav-item--down">
              <a href="${root}/about.html">
                <i class="fa-solid fa-circle-info"></i>
                <span>Sobre nós</span>
              </a>
            </li>
            <li class="nav-item nav-item--down">
              <a href="${root}/contact.html">
                <i class="fa-solid fa-envelope"></i>
                <span>Contato</span>
              </a>
            </li>
          </ul>
        </nav>
        <footer>
          <span>Versão @1.0</span>
        </footer>
      </div>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    navigator.storage.estimate().then(estimate => {
      const usedSpace = (estimate.usage / (1024 * 1024)).toFixed(2);
      const totalSpace = (estimate.quota / (1024 * 1024)).toFixed(2);

      const spaceInfo = document.querySelector('.space-info');
      spaceInfo.querySelector('#used-space-info').textContent = usedSpace.toLocaleString();
      spaceInfo.querySelector('#total-space-info').textContent = totalSpace.toLocaleString();
    }).catch(error => {
      console.error('Erro ao obter informações de espaço:', error);
    });
  }
}

customElements.define('plin-sidebar', Sidebar);
