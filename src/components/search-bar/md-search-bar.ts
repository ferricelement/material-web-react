import { LitElement, html, css, nothing } from 'lit';
import '@material/web/elevation/elevation.js';

export class MdSearchBar extends LitElement {
  static override properties = {
    value: { type: String },
    placeholder: { type: String },
    expanded: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    options: { type: Array },
    _focusedIndex: { state: true },
  };

  declare value: string;
  declare placeholder: string;
  declare expanded: boolean;
  declare disabled: boolean;
  declare options: string[];
  declare _focusedIndex: number;

  constructor() {
    super();
    this.value = '';
    this.placeholder = 'Search';
    this.expanded = false;
    this.disabled = false;
    this.options = [];
    this._focusedIndex = -1;
  }

  static override styles = css`
    :host {
      display: block;
    }

    .container {
      position: relative;
      display: flex;
      align-items: center;
      height: 56px;
      border-radius: 28px;
      background: var(--md-sys-color-surface-container-highest, #e6e0e9);
      padding: 0 16px;
      gap: 8px;
      transition: background 200ms ease, border-radius 200ms ease;
      cursor: text;
    }

    :host([expanded]) .container {
      border-radius: 28px 28px 0 0;
      background: var(--md-sys-color-surface-container-high, #ece6f0);
    }

    :host([disabled]) .container {
      opacity: 0.38;
      pointer-events: none;
    }

    .leading {
      display: flex;
      align-items: center;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-family: var(--md-ref-typeface-plain, 'Roboto', sans-serif);
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 0.5px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      padding: 0;
    }

    input::placeholder {
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .trailing {
      display: flex;
      align-items: center;
      gap: 4px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .suggestions {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--md-sys-color-surface-container-high, #ece6f0);
      border-radius: 0 0 28px 28px;
      padding: 8px 0;
      z-index: 10;
      max-height: 320px;
      overflow-y: auto;
    }

    :host([expanded]) .suggestions {
      display: block;
    }

    .option {
      padding: 12px 16px 12px 52px;
      font-size: 14px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      cursor: pointer;
      transition: background 100ms;
    }

    .option:hover, .option.focused {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, transparent);
    }

    .no-results {
      padding: 12px 16px 12px 52px;
      font-size: 14px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    md-elevation {
      --md-elevation-level: 2;
    }

    .wrapper {
      position: relative;
    }
  `;

  private get _filtered(): string[] {
    if (!this.value) return this.options;
    const q = this.value.toLowerCase();
    return this.options.filter(opt => opt.toLowerCase().includes(q));
  }

  override render() {
    const hasOptions = this.options.length > 0;
    const filtered = this._filtered;

    return html`
      <div class="wrapper">
        <div class="container" @click=${this._focusInput}>
          <md-elevation></md-elevation>
          <div class="leading"><slot name="leading"></slot></div>
          <input
            type="text"
            .value=${this.value}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            @input=${this._handleInput}
            @focus=${this._handleFocus}
            @blur=${this._handleBlur}
            @keydown=${hasOptions ? this._handleKeydown : nothing}
          />
          <div class="trailing"><slot name="trailing"></slot></div>
        </div>
        <div class="suggestions">
          <md-elevation></md-elevation>
          ${hasOptions
            ? filtered.length > 0
              ? filtered.map((opt, i) => html`
                <div class="option ${i === this._focusedIndex ? 'focused' : ''}"
                  @mousedown=${() => this._selectOption(opt)}>
                  ${opt}
                </div>
              `)
              : this.value ? html`<div class="no-results">No results</div>` : nothing
            : html`<slot name="suggestions"></slot>`
          }
        </div>
      </div>
    `;
  }

  private _focusInput() {
    const input = this.shadowRoot?.querySelector('input');
    input?.focus();
  }

  private _handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this._focusedIndex = -1;
    this.expanded = true;
    this.dispatchEvent(new CustomEvent('search-input', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }

  private _handleFocus() {
    this.expanded = true;
    this.dispatchEvent(new Event('search-focus', { bubbles: true, composed: true }));
  }

  private _handleBlur() {
    setTimeout(() => {
      this.expanded = false;
      this.dispatchEvent(new Event('search-blur', { bubbles: true, composed: true }));
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
        this.expanded = false;
        break;
    }
  }

  private _selectOption(opt: string) {
    this.value = opt;
    this.expanded = false;
    this._focusedIndex = -1;
    this.dispatchEvent(new CustomEvent('search-select', {
      bubbles: true,
      composed: true,
      detail: { value: opt },
    }));
  }
}

customElements.define('md-search-bar', MdSearchBar);

declare global {
  interface HTMLElementTagNameMap {
    'md-search-bar': MdSearchBar;
  }
}
