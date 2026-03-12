import { LitElement, html, css, svg } from 'lit';

/**
 * MD3 Tree View container. Wraps multiple md-tree-item elements.
 */
export class MdTreeView extends LitElement {
  static override styles = css`
    :host {
      display: block;
      font-family: var(--md-sys-typescale-body-large-font, 'Roboto', sans-serif);
    }
  `;

  override render() {
    return html`<slot @item-select=${this._handleSelect}></slot>`;
  }

  private _handleSelect(e: CustomEvent) {
    // Allow event to bubble up naturally
  }
}

/**
 * MD3 Tree Item. An individual node that can contain nested tree items.
 * Supports expand/collapse, selection, disabled state, and leaf mode.
 */
export class MdTreeItem extends LitElement {
  static override properties = {
    label: { type: String },
    value: { type: String },
    expanded: { type: Boolean, reflect: true },
    selected: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
    leaf: { type: Boolean, reflect: true },
    depth: { type: Number },
  };

  declare label: string;
  declare value: string;
  declare expanded: boolean;
  declare selected: boolean;
  declare disabled: boolean;
  declare leaf: boolean;
  declare depth: number;

  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.expanded = false;
    this.selected = false;
    this.disabled = false;
    this.leaf = false;
    this.depth = 0;
  }

  static override styles = css`
    :host {
      display: block;
    }

    :host([disabled]) {
      pointer-events: none;
    }

    .item-row {
      display: flex;
      align-items: center;
      min-height: 40px;
      padding: 4px 12px 4px 0;
      cursor: pointer;
      user-select: none;
      border-radius: var(--md-sys-shape-corner-small, 8px);
      transition: background 200ms ease;
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-size: 14px;
      position: relative;
    }

    .item-row:hover {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, transparent);
    }

    :host([selected]) .item-row {
      background: var(--md-sys-color-secondary-container, #e8def8);
      color: var(--md-sys-color-on-secondary-container, #1d192b);
    }

    :host([selected]) .item-row:hover {
      background: color-mix(in srgb, var(--md-sys-color-on-secondary-container, #1d192b) 8%, var(--md-sys-color-secondary-container, #e8def8));
    }

    :host([disabled]) .item-row {
      opacity: 0.38;
      cursor: default;
    }

    .indent-area {
      display: flex;
      align-items: stretch;
      align-self: stretch;
      flex-shrink: 0;
    }

    .indent-guide {
      width: 24px;
      position: relative;
      flex-shrink: 0;
    }

    .indent-guide::before {
      content: '';
      position: absolute;
      left: 12px;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--md-sys-color-outline-variant, #cac4d0);
    }

    .expand-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
      fill: var(--md-sys-color-on-surface-variant, #49454f);
    }

    :host([expanded]) .expand-icon {
      transform: rotate(90deg);
    }

    .expand-spacer {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }

    .label {
      flex: 1;
      padding-left: 8px;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .children-wrapper {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 200ms cubic-bezier(0.2, 0, 0, 1);
    }

    :host([expanded]) .children-wrapper {
      grid-template-rows: 1fr;
    }

    .children {
      overflow: hidden;
    }

    ::slotted([slot="icon"]) {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      margin-left: 4px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this._updateChildDepths();
  }

  override updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('depth')) {
      this._updateChildDepths();
    }
  }

  private _updateChildDepths() {
    const slot = this.shadowRoot?.querySelector('slot:not([name])');
    if (slot) {
      const items = (slot as HTMLSlotElement).assignedElements().filter(
        (el) => el.tagName === 'MD-TREE-ITEM'
      ) as MdTreeItem[];
      for (const item of items) {
        item.depth = this.depth + 1;
      }
    }
  }

  private _chevronIcon() {
    return svg`<svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>`;
  }

  override render() {
    const indentGuides = [];
    for (let i = 0; i < this.depth; i++) {
      indentGuides.push(html`<div class="indent-guide"></div>`);
    }

    return html`
      <div class="item-row" @click=${this._handleClick}>
        ${this.depth > 0 ? html`<div class="indent-area">${indentGuides}</div>` : ''}
        ${this.leaf
          ? html`<div class="expand-spacer"></div>`
          : html`<div class="expand-icon" @click=${this._handleToggle}>${this._chevronIcon()}</div>`
        }
        <slot name="icon"></slot>
        <div class="label">${this.label}</div>
        <slot name="trailing"></slot>
      </div>
      <div class="children-wrapper">
        <div class="children">
          <slot @slotchange=${this._updateChildDepths}></slot>
        </div>
      </div>
    `;
  }

  private _handleToggle(e: Event) {
    e.stopPropagation();
    if (this.disabled) return;
    this.expanded = !this.expanded;
    this.dispatchEvent(new CustomEvent('toggle', {
      detail: { value: this.value, expanded: this.expanded },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleClick(e: Event) {
    if (this.disabled) return;
    // If clicking the expand icon, that handler takes care of it
    const target = e.target as HTMLElement;
    if (target.closest?.('.expand-icon')) return;

    this.selected = !this.selected;
    this.dispatchEvent(new CustomEvent('item-select', {
      detail: { value: this.value, selected: this.selected },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('md-tree-view', MdTreeView);
customElements.define('md-tree-item', MdTreeItem);

declare global {
  interface HTMLElementTagNameMap {
    'md-tree-view': MdTreeView;
    'md-tree-item': MdTreeItem;
  }
}
