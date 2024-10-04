class Calendar extends PlinHTMLElement {
  constructor() {
    super();
    this.eventsDb = namedDb('events');
    this.currentDate = new Date();

    // this.eventsDb.getAll().then((items) => items.forEach(item => this.eventsDb.remove(item.id)));
  }

  template() {
    return `
      <section class="calendar-wrapper">
        <h1>Eventos</h1>
        <div class="calendar-controls">
          <button id="prevMonth">◀</button>
          <span id="monthYear"></span>
          <button id="nextMonth">▶</button>
        </div>
        <div class="calendar-grid">
          <div class="calendar-header">
            <div class="day">Dom</div>
            <div class="day">Seg</div>
            <div class="day">Ter</div>
            <div class="day">Qua</div>
            <div class="day">Qui</div>
            <div class="day">Sex</div>
            <div class="day">Sáb</div>
          </div>
          <div class="calendar-body">
            ${this.renderDays()}
          </div>
        </div>
      </section>
    `;
  }

  renderDays() {
    const days = [];
    const startOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const endOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);

    for (let i = 0; i < startOfMonth.getDay(); i++) {
      days.push('<div class="day-cell empty"></div>');
    }

    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      days.push(`
        <div class="day-cell" id="day-${i}" data-day="${i}">
          <div class="date">${i}</div>
          <div class="events" id="events-${i}"></div>
        </div>
      `);
    }

    return days.join('');
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.renderEvents();
    this.updateMonthYearDisplay();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.querySelectorAll('.day-cell').forEach(button => {
      button.addEventListener('click', (e) => {
        if(e.target.closest('PLIN-EVENT-ITEM')) return;

        const day = e.target.closest('.day-cell').getAttribute('data-day');
        this.addEvent(day);
      });
    });

    this.querySelector('#prevMonth').addEventListener('click', () => this.changeMonth(-1));
    this.querySelector('#nextMonth').addEventListener('click', () => this.changeMonth(1));
    
    const plinEventItems = this.querySelectorAll('plin-event-item');
    
    plinEventItems.forEach((item) => {
      item.addEventListener('delete', (e) => this.handleDelete(e));
      item.addEventListener('update', (e) => this.handleUpdate(e));
    });
  }

  handleDelete = async (event) => {
    const id = event.detail.id;

    await this.eventsDb.remove(id);
    this.updateCalendar();
  }

  handleUpdate = async (e) => {
    const { id, ...obj } = e.detail;

    const { id: _, ...event } = await this.eventsDb.get(id);
    console.log({ ...event, ...obj });
    await this.eventsDb.update(id, { ...event, ...obj })
    this.updateCalendar();
  }

  async renderEvents() {
    const events = await this.eventsDb.getAll(); 
    events.forEach(event => {
      const date = new Date(event.date);

      if (this.currentDate.getMonth() !== date.getMonth()
        || this.currentDate.getFullYear() !== date.getFullYear()) return;

      const dayIndex = date.getDate();

      const eventsContainer = this.querySelector(`#events-${dayIndex}`);

      const eventTemplate = `<plin-event-item id="event-${event.id}" title="${event.title}" date="${event.date}"></plin-event-item>`;
      eventsContainer.innerHTML += eventTemplate;
    });
  }

  async addEvent(day) {
    const event = { title: 'Sem Título', date: new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day, 0, 0, 0, 0).toISOString() };
    await this.eventsDb.add(event); 
    this.updateCalendar(); 
  }

  changeMonth(direction) {
    const newMonth = this.currentDate.getMonth() + direction;

    if (newMonth < 0) {
      this.currentDate.setMonth(11);
      this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
    } else if (newMonth > 11) {
      this.currentDate.setMonth(0);
      this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
    } else {
      this.currentDate.setMonth(newMonth);
    }

    this.updateCalendar();
  }

  async updateCalendar() {
    this.innerHTML = this.template();
    await this.renderEvents();
    this.updateMonthYearDisplay();
    this.setupEventListeners(); 
  }

  updateMonthYearDisplay() {
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const monthYearDisplay = this.querySelector('#monthYear');
    monthYearDisplay.innerText = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }
}

customElements.define('plin-calendar', Calendar);
