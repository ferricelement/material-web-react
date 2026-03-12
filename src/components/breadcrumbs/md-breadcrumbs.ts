import { LitElement, html, css } from 'lit';

export class MdBreadcrumbs extends LitElement {
  static override properties = {
    separator: { type: String, reflect: true },
  };

  declare separator: string;

  constructor() {
    super();
    this.separator = '/';
  }

  static override styles = css`
    :host {
      display: block;
    }

    nav {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 4px;
    }
  `;

  override render() {
    return html`
      <nav aria-label="Breadcrumb">
        <slot
          @slotchange=${this._onSlotChange}
          style="display:contents"
        ></slot>
      </nav>
    `;
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('separator')) {
      this._updateSeparators();
    }
  }

  private _onSlotChange() {
    this._updateSeparators();
    this._updateLastItem();
  }

  private _updateSeparators() {
    const slot = this.shadowRoot?.querySelector('slot');
    const items = slot
      ?.assignedElements()
      .filter((el) => el.tagName === 'MD-BREADCRUMB-ITEM');
    if (!items) return;
    for (const item of items) {
      (item as MdBreadcrumbItem).separatorChar = this.separator;
    }
  }

  private _updateLastItem() {
    const slot = this.shadowRoot?.querySelector('slot');
    const items = slot
      ?.assignedElements()
      .filter((el) => el.tagName === 'MD-BREADCRUMB-ITEM');
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i] as MdBreadcrumbItem;
      item.isLast = i === items.length - 1;
      item.isFirst = i === 0;
    }
  }
}

export class MdBreadcrumbItem extends LitElement {
  static override properties = {
    href: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    isLast: { type: Boolean, attribute: false },
    isFirst: { type: Boolean, attribute: false },
    separatorChar: { type: String, attribute: false },
  };

  declare href: string;
  declare disabled: boolean;
  declare isLast: boolean;
  declare isFirst: boolean;
  declare separatorChar: string;

  constructor() {
    super();
    this.href = '';
    this.disabled = false;
    this.isLast = false;
    this.isFirst = false;
    this.separatorChar = '/';
  }

  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-family: var(
        --md-sys-typescale-label-large-font,
        var(--md-ref-typeface-plain, Roboto, sans-serif)
      );
      font-size: var(--md-sys-typescale-label-large-size, 0.875rem);
      font-weight: var(--md-sys-typescale-label-large-weight, 500);
      line-height: var(--md-sys-typescale-label-large-line-height, 1.25rem);
      letter-spacing: var(
        --md-sys-typescale-label-large-tracking,
        0.00625rem
      );
    }

    .separator {
      color: var(--md-sys-color-on-surface-variant, #49454f);
      user-select: none;
      font-weight: 400;
    }

    :host([disabled]) {
      opacity: 0.38;
      pointer-events: none;
    }

    a {
      color: var(--md-sys-color-primary, #6750a4);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
      padding: 4px 4px;
      margin: -4px -4px;
      transition: background-color 0.2s;
    }

    a:hover {
      text-decoration: underline;
      background-color: var(--md-sys-color-primary-container, #eaddff);
    }

    a:focus-visible {
      outline: 2px solid var(--md-sys-color-primary, #6750a4);
      outline-offset: 2px;
    }

    .current {
      color: var(--md-sys-color-on-surface, #1d1b20);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 4px;
      margin: -4px -4px;
    }

    ::slotted([slot='icon']) {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
  `;

  override render() {
    const separator = !this.isFirst
      ? html`<span class="separator">${this.separatorChar}</span>`
      : null;

    const content = html`<slot name="icon"></slot><slot></slot>`;

    const item =
      this.href && !this.isLast
        ? html`<a href=${this.href}>${content}</a>`
        : html`<span
            class="current"
            aria-current=${this.isLast ? 'page' : 'false'}
            >${content}</span
          >`;

    return html`${separator}${item}`;
  }
}

customElements.define('md-breadcrumbs', MdBreadcrumbs);
customElements.define('md-breadcrumb-item', MdBreadcrumbItem);

declare global {
  interface HTMLElementTagNameMap {
    'md-breadcrumbs': MdBreadcrumbs;
    'md-breadcrumb-item': MdBreadcrumbItem;
  }
}
