import { LitElement, html, css, svg } from 'lit';

const closeIcon = svg`<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>`;

/**
 * MD3 Chip Input — multi-value text field with inline chips.
 *
 * Users type values, press Enter/comma to create chips, and click X to remove them.
 * Manages its own chip list internally but exposes it via `values` property and events.
 */
export class MdChipInput extends LitElement {
  static override properties = {
    values: { type: Array },
    label: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    maxChips: { type: Number, attribute: 'max-chips' },
    allowDuplicates: { type: Boolean, attribute: 'allow-duplicates' },
    variant: { type: String, reflect: true },
    _inputValue: { type: String, state: true },
    _focused: { type: Boolean, state: true },
  };

  declare values: string[];
  declare label: string;
  declare placeholder: string;
  declare disabled: boolean;
  declare maxChips: number;
  declare allowDuplicates: boolean;
  declare variant: 'outlined' | 'filled';
  declare _inputValue: string;
  declare _focused: boolean;

  constructor() {
    super();
    this.values = [];
    this.label = '';
    this.placeholder = '';
    this.disabled = false;
    this.maxChips = 0;
    this.allowDuplicates = false;
    this.variant = 'outlined';
    this._inputValue = '';
    this._focused = false;
  }

  static override styles = css`
    :host {
      display: block;
      font-family: var(
        --md-sys-typescale-body-large-font,
        var(--md-ref-typeface-plain, Roboto, sans-serif)
      );
    }

    :host([disabled]) {
      opacity: 0.38;
      pointer-events: none;
    }

    /* ── Container ── */
    .container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      min-height: 56px;
      padding: 8px 12px;
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
      cursor: text;
      position: relative;
      transition: border-color 0.2s;
    }

    /* Outlined variant */
    :host([variant='outlined']) .container {
      border: 1px solid var(--md-sys-color-outline, #79747e);
      background: transparent;
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
    }

    :host([variant='outlined']) .container.focused {
      border-color: var(--md-sys-color-primary, #6750a4);
      border-width: 2px;
      padding: 7px 11px;
    }

    :host([variant='outlined']) .container:hover:not(.focused) {
      border-color: var(--md-sys-color-on-surface, #1d1b20);
    }

    /* Filled variant */
    :host([variant='filled']) .container {
      border: none;
      border-bottom: 1px solid var(--md-sys-color-on-surface-variant, #49454f);
      border-radius: var(--md-sys-shape-corner-extra-small, 4px)
        var(--md-sys-shape-corner-extra-small, 4px) 0 0;
      background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    }

    :host([variant='filled']) .container.focused {
      border-bottom: 2px solid var(--md-sys-color-primary, #6750a4);
      padding-bottom: 7px;
    }

    :host([variant='filled']) .container:hover:not(.focused) {
      border-bottom-color: var(--md-sys-color-on-surface, #1d1b20);
    }

    /* ── Label ── */
    .label {
      position: absolute;
      top: -8px;
      left: 10px;
      padding: 0 4px;
      font-size: var(--md-sys-typescale-body-small-size, 0.75rem);
      line-height: 1;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      background: var(--md-sys-color-surface, #fef7ff);
    }

    :host([variant='filled']) .label {
      top: 6px;
      left: 12px;
      background: transparent;
      padding: 0;
    }

    .focused .label {
      color: var(--md-sys-color-primary, #6750a4);
    }

    /* ── Chips ── */
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 32px;
      padding: 0 8px 0 12px;
      border-radius: 8px;
      border: none;
      background: var(--md-sys-color-secondary-container, #e8def8);
      font-family: inherit;
      font-size: var(--md-sys-typescale-label-large-size, 0.875rem);
      font-weight: var(--md-sys-typescale-label-large-weight, 500);
      color: var(--md-sys-color-on-secondary-container, #1d192b);
      max-width: 100%;
      animation: chip-in 0.15s ease-out;
    }

    @keyframes chip-in {
      from {
        transform: scale(0.85);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .chip-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chip-remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      padding: 0;
      border: none;
      background: var(--md-sys-color-on-secondary-container, #1d192b);
      cursor: pointer;
      border-radius: 50%;
      color: var(--md-sys-color-secondary-container, #e8def8);
      flex-shrink: 0;
      transition: opacity 0.15s;
      opacity: 0.7;
    }

    .chip-remove:hover {
      opacity: 1;
    }

    .chip-remove svg {
      width: 12px;
      height: 12px;
      fill: currentColor;
    }

    /* ── Input ── */
    .input {
      flex: 1;
      min-width: 80px;
      border: none;
      outline: none;
      background: transparent;
      font-family: inherit;
      font-size: var(--md-sys-typescale-body-large-size, 1rem);
      line-height: var(--md-sys-typescale-body-large-line-height, 1.5rem);
      color: var(--md-sys-color-on-surface, #1d1b20);
      padding: 4px 0;
    }

    .input::placeholder {
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
  `;

  override render() {
    const containerClass = `container${this._focused ? ' focused' : ''}`;

    return html`
      <div class=${containerClass} @click=${this._focusInput}>
        ${this.label
          ? html`<span class="label">${this.label}</span>`
          : null}
        ${this.values.map(
          (val, i) => html`
            <span class="chip">
              <span class="chip-text">${val}</span>
              <button
                class="chip-remove"
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this._removeChip(i);
                }}
                aria-label="Remove ${val}"
              >
                <svg viewBox="0 0 24 24">${closeIcon}</svg>
              </button>
            </span>
          `,
        )}
        <input
          class="input"
          .value=${this._inputValue}
          placeholder=${this.values.length === 0 ? this.placeholder : ''}
          ?disabled=${this.disabled}
          @input=${this._onInput}
          @keydown=${this._onKeydown}
          @focus=${() => (this._focused = true)}
          @blur=${this._onBlur}
          @paste=${this._onPaste}
        />
      </div>
    `;
  }

  private _focusInput() {
    const input = this.shadowRoot?.querySelector('.input') as HTMLInputElement;
    input?.focus();
  }

  private _onInput(e: Event) {
    this._inputValue = (e.target as HTMLInputElement).value;
  }

  private _onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      this._addChipFromInput();
    } else if (
      e.key === 'Backspace' &&
      this._inputValue === '' &&
      this.values.length > 0
    ) {
      this._removeChip(this.values.length - 1);
    }
  }

  private _onBlur() {
    this._focused = false;
    // Add pending input as chip on blur
    if (this._inputValue.trim()) {
      this._addChipFromInput();
    }
  }

  private _onPaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text');
    if (!text) return;

    // If pasted text contains commas, split into multiple chips
    const parts = text.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      e.preventDefault();
      for (const part of parts) {
        this._addChip(part);
      }
    }
  }

  private _addChipFromInput() {
    const val = this._inputValue.trim();
    if (!val) return;
    this._addChip(val);
    this._inputValue = '';
  }

  private _addChip(val: string) {
    if (this.maxChips > 0 && this.values.length >= this.maxChips) return;
    if (!this.allowDuplicates && this.values.includes(val)) return;

    this.values = [...this.values, val];
    this._dispatchChange();
  }

  private _removeChip(index: number) {
    const removed = this.values[index];
    this.values = this.values.filter((_, i) => i !== index);
    this._dispatchChange();
    this.dispatchEvent(
      new CustomEvent('chip-remove', {
        detail: { value: removed, index },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _dispatchChange() {
    this.dispatchEvent(
      new CustomEvent('values-change', {
        detail: { values: [...this.values] },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define('md-chip-input', MdChipInput);

declare global {
  interface HTMLElementTagNameMap {
    'md-chip-input': MdChipInput;
  }
}
