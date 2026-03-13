import { LitElement, html, css, nothing } from 'lit';
import '@material/web/elevation/elevation.js';

/**
 * MD3 Autocomplete / Combobox component.
 *
 * A searchable text field with a filtered dropdown list of options.
 */
export class MdAutocomplete extends LitElement {
  static override properties = {
    label: { type: String },
    value: { type: String },
    options: { type: Array },
    placeholder: { type: String },
    variant: { type: String, reflect: true },
    _query: { state: true },
    _open: { state: true },
    _focusedIndex: { state: true },
  };

  declare label: string;
  declare value: string;
  declare options: string[];
  declare placeholder: string;
  declare variant: 'filled' | 'outlined';
  declare _query: string;
  declare _open: boolean;
  declare _focusedIndex: number;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.options = [];
    this.placeholder = '';
    this.variant = 'outlined';
    this._query = '';
    this._open = false;
    this._focusedIndex = -1;
  }

  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
      min-width: 240px;
    }

    .field {
      position: relative;
    }

    input {
      width: 100%;
      box-sizing: border-box;
      padding: 16px;
      font-size: 16px;
      font-family: inherit;
      color: var(--md-sys-color-on-surface, #1d1b20);
      background: transparent;
      outline: none;
    }

    :host([variant="outlined"]) input {
      border: 1px solid var(--md-sys-color-outline, #79747e);
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
    }

    :host([variant="outlined"]) input:focus {
      border-color: var(--md-sys-color-primary, #6750a4);
      border-width: 2px;
      padding: 15px;
    }

    :host([variant="filled"]) input {
      border: none;
      border-bottom: 1px solid var(--md-sys-color-on-surface-variant, #49454f);
      border-radius: var(--md-sys-shape-corner-extra-small, 4px) var(--md-sys-shape-corner-extra-small, 4px) 0 0;
      background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    }

    :host([variant="filled"]) input:focus {
      border-bottom: 2px solid var(--md-sys-color-primary, #6750a4);
      padding-bottom: 15px;
    }

    .label {
      position: absolute;
      top: -8px;
      left: 12px;
      padding: 0 4px;
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      background: var(--md-sys-color-surface, #fef7ff);
    }

    :host([variant="filled"]) .label {
      background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    }

    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 100;
      margin-top: 4px;
      background: var(--md-sys-color-surface-container, #f3edf7);
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
      max-height: 256px;
      --md-elevation-level: 2;
      --md-elevation-shadow-color: var(--md-sys-color-shadow, #000);
      overflow-y: auto;
      display: none;
    }

    .dropdown.open {
      display: block;
    }

    .option {
      padding: 12px 16px;
      font-size: 14px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      cursor: pointer;
      transition: background 100ms;
    }

    .option:hover, .option.focused {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, transparent);
    }

    .option.selected {
      background: var(--md-sys-color-secondary-container, #e8def8);
      color: var(--md-sys-color-on-secondary-container, #1d192b);
    }

    .no-results {
      padding: 12px 16px;
      font-size: 14px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .clear-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .clear-btn:hover {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, transparent);
    }

    .clear-btn svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
  `;

  private get _filtered(): string[] {
    if (!this._query) return this.options;
    const q = this._query.toLowerCase();
    return this.options.filter(opt => opt.toLowerCase().includes(q));
  }

  override render() {
    const filtered = this._filtered;
    return html`
      <div class="field">
        ${this.label ? html`<span class="label">${this.label}</span>` : nothing}
        <input
          type="text"
          .value=${this._query || this.value}
          placeholder=${this.placeholder}
          @input=${this._handleInput}
          @focus=${this._handleFocus}
          @blur=${this._handleBlur}
          @keydown=${this._handleKeydown}
        />
        ${this._query ? html`
          <button class="clear-btn" @mousedown=${this._handleClear}>
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        ` : nothing}
      </div>
      <div class="dropdown ${this._open && filtered.length > 0 ? 'open' : ''}">
        <md-elevation></md-elevation>
        ${filtered.length > 0
          ? filtered.map((opt, i) => html`
            <div class="option ${i === this._focusedIndex ? 'focused' : ''} ${opt === this.value ? 'selected' : ''}"
              @mousedown=${() => this._selectOption(opt)}>
              ${opt}
            </div>
          `)
          : this._query ? html`<div class="no-results">No results</div>` : nothing}
      </div>
    `;
  }

  private _handleInput(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this._query = input.value;
    this._open = true;
    this._focusedIndex = -1;
  }

  private _handleFocus() {
    this._open = true;
    if (this.value && !this._query) {
      this._query = this.value;
    }
  }

  private _handleBlur() {
    // Delay to allow mousedown on option
    setTimeout(() => {
      this._open = false;
    }, 200);
  }

  private _handleKeydown(e: KeyboardEvent) {
    const filtered = this._filtered;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._focusedIndex = Math.min(this._focusedIndex + 1, filtered.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._focusedIndex = Math.max(this._focusedIndex - 1, 0);
        break;
      case 'Enter':
        if (this._focusedIndex >= 0 && filtered[this._focusedIndex]) {
          this._selectOption(filtered[this._focusedIndex]);
        }
        break;
      case 'Escape':
        this._open = false;
        break;
    }
  }

  private _selectOption(opt: string) {
    this.value = opt;
    this._query = opt;
    this._open = false;
    this.dispatchEvent(new CustomEvent('autocomplete-select', {
      detail: { value: opt },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleClear(e: Event) {
    e.preventDefault();
    this.value = '';
    this._query = '';
    this._open = false;
    this.dispatchEvent(new CustomEvent('autocomplete-select', {
      detail: { value: '' },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('md-autocomplete', MdAutocomplete);

declare global {
  interface HTMLElementTagNameMap {
    'md-autocomplete': MdAutocomplete;
  }
}
