import { LitElement, html, css } from 'lit';

/**
 * MD3 Accordion container. Wraps multiple md-accordion-item elements.
 * Supports single-expand mode where only one item can be open at a time.
 */
export class MdAccordion extends LitElement {
  static override properties = {
    multiple: { type: Boolean, reflect: true },
  };

  declare multiple: boolean;

  constructor() {
    super();
    this.multiple = false;
  }

  static override styles = css`
    :host {
      display: block;
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      overflow: hidden;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }
  `;

  override render() {
    return html`<slot @accordion-item-toggle=${this._handleToggle}></slot>`;
  }

  private _handleToggle(e: CustomEvent) {
    if (this.multiple) return;
    const toggled = e.target as HTMLElement;
    const slot = this.shadowRoot?.querySelector('slot');
    const items = slot?.assignedElements() || [];
    for (const item of items) {
      if (item !== toggled && (item as any).open) {
        (item as any).open = false;
      }
    }
  }
}

/**
 * MD3 Accordion Item. A single expandable section.
 */
export class MdAccordionItem extends LitElement {
  static override properties = {
    open: { type: Boolean, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  declare open: boolean;
  declare disabled: boolean;

  constructor() {
    super();
    this.open = false;
    this.disabled = false;
  }

  static override styles = css`
    :host {
      display: block;
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    :host(:last-child) {
      border-bottom: none;
    }

    .header {
      display: flex;
      align-items: center;
      padding: 16px 24px;
      cursor: pointer;
      user-select: none;
      background: var(--md-sys-color-surface, #fef7ff);
      transition: background 200ms ease;
      gap: 16px;
    }

    .header:hover {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, var(--md-sys-color-surface, #fef7ff));
    }

    :host([disabled]) .header {
      opacity: 0.38;
      cursor: default;
      pointer-events: none;
    }

    .header-content {
      flex: 1;
      min-width: 0;
    }

    ::slotted([slot="header"]) {
      font-size: 16px;
      font-weight: 500;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .expand-icon {
      width: 24px;
      height: 24px;
      transition: transform 300ms cubic-bezier(0.2, 0, 0, 1);
      fill: var(--md-sys-color-on-surface-variant, #49454f);
      flex-shrink: 0;
    }

    :host([open]) .expand-icon {
      transform: rotate(180deg);
    }

    .body-wrapper {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 300ms cubic-bezier(0.2, 0, 0, 1);
    }

    :host([open]) .body-wrapper {
      grid-template-rows: 1fr;
    }

    .body {
      overflow: hidden;
    }

    .body-content {
      padding: 0 24px 16px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: 14px;
      line-height: 1.5;
    }
  `;

  override render() {
    return html`
      <div class="header" @click=${this._toggle}>
        <div class="header-content">
          <slot name="icon"></slot>
          <slot name="header"></slot>
        </div>
        <svg class="expand-icon" viewBox="0 0 24 24">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
        </svg>
      </div>
      <div class="body-wrapper">
        <div class="body">
          <div class="body-content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }

  private _toggle() {
    if (this.disabled) return;
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent('accordion-item-toggle', {
      detail: { open: this.open },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('md-accordion', MdAccordion);
customElements.define('md-accordion-item', MdAccordionItem);

declare global {
  interface HTMLElementTagNameMap {
    'md-accordion': MdAccordion;
    'md-accordion-item': MdAccordionItem;
  }
}
