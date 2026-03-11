import { LitElement, html, css, nothing } from 'lit';

const HOUR_ANGLES = Array.from({ length: 12 }, (_, i) => ({
  value: i === 0 ? 12 : i,
  angle: i * 30 - 90, // start from 12 o'clock
}));

const HOUR_24_OUTER = Array.from({ length: 12 }, (_, i) => ({
  value: i === 0 ? 0 : i,
  angle: i * 30 - 90,
}));

const HOUR_24_INNER = Array.from({ length: 12 }, (_, i) => ({
  value: i + 12,
  angle: i * 30 - 90,
}));

const MINUTE_MARKS = Array.from({ length: 12 }, (_, i) => ({
  value: i * 5,
  angle: i * 30 - 90,
}));

/**
 * MD3 Time Picker component.
 *
 * A modal time picker with clock dial and text input mode.
 * Supports 12-hour and 24-hour formats.
 */
export class MdTimePicker extends LitElement {
  static override properties = {
    open: { type: Boolean, reflect: true },
    value: { type: String },
    format: { type: String, reflect: true },
    _selecting: { type: String, state: true },
    _hour: { type: Number, state: true },
    _minute: { type: Number, state: true },
    _period: { type: String, state: true },
    _inputMode: { type: Boolean, state: true },
    _inputHour: { type: String, state: true },
    _inputMinute: { type: String, state: true },
  };

  declare open: boolean;
  declare value: string;
  declare format: '12h' | '24h';
  declare _selecting: 'hour' | 'minute';
  declare _hour: number;
  declare _minute: number;
  declare _period: 'AM' | 'PM';
  declare _inputMode: boolean;
  declare _inputHour: string;
  declare _inputMinute: string;

