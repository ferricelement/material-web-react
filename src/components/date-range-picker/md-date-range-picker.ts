import { LitElement, html, css } from 'lit';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * MD3 Date Range Picker component.
 *
 * An inline date range picker with calendar grid and month/year navigation.
 * Click once to set start date, click again to set end date.
 * Follows Material Design 3 styling conventions.
 */
export class MdDateRangePicker extends LitElement {
  static override properties = {
    startDate: { type: String, attribute: 'start-date', reflect: true },
    endDate: { type: String, attribute: 'end-date', reflect: true },
    minDate: { type: String, attribute: 'min-date' },
    maxDate: { type: String, attribute: 'max-date' },
    disabled: { type: Boolean, reflect: true },
    _displayMonth: { type: Number, state: true },
    _displayYear: { type: Number, state: true },
    _selectingEnd: { type: Boolean, state: true },
  };

  declare startDate: string;
  declare endDate: string;
  declare minDate: string;
  declare maxDate: string;
  declare disabled: boolean;
  declare _displayMonth: number;
  declare _displayYear: number;
  declare _selectingEnd: boolean;

  constructor() {
    super();
    this.startDate = '';
    this.endDate = '';
    this.minDate = '';
    this.maxDate = '';
    this.disabled = false;
    const today = new Date();
    this._displayMonth = today.getMonth();
    this._displayYear = today.getFullYear();
    this._selectingEnd = false;
  }

  static override styles = css`
    :host {
      display: inline-block;
    }

    :host([disabled]) {
      pointer-events: none;
      opacity: 0.38;
    }

    .container {
      background: var(--md-sys-color-surface-container, #f3edf7);
      border-radius: 28px;
      overflow: hidden;
      width: 328px;
      box-shadow: var(--md-sys-elevation-level1,
        0px 1px 2px 0px rgba(0,0,0,0.3),
        0px 1px 3px 1px rgba(0,0,0,0.15));
    }

    /* Header */
    .header {
      padding: 16px 24px 12px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    .header-label {
      font-family: var(--md-sys-typescale-label-large-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-label-large-size, 14px);
      font-weight: var(--md-sys-typescale-label-large-weight, 500);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      margin-bottom: 8px;
    }

    .header-dates {
      font-family: var(--md-sys-typescale-headline-small-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-headline-small-size, 24px);
      font-weight: var(--md-sys-typescale-headline-small-weight, 400);
      color: var(--md-sys-color-on-surface, #1d1b20);
      line-height: 32px;
    }

    /* Month navigation */
    .month-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
    }

    .month-label {
      font-family: var(--md-sys-typescale-label-large-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-label-large-size, 14px);
      font-weight: var(--md-sys-typescale-label-large-weight, 500);
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .month-nav-buttons {
      display: flex;
      gap: 4px;
    }

    .nav-btn {
      width: 36px;
      height: 36px;
      border-radius: 18px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-family: 'Material Symbols Outlined', 'Material Icons';
      font-size: 20px;
      font-weight: normal;
      font-style: normal;
      -webkit-font-feature-settings: 'liga';
      font-feature-settings: 'liga';
      transition: background-color 150ms;
    }

    .nav-btn:hover {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, transparent);
    }

    /* Calendar grid */
    .calendar {
      padding: 0 12px 12px;
    }

    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      margin-bottom: 4px;
    }

    .weekday {
      font-family: var(--md-sys-typescale-body-small-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-body-small-size, 12px);
      font-weight: var(--md-sys-typescale-body-small-weight, 400);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }

    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    /* Day cell wrapper for range background */
    .day-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .day-cell.in-range::before {
      content: '';
      position: absolute;
      inset: 4px 0;
      background: var(--md-sys-color-primary-container, #eaddff);
      z-index: 0;
    }

    .day-cell.range-start::before {
      content: '';
      position: absolute;
      inset: 4px 0 4px 50%;
      background: var(--md-sys-color-primary-container, #eaddff);
      z-index: 0;
    }

    .day-cell.range-end::before {
      content: '';
      position: absolute;
      inset: 4px 50% 4px 0;
      background: var(--md-sys-color-primary-container, #eaddff);
      z-index: 0;
    }

    .day-cell.range-start.range-end::before {
      display: none;
    }

    /* Day button */
    .day {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-family: var(--md-sys-typescale-body-medium-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-body-medium-size, 14px);
      color: var(--md-sys-color-on-surface, #1d1b20);
      transition: background-color 200ms cubic-bezier(0.2, 0, 0, 1);
      position: relative;
      z-index: 1;
    }

    .day:hover:not(.endpoint):not(.disabled):not(.outside) {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, transparent);
    }

    .day.today:not(.endpoint) {
      border: 1px solid var(--md-sys-color-outline, #79747e);
    }

    .day.endpoint {
      background: var(--md-sys-color-primary, #6750a4);
      color: var(--md-sys-color-on-primary, #fff);
    }

    .day.disabled {
      color: var(--md-sys-color-on-surface, #1d1b20);
      opacity: 0.38;
      cursor: default;
      pointer-events: none;
    }

    .day.empty {
      visibility: hidden;
    }

    .day.outside {
      color: var(--md-sys-color-on-surface, #1d1b20);
      opacity: 0.38;
    }

    .day.outside:hover {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 4%, transparent);
    }
  `;

  override render() {
    return html`
      <div class="container">
        ${this._renderHeader()}
        ${this._renderMonthNav()}
        ${this._renderCalendar()}
      </div>
    `;
  }

