import { LitElement, html, css, nothing } from 'lit';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * MD3 Date Picker component.
 *
 * A modal date picker with calendar grid, month/year navigation,
 * and text input mode toggle. Follows the Material Design 3 spec.
 */
export class MdDatePicker extends LitElement {
  static override properties = {
    open: { type: Boolean, reflect: true },
    type: { type: String, reflect: true },
    value: { type: String },
    valueEnd: { type: String, attribute: 'value-end' },
    min: { type: String },
    max: { type: String },
    _displayMonth: { type: Number, state: true },
    _displayYear: { type: Number, state: true },
    _inputMode: { type: Boolean, state: true },
    _inputValue: { type: String, state: true },
    _inputValueEnd: { type: String, state: true },
    _selectingEnd: { type: Boolean, state: true },
  };

  declare open: boolean;
  declare type: 'date' | 'daterange';
  declare value: string;
  declare valueEnd: string;
  declare min: string;
  declare max: string;
  declare _displayMonth: number;
  declare _displayYear: number;
  declare _inputMode: boolean;
  declare _inputValue: string;
  declare _inputValueEnd: string;
  declare _selectingEnd: boolean;

  constructor() {
    super();
    this.open = false;
    this.type = 'date';
    this.value = '';
    this.valueEnd = '';
    this.min = '';
    this.max = '';
    const today = new Date();
    this._displayMonth = today.getMonth();
    this._displayYear = today.getFullYear();
    this._inputMode = false;
    this._inputValue = '';
    this._inputValueEnd = '';
    this._selectingEnd = false;
  }

