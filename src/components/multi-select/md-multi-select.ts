import { LitElement, html, css, nothing, svg } from 'lit';
import '@material/web/elevation/elevation.js';

const closeIcon = svg`<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>`;
const checkIcon = svg`<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>`;
const arrowDropDown = svg`<path d="M7 10l5 5 5-5z"/>`;

interface OptionItem {
  value: string;
  label: string;
  group?: string;
}

/**
 * MD3 Multi-Select — searchable multi-select dropdown with chip display.
 *
 * Options and values are passed as JSON strings to work as web component attributes.
 * Selected items display as tonal chips inside the trigger field.
 */
export class MdMultiSelect extends LitElement {
  static override properties = {
    options: { type: String },
    values: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    searchable: { type: Boolean },
    maxSelected: { type: Number, attribute: 'max-selected' },
    label: { type: String },
    _open: { state: true },
    _search: { state: true },
    _focusedIndex: { state: true },
    _focused: { state: true },
  };

  declare options: string;
  declare values: string;
  declare placeholder: string;
  declare disabled: boolean;
  declare searchable: boolean;
  declare maxSelected: number;
  declare label: string;
  declare _open: boolean;
  declare _search: string;
  declare _focusedIndex: number;
  declare _focused: boolean;

  private _boundOutsideClick = this._onOutsideClick.bind(this);

  constructor() {
    super();
    this.options = '[]';
    this.values = '[]';
    this.placeholder = 'Select...';
    this.disabled = false;
    this.searchable = true;
    this.maxSelected = 0;
    this.label = '';
    this._open = false;
    this._search = '';
    this._focusedIndex = -1;
    this._focused = false;
  }

  private get _parsedOptions(): OptionItem[] {
    try {
      return JSON.parse(this.options);
    } catch {
      return [];
    }
  }

  private get _selectedValues(): string[] {
    try {
      return JSON.parse(this.values);
    } catch {
      return [];
    }
  }

  private get _filteredOptions(): OptionItem[] {
    const opts = this._parsedOptions;
    if (!this._search) return opts;
    const q = this._search.toLowerCase();
    return opts.filter(o => o.label.toLowerCase().includes(q));
  }

  private get _groups(): Map<string, OptionItem[]> {
    const map = new Map<string, OptionItem[]>();
    for (const opt of this._filteredOptions) {
      const group = opt.group || '';
      if (!map.has(group)) map.set(group, []);
      map.get(group)!.push(opt);
    }
    return map;
  }