  constructor() {
    super();
    this.open = false;
    this.value = '';
    this.format = '24h';
    this._selecting = 'hour';
    this._hour = 12;
    this._minute = 0;
    this._period = 'AM';
    this._inputMode = false;
    this._inputHour = '';
    this._inputMinute = '';
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

    .header-time-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .time-display {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .time-segment {
      min-width: 56px;
      height: 48px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--md-sys-typescale-display-medium-font, 'Roboto', sans-serif);
      font-size: 36px;
      font-weight: 400;
      transition: background-color 150ms, color 150ms;
      background: var(--md-sys-color-surface-container, #f3edf7);
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .time-segment.active {
      background: var(--md-sys-color-primary-container, #eaddff);
      color: var(--md-sys-color-on-primary-container, #21005d);
    }

    .time-segment:hover:not(.active) {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, var(--md-sys-color-surface-container, #f3edf7));
    }

    .time-colon {
      font-family: var(--md-sys-typescale-display-medium-font, 'Roboto', sans-serif);
      font-size: 36px;
      font-weight: 400;
      color: var(--md-sys-color-on-surface, #1d1b20);
      padding: 0 2px;
    }

    .period-selector {
      display: flex;
      flex-direction: column;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      margin-left: 8px;
    }

    .period-btn {
      width: 44px;
      height: 28px;
      border: none;
      cursor: pointer;
      font-family: var(--md-sys-typescale-label-medium-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-label-medium-size, 12px);
      font-weight: var(--md-sys-typescale-label-medium-weight, 500);
      background: transparent;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      transition: background-color 150ms, color 150ms;
    }

    .period-btn + .period-btn {
      border-top: 1px solid var(--md-sys-color-outline, #79747e);
    }

    .period-btn.active {
      background: var(--md-sys-color-tertiary-container, #ffd8e4);
      color: var(--md-sys-color-on-tertiary-container, #31111d);
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
      background: color-mix(in srgb, var(--md-sys-color-on-surface-variant, #49454f) 8%, transparent);
    }

    /* Clock dial */
    .dial-container {
      display: flex;
      justify-content: center;
      padding: 16px 24px;
    }

    .dial {
      width: 256px;
      height: 256px;
      border-radius: 50%;
      background: var(--md-sys-color-surface-container-highest, #e6e0e9);
      position: relative;
    }

    .dial-center {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--md-sys-color-primary, #6750a4);
      transform: translate(-50%, -50%);
      z-index: 2;
    }

    .dial-hand {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 2px;
      background: var(--md-sys-color-primary, #6750a4);
      transform-origin: bottom center;
      z-index: 1;
    }

    .dial-number {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--md-sys-typescale-body-medium-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-body-medium-size, 14px);
      color: var(--md-sys-color-on-surface, #1d1b20);
      cursor: pointer;
      transition: background-color 150ms, color 150ms;
      z-index: 3;
      user-select: none;
    }

    .dial-number:hover:not(.selected) {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, transparent);
    }

    .dial-number.selected {
      background: var(--md-sys-color-primary, #6750a4);
      color: var(--md-sys-color-on-primary, #fff);
    }

    .dial-number.inner {
      font-size: 12px;
    }

    /* Text input mode */
    .input-area {
      padding: 16px 24px 24px;
    }

    .input-row {
      display: flex;
      align-items: center;
      gap: 8px;
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

    .input-field {
      width: 100%;
      box-sizing: border-box;
      padding: 16px;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      border-radius: 4px;
      font-family: var(--md-sys-typescale-body-large-font, 'Roboto', sans-serif);
      font-size: 24px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      background: transparent;
      outline: none;
      transition: border-color 150ms;
      text-align: center;
    }

    .input-field:focus {
      border-color: var(--md-sys-color-primary, #6750a4);
      border-width: 2px;
      padding: 15px;
    }

    .input-colon {
      font-size: 24px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      padding-top: 16px;
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
        ${this._inputMode ? this._renderInput() : this._renderDial()}
        ${this._renderActions()}
      </div>
    `;
  }

  private _renderHeader() {
    const is12h = this.format === '12h';
    const displayHour = is12h ? this._to12Hour(this._hour) : this._hour;
    const hourStr = String(displayHour).padStart(2, '0');
    const minStr = String(this._minute).padStart(2, '0');

    return html`
      <div class="header">
        <div class="header-label">Select time</div>
        <div class="header-time-row">
          <div class="time-display">
            <button class="time-segment ${this._selecting === 'hour' ? 'active' : ''}"
              @click=${() => { this._selecting = 'hour'; }}>
              ${hourStr}
            </button>
            <span class="time-colon">:</span>
            <button class="time-segment ${this._selecting === 'minute' ? 'active' : ''}"
              @click=${() => { this._selecting = 'minute'; }}>
              ${minStr}
            </button>
            ${is12h ? html`
              <div class="period-selector">
                <button class="period-btn ${this._period === 'AM' ? 'active' : ''}"
                  @click=${() => { this._period = 'AM'; }}>AM</button>
                <button class="period-btn ${this._period === 'PM' ? 'active' : ''}"
                  @click=${() => { this._period = 'PM'; }}>PM</button>
              </div>
            ` : nothing}
          </div>
          <button class="mode-toggle"
            @click=${this._toggleInputMode}
            title=${this._inputMode ? 'Show clock' : 'Enter time'}>
            ${this._inputMode ? 'schedule' : 'keyboard'}
          </button>
        </div>
      </div>
    `;
  }

  private _renderDial() {
    const isHour = this._selecting === 'hour';
    const is24h = this.format === '24h';

    let numbers: { value: number; angle: number; inner?: boolean }[];
    let selectedValue: number;
    let handAngle: number;
    let handLength: number;

    if (isHour) {
      if (is24h) {
        // Outer ring: 0, 1-11; Inner ring: 12-23
        const outer = HOUR_24_OUTER.map(n => ({ ...n, inner: false }));
        const inner = HOUR_24_INNER.map(n => ({ ...n, inner: true }));
        numbers = [...outer, ...inner];
        selectedValue = this._hour;
        const idx = this._hour < 12 ? this._hour : this._hour - 12;
        handAngle = idx * 30 - 90;
        handLength = this._hour >= 12 ? 70 : 100;
      } else {
        // 12h: show 1-12
        numbers = HOUR_ANGLES.map(n => ({ ...n, inner: false }));
        selectedValue = this._to12Hour(this._hour);
        const idx = selectedValue === 12 ? 0 : selectedValue;
        handAngle = idx * 30 - 90;
        handLength = 100;
      }
    } else {
      numbers = MINUTE_MARKS.map(n => ({ ...n, inner: false }));
      selectedValue = this._minute;
      // Hand points to exact minute
      handAngle = this._minute * 6 - 90;
      handLength = 100;
    }

    const radius = 128; // dial radius
    const outerR = 100; // outer number ring distance from center
    const innerR = 65;  // inner number ring distance from center

    return html`
      <div class="dial-container">
        <div class="dial">
          <div class="dial-center"></div>
          ${this._renderHand(handAngle, handLength)}
          ${numbers.map(n => {
            const r = n.inner ? innerR : outerR;
            const rad = (n.angle * Math.PI) / 180;
            const x = radius + r * Math.cos(rad) - 20;
            const y = radius + r * Math.sin(rad) - 20;
            const isSelected = isHour
              ? n.value === selectedValue
              : n.value === this._nearestFive(selectedValue);
            const label = isHour
              ? String(n.value)
              : String(n.value).padStart(2, '0');
            return html`
              <div class="dial-number ${isSelected ? 'selected' : ''} ${n.inner ? 'inner' : ''}"
                style="left:${x}px;top:${y}px"
                @click=${() => this._handleDialClick(n.value, !!n.inner)}>
                ${label}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _renderHand(angle: number, lengthPercent: number) {
    const length = (lengthPercent / 100) * 100; // px from center
    return html`
      <div class="dial-hand"
        style="height:${length}px;transform:translate(-50%,-100%) rotate(${angle + 90}deg)">
      </div>
    `;
  }

  private _renderInput() {
    return html`
      <div class="input-area">
        <div class="input-row">
          <div class="input-group">
            <div class="input-label">Hour</div>
            <input class="input-field" type="text" maxlength="2"
              .value=${this._inputHour}
              @input=${this._handleInputHour}
              @focus=${(e: Event) => (e.target as HTMLInputElement).select()}
            />
          </div>
          <span class="input-colon">:</span>
          <div class="input-group">
            <div class="input-label">Minute</div>
            <input class="input-field" type="text" maxlength="2"
              .value=${this._inputMinute}
              @input=${this._handleInputMinute}
              @focus=${(e: Event) => (e.target as HTMLInputElement).select()}
            />
          </div>
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
      if (this.open) {
        this._selecting = 'hour';
        this._inputMode = false;
        if (this.value) {
          this._parseValue(this.value);
        }
        this._syncInputFields();
      }
      this.dispatchEvent(new CustomEvent('time-picker-changed', {
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

  // Value parsing/formatting
  private _parseValue(val: string) {
    const match = val.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return;
    let h = Number(match[1]);
    const m = Number(match[2]);
    if (h < 0 || h > 23 || m < 0 || m > 59) return;
    this._hour = h;
    this._minute = m;
    this._period = h >= 12 ? 'PM' : 'AM';
  }

  private _formatValue(): string {
    return `${String(this._hour).padStart(2, '0')}:${String(this._minute).padStart(2, '0')}`;
  }

  private _to12Hour(h: number): number {
    if (h === 0) return 12;
    if (h > 12) return h - 12;
    return h;
  }

  private _nearestFive(m: number): number {
    return Math.round(m / 5) * 5 % 60;
  }

  private _syncInputFields() {
    if (this.format === '12h') {
      this._inputHour = String(this._to12Hour(this._hour));
      this._inputMinute = String(this._minute).padStart(2, '0');
    } else {
      this._inputHour = String(this._hour).padStart(2, '0');
      this._inputMinute = String(this._minute).padStart(2, '0');
    }
  }

  // Event handlers
  private _handleDialClick(value: number, isInner: boolean) {
    if (this._selecting === 'hour') {
      if (this.format === '24h') {
        this._hour = isInner ? value : value;
      } else {
        // 12h: convert display hour to 24h
        let h = value;
        if (this._period === 'PM' && h !== 12) h += 12;
        if (this._period === 'AM' && h === 12) h = 0;
        this._hour = h;
      }
      this._syncInputFields();
      // Auto-advance to minute
      setTimeout(() => { this._selecting = 'minute'; }, 200);
    } else {
      this._minute = value;
      this._syncInputFields();
    }
  }

  private _toggleInputMode() {
    this._inputMode = !this._inputMode;
    if (this._inputMode) {
      this._syncInputFields();
    }
  }

  private _handleInputHour(e: Event) {
    const val = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    this._inputHour = val;
    const n = Number(val);
    if (this.format === '12h') {
      if (n >= 1 && n <= 12) {
        let h = n;
        if (this._period === 'PM' && h !== 12) h += 12;
        if (this._period === 'AM' && h === 12) h = 0;
        this._hour = h;
      }
    } else {
      if (n >= 0 && n <= 23) {
        this._hour = n;
      }
    }
  }

  private _handleInputMinute(e: Event) {
    const val = (e.target as HTMLInputElement).value.replace(/\D/g, '');
    this._inputMinute = val;
    const n = Number(val);
    if (n >= 0 && n <= 59) {
      this._minute = n;
    }
  }

  private _handleCancel() {
    this.open = false;
  }

  private _handleOk() {
    this.value = this._formatValue();
    this.dispatchEvent(new CustomEvent('time-picker-value-changed', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
    this.open = false;
  }
}

customElements.define('md-time-picker', MdTimePicker);

declare global {
  interface HTMLElementTagNameMap {
    'md-time-picker': MdTimePicker;
  }
}
