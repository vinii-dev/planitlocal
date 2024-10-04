/**
 * @class
 * @extends {PlinHTMLElement}
 */
class EventItem extends PlinHTMLElement {
  proeprties = ['title', 'id', 'date'];

  template() {
    const date = new Date(this.date);
    const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });

    return `
      <div class="event-item">
        <div class="event-item-info">
          <p class="event-item-info__title" contenteditable>${this.title}</p>
          <input class="event-item-info__time" type="time" value="${time}">
        </div>
        <div class="trash-icon-wrapper">
          <i class="trash-icon fa-solid fa-times"></i>
        </div>
      </div>
    `;

  }

  connectedCallback() {
    super.connectedCallback();
    const titleElm = this.querySelector('.event-item-info__title');
    const dateElm = this.querySelector('.event-item-info__time');
    const deleteElm = this.querySelector('.trash-icon-wrapper');

    deleteElm
      .addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('delete', { detail: { id: +this.id.replace('event-', '') }, bubbles: true, composed: true }));
      })

    dateElm
      .addEventListener('blur', (e) => {
        const date = new Date(this.date);
        const [hour, minute] = dateElm.value.split(':');
        date.setHours(hour);
        date.setMinutes(minute);
        
        this.dispatchEvent(new CustomEvent('update', { detail: { id: +this.id.replace('event-', ''), date: date.toISOString() }, bubbles: true, composed: true }));
      });

    dateElm.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') {
        dateElm.blur();
        e.preventDefault();
      }
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
        this.dispatchEvent(new CustomEvent('update', { detail: { id: +this.id.replace('event-', ''), title: titleElm.innerText }, bubbles: true, composed: true }));
      });
  }
}

customElements.define('plin-event-item', EventItem);