  private get _flatFiltered(): OptionItem[] {
    // Flat list in display order (groups then items) for keyboard navigation
    const result: OptionItem[] = [];
    for (const [, items] of this._groups) {
      result.push(...items);
    }
    return result;
  }

  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
      min-width: 240px;
      font-family: var(
        --md-sys-typescale-body-large-font,
        var(--md-ref-typeface-plain, Roboto, sans-serif)
      );
    }

    :host([disabled]) {
      opacity: 0.38;
      pointer-events: none;
    }

    /* ── Trigger field ── */
    .trigger {
      display: flex;
      align-items: center;
      min-height: 56px;
      padding: 8px 12px;
      padding-right: 36px;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
      cursor: pointer;
      position: relative;
      transition: border-color 0.2s;
      background: transparent;
      box-sizing: border-box;
    }

    .trigger:hover:not(.focused) {
      border-color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .trigger.focused {
      border-color: var(--md-sys-color-primary, #6750a4);
      border-width: 2px;
      padding: 7px 11px;
      padding-right: 35px;
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

    .focused .label {
      color: var(--md-sys-color-primary, #6750a4);
    }

    /* ── Chips area ── */
    .chips-area {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px;
      flex: 1;
      min-height: 24px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 28px;
      padding: 0 6px 0 10px;
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
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
      from { transform: scale(0.85); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
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
      width: 16px;
      height: 16px;
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

    .chip-remove:hover { opacity: 1; }

    .chip-remove svg {
      width: 10px;
      height: 10px;
      fill: currentColor;
    }

    .placeholder {
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: var(--md-sys-typescale-body-large-size, 1rem);
    }

    /* ── Arrow icon ── */
    .arrow {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      transition: transform 0.2s;
      pointer-events: none;
    }

    .arrow svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    .arrow.open {
      transform: translateY(-50%) rotate(180deg);
    }

    /* ── Dropdown ── */
    .dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 100;
      margin-top: 4px;
      background: var(--md-sys-color-surface-container, #f3edf7);
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      max-height: 304px;
      --md-elevation-level: 2;
      --md-elevation-shadow-color: var(--md-sys-color-shadow, #000);
      overflow-y: auto;
      display: none;
      padding: 8px 0;
    }

    .dropdown.open { display: block; }

    /* ── Search ── */
    .search-container {
      padding: 8px 12px;
      position: sticky;
      top: 0;
      background: var(--md-sys-color-surface-container, #f3edf7);
      z-index: 1;
    }

    .search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
      font-family: inherit;
      font-size: var(--md-sys-typescale-body-medium-size, 0.875rem);
      color: var(--md-sys-color-on-surface, #1d1b20);
      background: var(--md-sys-color-surface, #fef7ff);
      outline: none;
    }

    .search-input:focus {
      border-color: var(--md-sys-color-primary, #6750a4);
      border-width: 2px;
      padding: 9px 11px;
    }

    .search-input::placeholder {
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    /* ── Actions ── */
    .actions {
      display: flex;
      gap: 4px;
      padding: 4px 12px 8px;
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    .action-btn {
      padding: 6px 12px;
      border: none;
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
      font-family: inherit;
      font-size: var(--md-sys-typescale-label-large-size, 0.875rem);
      font-weight: var(--md-sys-typescale-label-large-weight, 500);
      color: var(--md-sys-color-primary, #6750a4);
      background: transparent;
      cursor: pointer;
      transition: background 100ms;
    }

    .action-btn:hover {
      background: color-mix(in srgb, var(--md-sys-color-primary, #6750a4) 8%, transparent);
    }

    /* ── Group header ── */
    .group-header {
      padding: 8px 16px 4px;
      font-size: var(--md-sys-typescale-label-medium-size, 0.75rem);
      font-weight: var(--md-sys-typescale-label-medium-weight, 500);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    /* ── Option ── */
    .option {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      font-size: var(--md-sys-typescale-body-large-size, 1rem);
      color: var(--md-sys-color-on-surface, #1d1b20);
      cursor: pointer;
      transition: background 100ms;
    }

    .option:hover, .option.focused {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, transparent);
    }

    .option.selected {
      background: color-mix(in srgb, var(--md-sys-color-primary, #6750a4) 8%, transparent);
    }

    /* ── Checkbox indicator ── */
    .checkbox {
      width: 18px;
      height: 18px;
      border: 2px solid var(--md-sys-color-on-surface-variant, #49454f);
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 100ms, border-color 100ms;
    }

    .checkbox.checked {
      background: var(--md-sys-color-primary, #6750a4);
      border-color: var(--md-sys-color-primary, #6750a4);
    }

    .checkbox svg {
      width: 14px;
      height: 14px;
      fill: var(--md-sys-color-on-primary, #fff);
    }

    .option-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .no-results {
      padding: 12px 16px;
      font-size: var(--md-sys-typescale-body-medium-size, 0.875rem);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      text-align: center;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('mousedown', this._boundOutsideClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('mousedown', this._boundOutsideClick);
  }

  private _onOutsideClick(e: MouseEvent) {
    if (!this._open) return;
    const path = e.composedPath();
    if (!path.includes(this)) {
      this._open = false;
      this._focused = false;
      this._search = '';
      this._focusedIndex = -1;
    }
  }

  override render() {
    const selected = this._selectedValues;
    const allOpts = this._parsedOptions;
    const filtered = this._filteredOptions;
    const groups = this._groups;
    const flatFiltered = this._flatFiltered;

    const triggerClass = `trigger${this._focused || this._open ? ' focused' : ''}`;

    return html`
      <div
        class=${triggerClass}
        @click=${this._toggleDropdown}
        @keydown=${this._onTriggerKeydown}
        tabindex=${this.disabled ? -1 : 0}
        role="combobox"
        aria-expanded=${this._open}
        aria-haspopup="listbox"
      >
        ${this.label ? html`<span class="label">${this.label}</span>` : nothing}
        <div class="chips-area">
          ${selected.length > 0
            ? selected.map(val => {
                const opt = allOpts.find(o => o.value === val);
                const displayLabel = opt ? opt.label : val;
                return html`
                  <span class="chip">
                    <span class="chip-text">${displayLabel}</span>
                    <button
                      class="chip-remove"
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        this._toggleValue(val);
                      }}
                      aria-label="Remove ${displayLabel}"
                    >
                      <svg viewBox="0 0 24 24">${closeIcon}</svg>
                    </button>
                  </span>
                `;
              })
            : html`<span class="placeholder">${this.placeholder}</span>`
          }
        </div>
        <span class="arrow ${this._open ? 'open' : ''}">
          <svg viewBox="0 0 24 24">${arrowDropDown}</svg>
        </span>
      </div>

      <div class="dropdown ${this._open ? 'open' : ''}" role="listbox" aria-multiselectable="true">
        <md-elevation></md-elevation>
        ${this.searchable ? html`
          <div class="search-container">
            <input
              class="search-input"
              type="text"
              placeholder="Search..."
              .value=${this._search}
              @input=${this._onSearchInput}
              @keydown=${this._onDropdownKeydown}
              @click=${(e: Event) => e.stopPropagation()}
            />
          </div>
        ` : nothing}

        <div class="actions">
          <button class="action-btn" @click=${this._selectAll} @mousedown=${(e: Event) => e.preventDefault()}>
            Select all
          </button>
          <button class="action-btn" @click=${this._clearAll} @mousedown=${(e: Event) => e.preventDefault()}>
            Clear
          </button>
        </div>

        ${flatFiltered.length > 0
          ? html`${Array.from(groups.entries()).map(([groupName, items]) => html`
              ${groupName ? html`<div class="group-header">${groupName}</div>` : nothing}
              ${items.map(opt => {
                const isSelected = selected.includes(opt.value);
                const idx = flatFiltered.indexOf(opt);
                return html`
                  <div
                    class="option ${isSelected ? 'selected' : ''} ${idx === this._focusedIndex ? 'focused' : ''}"
                    role="option"
                    aria-selected=${isSelected}
                    @click=${(e: Event) => { e.stopPropagation(); this._toggleValue(opt.value); }}
                    @mousedown=${(e: Event) => e.preventDefault()}
                  >
                    <span class="checkbox ${isSelected ? 'checked' : ''}">
                      ${isSelected ? svg`<svg viewBox="0 0 24 24">${checkIcon}</svg>` : nothing}
                    </span>
                    <span class="option-label">${opt.label}</span>
                  </div>
                `;
              })}
            `)}`
          : html`<div class="no-results">No results</div>`
        }
      </div>
    `;
  }

  private _toggleDropdown() {
    if (this.disabled) return;
    this._open = !this._open;
    this._focused = this._open;
    if (this._open) {
      this._search = '';
      this._focusedIndex = -1;
      // Focus search input after render
      this.updateComplete.then(() => {
        const searchInput = this.shadowRoot?.querySelector('.search-input') as HTMLInputElement;
        searchInput?.focus();
      });
    }
  }

  private _onTriggerKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._toggleDropdown();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!this._open) {
        this._open = true;
        this._focused = true;
        this._search = '';
        this._focusedIndex = 0;
        this.updateComplete.then(() => {
          const searchInput = this.shadowRoot?.querySelector('.search-input') as HTMLInputElement;
          searchInput?.focus();
        });
      }
    } else if (e.key === 'Escape') {
      this._open = false;
      this._focused = false;
      this._search = '';
    }
  }

  private _onDropdownKeydown(e: KeyboardEvent) {
    const flat = this._flatFiltered;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this._focusedIndex = Math.min(this._focusedIndex + 1, flat.length - 1);
        this._scrollFocusedIntoView();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._focusedIndex = Math.max(this._focusedIndex - 1, 0);
        this._scrollFocusedIntoView();
        break;
      case 'Enter':
      case ' ':
        if (e.key === ' ' && this.searchable) return; // allow space in search
        e.preventDefault();
        if (this._focusedIndex >= 0 && flat[this._focusedIndex]) {
          this._toggleValue(flat[this._focusedIndex].value);
        }
        break;
      case 'Escape':
        this._open = false;
        this._focused = false;
        this._search = '';
        this._focusedIndex = -1;
        // Return focus to trigger
        const trigger = this.shadowRoot?.querySelector('.trigger') as HTMLElement;
        trigger?.focus();
        break;
    }
  }

  private _scrollFocusedIntoView() {
    this.updateComplete.then(() => {
      const focused = this.shadowRoot?.querySelector('.option.focused') as HTMLElement;
      focused?.scrollIntoView({ block: 'nearest' });
    });
  }

  private _onSearchInput(e: Event) {
    this._search = (e.target as HTMLInputElement).value;
    this._focusedIndex = -1;
  }

  private _toggleValue(value: string) {
    const selected = this._selectedValues;
    let newValues: string[];

    if (selected.includes(value)) {
      newValues = selected.filter(v => v !== value);
    } else {
      if (this.maxSelected > 0 && selected.length >= this.maxSelected) return;
      newValues = [...selected, value];
    }

    this.values = JSON.stringify(newValues);
    this._dispatchChange(newValues);
  }

  private _selectAll() {
    const filtered = this._filteredOptions;
    const current = new Set(this._selectedValues);
    for (const opt of filtered) {
      if (this.maxSelected > 0 && current.size >= this.maxSelected) break;
      current.add(opt.value);
    }
    const newValues = Array.from(current);
    this.values = JSON.stringify(newValues);
    this._dispatchChange(newValues);
  }

  private _clearAll() {
    this.values = '[]';
    this._dispatchChange([]);
  }

  private _dispatchChange(newValues: string[]) {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { values: newValues },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define('md-multi-select', MdMultiSelect);

declare global {
  interface HTMLElementTagNameMap {
    'md-multi-select': MdMultiSelect;
  }
}