  static override styles = css`
    :host {
      display: contents;
    }

    .scrim {
      position: fixed;
      inset: 0;
      z-index: 999;
      background: var(--md-sys-color-scrim, #000);
      opacity: 0;
      visibility: hidden;
      transition: opacity 300ms cubic-bezier(0.2, 0, 0, 1),
                  visibility 0s 300ms;
      pointer-events: none;
    }

    :host([open]) .scrim {
      opacity: 0.32;
      visibility: visible;
      pointer-events: auto;
      transition: opacity 300ms cubic-bezier(0.2, 0, 0, 1);
    }

    .dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      z-index: 1000;
      background: var(--md-sys-color-surface-container-high, #ece6f0);
      border-radius: 28px;
      box-shadow: var(--md-sys-elevation-level3,
        0px 4px 8px 3px rgba(0,0,0,0.15),
        0px 1px 3px 0px rgba(0,0,0,0.3));
      opacity: 0;
      visibility: hidden;
      transition: opacity 200ms cubic-bezier(0.2, 0, 0, 1),
                  transform 200ms cubic-bezier(0.2, 0, 0, 1),
                  visibility 0s 200ms;
      width: 328px;
      overflow: hidden;
    }

    :host([open]) .dialog {
      opacity: 1;
      visibility: visible;
      transform: translate(-50%, -50%) scale(1);
      transition: opacity 300ms cubic-bezier(0.2, 0, 0, 1),
                  transform 300ms cubic-bezier(0.2, 0, 0, 1);
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
      margin-bottom: 12px;
    }

    .header-date-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-date {
      font-family: var(--md-sys-typescale-headline-large-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-headline-large-size, 32px);
      font-weight: var(--md-sys-typescale-headline-large-weight, 400);
      color: var(--md-sys-color-on-surface, #1d1b20);
      line-height: 40px;
    }

    .mode-toggle {
      width: 40px;
      height: 40px;
      border-radius: 20px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-family: 'Material Symbols Outlined', 'Material Icons';
      font-size: 24px;
      font-weight: normal;
      font-style: normal;
      -webkit-font-feature-settings: 'liga';
      font-feature-settings: 'liga';
      transition: background-color 150ms;
    }

    .mode-toggle:hover {
      background: var(--md-sys-color-on-surface-variant, #49454f);
      opacity: 0.08;
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
      padding: 0 12px 8px;
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
      color: var(--md-sys-color-on-surface, #1d1b20);
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
      transition: background-color 150ms;
      position: relative;
    }

    .day:hover:not(.selected):not(.range-endpoint):not(.disabled) {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, transparent);
    }

    .day.today:not(.selected) {
      border: 1px solid var(--md-sys-color-primary, #6750a4);
      color: var(--md-sys-color-primary, #6750a4);
    }

    .day.selected {
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

    /* Date range styles */
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
      background: color-mix(in srgb, var(--md-sys-color-primary, #6750a4) 12%, transparent);
      z-index: 0;
    }

    .day-cell.range-start::before {
      content: '';
      position: absolute;
      inset: 4px 0 4px 50%;
      background: color-mix(in srgb, var(--md-sys-color-primary, #6750a4) 12%, transparent);
      z-index: 0;
    }

    .day-cell.range-end::before {
      content: '';
      position: absolute;
      inset: 4px 50% 4px 0;
      background: color-mix(in srgb, var(--md-sys-color-primary, #6750a4) 12%, transparent);
      z-index: 0;
    }

    .day-cell.range-start.range-end::before {
      display: none;
    }

    .day-cell .day {
      z-index: 1;
    }

    .day:hover:not(.selected):not(.range-endpoint):not(.disabled) {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, transparent);
    }

    .day.range-endpoint {
      background: var(--md-sys-color-primary, #6750a4);
      color: var(--md-sys-color-on-primary, #fff);
    }

    /* Range input fields */
    .input-row {
      display: flex;
      gap: 12px;
    }

    .input-group {
      flex: 1;
    }

    .input-label {
      font-family: var(--md-sys-typescale-body-small-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-body-small-size, 12px);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      margin-bottom: 4px;
    }

    /* Text input mode */
    .input-area {
      padding: 16px 24px 24px;
    }

    .input-field {
      width: 100%;
      box-sizing: border-box;
      padding: 16px;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      border-radius: 4px;
      font-family: var(--md-sys-typescale-body-large-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-body-large-size, 16px);
      color: var(--md-sys-color-on-surface, #1d1b20);
      background: transparent;
      outline: none;
      transition: border-color 150ms;
    }

    .input-field:focus {
      border-color: var(--md-sys-color-primary, #6750a4);
      border-width: 2px;
      padding: 15px;
    }

    .input-field::placeholder {
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .input-helper {
      font-family: var(--md-sys-typescale-body-small-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-body-small-size, 12px);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      margin-top: 4px;
      padding: 0 16px;
    }

    .input-helper.error {
      color: var(--md-sys-color-error, #b3261e);
    }

    .input-field.error {
      border-color: var(--md-sys-color-error, #b3261e);
    }

    /* Actions */
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 8px 12px;
    }

    .action-btn {
      padding: 10px 16px;
      border-radius: 20px;
      border: none;
      background: transparent;
      cursor: pointer;
      font-family: var(--md-sys-typescale-label-large-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-label-large-size, 14px);
      font-weight: var(--md-sys-typescale-label-large-weight, 500);
      color: var(--md-sys-color-primary, #6750a4);
      transition: background-color 150ms;
    }

    .action-btn:hover {
      background: color-mix(in srgb, var(--md-sys-color-primary, #6750a4) 8%, transparent);
    }
  `;

  override render() {
    return html`
      <div class="scrim" @click=${this._handleCancel}></div>
      <div class="dialog">
        ${this._renderHeader()}
        ${this._inputMode ? this._renderInput() : this._renderCalendar()}
        ${this._renderActions()}
      </div>
    `;
  }

  private _renderHeader() {
    const isRange = this.type === 'daterange';
    const label = isRange ? 'Select dates' : 'Select date';
    let dateStr: string;
    if (isRange) {
      const start = this._formatShort(this.value);
      const end = this._formatShort(this.valueEnd);
      if (!this.value) {
        dateStr = 'Select start date';
      } else if (!this.valueEnd) {
        dateStr = `${start} – End date`;
      } else {
        dateStr = `${start} – ${end}`;
      }
    } else {
      dateStr = this._getFormattedDate();
    }
    const fontSize = isRange && this.value ? '22px' : undefined;
    return html`
      <div class="header">
        <div class="header-label">${label}</div>
        <div class="header-date-row">
          <div class="header-date" style=${fontSize ? `font-size:${fontSize}` : ''}>${dateStr}</div>
          <button class="mode-toggle"
            @click=${this._toggleInputMode}
            title=${this._inputMode ? 'Show calendar' : 'Enter date'}>
            ${this._inputMode ? 'calendar_today' : 'edit'}
          </button>
        </div>
      </div>
    `;
  }