  private _renderHeader() {
    const start = this._formatShort(this.startDate);
    const end = this._formatShort(this.endDate);
    let dateStr: string;

    if (!this.startDate) {
      dateStr = 'Select dates';
    } else if (!this.endDate) {
      dateStr = `${start} \u2013 End date`;
    } else {
      dateStr = `${start} \u2013 ${end}`;
    }

    return html`
      <div class="header">
        <div class="header-label">Select date range</div>
        <div class="header-dates">${dateStr}</div>
      </div>
    `;
  }

  private _renderMonthNav() {
    return html`
      <div class="month-nav">
        <span class="month-label">${MONTHS[this._displayMonth]} ${this._displayYear}</span>
        <div class="month-nav-buttons">
          <button class="nav-btn" @click=${this._prevMonth} title="Previous month">chevron_left</button>
          <button class="nav-btn" @click=${this._nextMonth} title="Next month">chevron_right</button>
        </div>
      </div>
    `;
  }

  private _renderCalendar() {
    const days = this._getCalendarDays();
    return html`
      <div class="calendar">
        <div class="weekdays">
          ${DAYS.map(d => html`<div class="weekday">${d}</div>`)}
        </div>
        <div class="days">
          ${days.map(day => this._renderDay(day))}
        </div>
      </div>
    `;
  }

  private _renderDay(day: { num: number; outside: boolean } | null) {
    if (!day) {
      return html`<div class="day-cell"><div class="day empty"></div></div>`;
    }

    const { num, outside } = day;
    let year = this._displayYear;
    let month = this._displayMonth;

    if (outside) {
      if (num > 20) {
        // Previous month
        month--;
        if (month < 0) { month = 11; year--; }
      } else {
        // Next month
        month++;
        if (month > 11) { month = 0; year++; }
      }
    }

    const iso = this._toISO(year, month, num);
    const isToday = iso === this._todayISO();
    const isDisabled = this._isOutOfRange(iso);
    const isStart = iso === this.startDate;
    const isEnd = iso === this.endDate;
    const isEndpoint = isStart || isEnd;
    const inRange = this.startDate && this.endDate && iso > this.startDate && iso < this.endDate;

    const cellClasses = [
      'day-cell',
      isStart && this.endDate ? 'range-start' : '',
      isEnd && this.startDate ? 'range-end' : '',
      inRange ? 'in-range' : '',
    ].filter(Boolean).join(' ');

    const dayClasses = [
      'day',
      isEndpoint ? 'endpoint' : '',
      isToday ? 'today' : '',
      isDisabled ? 'disabled' : '',
      outside ? 'outside' : '',
    ].filter(Boolean).join(' ');

    return html`
      <div class="${cellClasses}">
        <button
          class="${dayClasses}"
          @click=${() => this._selectDay(iso)}
          ?disabled=${isDisabled}
        >${num}</button>
      </div>
    `;
  }

  // Calendar helpers
  private _getCalendarDays(): ({ num: number; outside: boolean } | null)[] {
    const firstDay = new Date(this._displayYear, this._displayMonth, 1).getDay();
    const daysInMonth = new Date(this._displayYear, this._displayMonth + 1, 0).getDate();
    const prevMonthDays = new Date(this._displayYear, this._displayMonth, 0).getDate();
    const days: ({ num: number; outside: boolean } | null)[] = [];

    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ num: prevMonthDays - i, outside: true });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ num: d, outside: false });
    }

    // Next month leading days to fill last row
    const remainder = days.length % 7;
    if (remainder > 0) {
      const fill = 7 - remainder;
      for (let d = 1; d <= fill; d++) {
        days.push({ num: d, outside: true });
      }
    }

    return days;
  }

  private _toISO(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  private _todayISO(): string {
    const t = new Date();
    return this._toISO(t.getFullYear(), t.getMonth(), t.getDate());
  }

  private _isOutOfRange(iso: string): boolean {
    if (this.minDate && iso < this.minDate) return true;
    if (this.maxDate && iso > this.maxDate) return true;
    return false;
  }

  private _formatShort(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  // Event handlers
  private _selectDay(iso: string) {
    if (this.disabled) return;

    if (!this._selectingEnd || !this.startDate) {
      // First click: set start date
      this.startDate = iso;
      this.endDate = '';
      this._selectingEnd = true;
    } else {
      // Second click: set end date
      if (iso < this.startDate) {
        // Clicked before start, swap
        this.endDate = this.startDate;
        this.startDate = iso;
      } else {
        this.endDate = iso;
      }
      this._selectingEnd = false;

      this.dispatchEvent(new CustomEvent('change', {
        detail: { startDate: this.startDate, endDate: this.endDate },
        bubbles: true,
        composed: true,
      }));
    }
  }

  private _prevMonth() {
    if (this._displayMonth === 0) {
      this._displayMonth = 11;
      this._displayYear--;
    } else {
      this._displayMonth--;
    }
  }

  private _nextMonth() {
    if (this._displayMonth === 11) {
      this._displayMonth = 0;
      this._displayYear++;
    } else {
      this._displayMonth++;
    }
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('startDate') && this.startDate) {
      const d = new Date(this.startDate + 'T00:00:00');
      if (!isNaN(d.getTime()) && !changed.has('_displayMonth')) {
        this._displayMonth = d.getMonth();
        this._displayYear = d.getFullYear();
      }
    }
  }
}

customElements.define('md-date-range-picker', MdDateRangePicker);

declare global {
  interface HTMLElementTagNameMap {
    'md-date-range-picker': MdDateRangePicker;
  }
}
