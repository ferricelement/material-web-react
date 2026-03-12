import { LitElement, html, css } from 'lit';

/**
 * MdImageList - A container that displays a grid of images.
 * Supports standard (CSS grid) and masonry (CSS columns) variants.
 */
export class MdImageList extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
    columns: { type: Number, reflect: true },
    gap: { type: Number, reflect: true },
  };

  declare variant: 'standard' | 'masonry';
  declare columns: number;
  declare gap: number;

  constructor() {
    super();
    this.variant = 'standard';
    this.columns = 3;
    this.gap = 4;
  }

  static override styles = css`
    :host {
      display: block;
    }

    :host([variant='standard']) .grid {
      display: grid;
      grid-template-columns: repeat(var(--md-image-list-columns, 3), 1fr);
      gap: var(--md-image-list-gap, 4px);
    }

    :host([variant='masonry']) .grid {
      column-count: var(--md-image-list-columns, 3);
      column-gap: var(--md-image-list-gap, 4px);
    }
  `;

  override render() {
    const styleVars = `--md-image-list-columns: ${this.columns}; --md-image-list-gap: ${this.gap}px;`;
    return html`
      <div class="grid" role="list" style="${styleVars}">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('md-image-list', MdImageList);

/**
 * MdImageListItem - An individual item within an image list.
 * Provides a slot for an image and optional label/supporting text overlay.
 */
export class MdImageListItem extends LitElement {
  static override properties = {
    label: { type: String },
    supportingText: { type: String, attribute: 'supporting-text' },
  };

  declare label: string;
  declare supportingText: string;

  constructor() {
    super();
    this.label = '';
    this.supportingText = '';
  }

  static override styles = css`
    :host {
      display: block;
      position: relative;
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      overflow: hidden;
      background: var(--md-sys-color-surface-container, #f3edf7);
      transition: box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
    }

    /* For masonry layout, prevent items from breaking across columns */
    :host {
      break-inside: avoid;
      margin-bottom: var(--md-image-list-gap, 4px);
    }

    :host(:hover) {
      box-shadow:
        0 1px 3px 1px rgba(0, 0, 0, 0.15),
        0 1px 2px 0 rgba(0, 0, 0, 0.3);
    }

    .container {
      position: relative;
      display: flex;
      flex-direction: column;
    }

    .image-wrapper {
      position: relative;
      overflow: hidden;
      line-height: 0;
    }

    ::slotted(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 8px 12px;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.3) 60%,
        transparent 100%
      );
      display: flex;
      flex-direction: column;
      gap: 2px;
      pointer-events: none;
    }

    .label {
      font-family: var(--md-sys-typescale-title-small-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-title-small-size, 14px);
      font-weight: var(--md-sys-typescale-title-small-weight, 500);
      line-height: var(--md-sys-typescale-title-small-line-height, 20px);
      color: #fff;
    }

    .supporting-text {
      font-family: var(--md-sys-typescale-body-small-font, 'Roboto', sans-serif);
      font-size: var(--md-sys-typescale-body-small-size, 12px);
      font-weight: var(--md-sys-typescale-body-small-weight, 400);
      line-height: var(--md-sys-typescale-body-small-line-height, 16px);
      color: rgba(255, 255, 255, 0.8);
    }
  `;

  override render() {
    const hasOverlay = this.label || this.supportingText;
    return html`
      <div class="container" role="listitem">
        <div class="image-wrapper">
          <slot></slot>
        </div>
        ${hasOverlay ? html`
          <div class="overlay">
            ${this.label ? html`<span class="label">${this.label}</span>` : ''}
            ${this.supportingText ? html`<span class="supporting-text">${this.supportingText}</span>` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('md-image-list-item', MdImageListItem);

declare global {
  interface HTMLElementTagNameMap {
    'md-image-list': MdImageList;
    'md-image-list-item': MdImageListItem;
  }
}