  private _renderCalendar() {
    const days = this._getCalendarDays();
    const isRange = this.type === 'daterange';
    return html`
      <div>
        <div class="month-nav">
          <span class="month-label">${MONTHS[this._displayMonth]} ${this._displayYear}</span>
          <div class="month-nav-buttons">
            <button class="nav-btn" @click=${this._prevMonth} title="Previous month">chevron_left</button>
            <button class="nav-btn" @click=${this._nextMonth} title="Next month">chevron_right</button>
          </div>
        </div>
        <div class="calendar">
          <div class="weekdays">
            ${DAYS.map(d => html`<div class="weekday">${d}</div>`)}
          </div>
          <div class="days">
            ${days.map(day => {
              if (day === 0) {
                return isRange
                  ? html`<div class="day-cell"><div class="day empty"></div></div>`
                  : html`<div class="day empty"></div>`;
              }
              const iso = this._toISO(this._displayYear, this._displayMonth, day);
              const isToday = iso === this._todayISO();
              const isDisabled = this._isOutOfRange(iso);

              if (isRange) {
                const isStart = iso === this.value;
                const isEnd = iso === this.valueEnd;
                const inRange = this.value && this.valueEnd && iso > this.value && iso < this.valueEnd;
                const isEndpoint = isStart || isEnd;
                const cellClass = [
                  'day-cell',
                  isStart && this.valueEnd ? 'range-start' : '',
                  isEnd && this.value ? 'range-end' : '',
                  inRange ? 'in-range' : '',
                ].filter(Boolean).join(' ');
                return html`
                  <div class="${cellClass}">
                    <button
                      class="day ${isEndpoint ? 'range-endpoint' : ''} ${isToday ? 'today' : ''} ${isDisabled ? 'disabled' : ''}"
                      @click=${() => this._selectDay(iso)}
                      ?disabled=${isDisabled}
                    >${day}</button>
                  </div>
                `;
              }

              const isSelected = iso === this.value;
              return html`
                <button
                  class="day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${isDisabled ? 'disabled' : ''}"
                  @click=${() => this._selectDay(iso)}
                  ?disabled=${isDisabled}
                >${day}</button>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  }

