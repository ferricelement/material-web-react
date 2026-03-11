import { LitElement, html, css, nothing } from 'lit';
import '@material/web/elevation/elevation.js';

export class MdCard extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
  };

  declare variant: 'elevated' | 'filled' | 'outlined';

  constructor() {
    super();
    this.variant = 'elevated';
  }

  static override styles = css`
    :host {
      display: block;
      position: relative;
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      overflow: hidden;
      padding: 16px;
    }

    :host([variant='elevated']) {
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
    }

    :host([variant='filled']) {
      background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    }

    :host([variant='outlined']) {
      background: var(--md-sys-color-surface, #fffbfe);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    md-elevation {
      --md-elevation-level: var(--md-card-elevation-level, 1);
    }
  `;

  override render() {
    return html`
      ${this.variant === 'elevated' ? html`<md-elevation></md-elevation>` : nothing}
      <slot></slot>
    `;
  }
}

customElements.define('md-card', MdCard);

declare global {
  interface HTMLElementTagNameMap {
    'md-card': MdCard;
  }
}