  private _renderInput() {
    const isValid = this._inputValue === '' || this._isValidDateString(this._inputValue);
    if (this.type === 'daterange') {
      const isValidEnd = this._inputValueEnd === '' || this._isValidDateString(this._inputValueEnd);
      return html`
        <div class="input-area">
          <div class="input-row">
            <div class="input-group">
              <div class="input-label">Start date</div>
              <input
                class="input-field ${!isValid ? 'error' : ''}"
                type="text"
                placeholder="MM/DD/YYYY"
                .value=${this._inputValue}
                @input=${this._handleInput}
              />
              <div class="input-helper ${!isValid ? 'error' : ''}">
                ${!isValid ? 'Invalid date' : ''}
              </div>
            </div>
            <div class="input-group">
              <div class="input-label">End date</div>
              <input
                class="input-field ${!isValidEnd ? 'error' : ''}"
                type="text"
                placeholder="MM/DD/YYYY"
                .value=${this._inputValueEnd}
                @input=${this._handleInputEnd}
              />
              <div class="input-helper ${!isValidEnd ? 'error' : ''}">
                ${!isValidEnd ? 'Invalid date' : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }
    return html`
      <div class="input-area">
        <input
          class="input-field ${!isValid ? 'error' : ''}"
          type="text"
          placeholder="MM/DD/YYYY"
          .value=${this._inputValue}
          @input=${this._handleInput}
        />
        <div class="input-helper ${!isValid ? 'error' : ''}">
          ${!isValid ? 'Invalid date format' : 'Date format: MM/DD/YYYY'}
        </div>
      </div>
    `;
  }

  private _renderActions() {
    return html`
      <div class="actions">
        <button class="action-btn" @click=${this._handleCancel}>Cancel</button>
        <button class="action-btn" @click=${this._handleOk}>OK</button>
      </div>
    `;
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open && this.value) {
        const d = new Date(this.value + 'T00:00:00');
        if (!isNaN(d.getTime())) {
          this._displayMonth = d.getMonth();
          this._displayYear = d.getFullYear();
        }
      }
      if (this.open) {
        this._inputMode = false;
        this._inputValue = this.value ? this._isoToDisplay(this.value) : '';
        this._inputValueEnd = this.valueEnd ? this._isoToDisplay(this.valueEnd) : '';
        this._selectingEnd = false;
      }
      this.dispatchEvent(new CustomEvent('date-picker-changed', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }));
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this._onKeyDown = this._onKeyDown.bind(this);
    document.addEventListener('keydown', this._onKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._onKeyDown);
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.open) {
      this._handleCancel();
    }
  }

  // Calendar helpers
  private _getCalendarDays(): number[] {
    const firstDay = new Date(this._displayYear, this._displayMonth, 1).getDay();
    const daysInMonth = new Date(this._displayYear, this._displayMonth + 1, 0).getDate();
    const days: number[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(0); // empty slots
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
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
    if (this.min && iso < this.min) return true;
    if (this.max && iso > this.max) return true;
    return false;
  }

  private _getFormattedDate(): string {
    if (!this.value) return 'Select date';
    const d = new Date(this.value + 'T00:00:00');
    if (isNaN(d.getTime())) return 'Select date';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  }

  private _formatShort(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }

  private _isoToDisplay(iso: string): string {
    const [y, m, d] = iso.split('-');
    return `${m}/${d}/${y}`;
  }

  private _displayToISO(display: string): string {
    const parts = display.split('/');
    if (parts.length !== 3) return '';
    const [m, d, y] = parts;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  private _isValidDateString(str: string): boolean {
    const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return false;
    const [, m, d, y] = match;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return date.getFullYear() === Number(y) &&
           date.getMonth() === Number(m) - 1 &&
           date.getDate() === Number(d);
  }

  // Event handlers
  private _selectDay(iso: string) {
    if (this.type === 'daterange') {
      if (!this._selectingEnd || !this.value) {
        this.value = iso;
        this.valueEnd = '';
        this._selectingEnd = true;
        this._inputValue = this._isoToDisplay(iso);
        this._inputValueEnd = '';
      } else {
        // If end is before start, swap
        if (iso < this.value) {
          this.valueEnd = this.value;
          this.value = iso;
        } else {
          this.valueEnd = iso;
        }
        this._selectingEnd = false;
        this._inputValue = this._isoToDisplay(this.value);
        this._inputValueEnd = this._isoToDisplay(this.valueEnd);
      }
    } else {
      this.value = iso;
      this._inputValue = this._isoToDisplay(iso);
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

  private _toggleInputMode() {
    this._inputMode = !this._inputMode;
    if (this._inputMode) {
      if (this.value) this._inputValue = this._isoToDisplay(this.value);
      if (this.valueEnd) this._inputValueEnd = this._isoToDisplay(this.valueEnd);
    }
  }

  private _handleInput(e: Event) {
    this._inputValue = (e.target as HTMLInputElement).value;
    if (this._isValidDateString(this._inputValue)) {
      const iso = this._displayToISO(this._inputValue);
      if (!this._isOutOfRange(iso)) {
        this.value = iso;
        const d = new Date(iso + 'T00:00:00');
        this._displayMonth = d.getMonth();
        this._displayYear = d.getFullYear();
      }
    }
  }

  private _handleInputEnd(e: Event) {
    this._inputValueEnd = (e.target as HTMLInputElement).value;
    if (this._isValidDateString(this._inputValueEnd)) {
      const iso = this._displayToISO(this._inputValueEnd);
      if (!this._isOutOfRange(iso)) {
        this.valueEnd = iso;
      }
    }
  }

  private _handleCancel() {
    this.open = false;
  }

  private _handleOk() {
    if (this.type === 'daterange') {
      // Ensure proper order
      if (this.value && this.valueEnd && this.valueEnd < this.value) {
        const tmp = this.value;
        this.value = this.valueEnd;
        this.valueEnd = tmp;
      }
      if (this.value) {
        this.dispatchEvent(new CustomEvent('date-picker-value-changed', {
          detail: { value: this.value, valueEnd: this.valueEnd },
          bubbles: true,
          composed: true,
        }));
      }
    } else if (this.value) {
      this.dispatchEvent(new CustomEvent('date-picker-value-changed', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }));
    }
    this.open = false;
  }
}

customElements.define('md-date-picker', MdDatePicker);

declare global {
  interface HTMLElementTagNameMap {
    'md-date-picker': MdDatePicker;
  }
}
