import { LitElement, html, css, nothing } from 'lit';

/**
 * MD3 Avatar component.
 *
 * Displays a user profile image, initials, or icon in a circular container.
 */
export class MdAvatar extends LitElement {
  static override properties = {
    src: { type: String },
    initials: { type: String },
    size: { type: String, reflect: true },
  };

  declare src: string;
  declare initials: string;
  declare size: 'small' | 'medium' | 'large';

  constructor() {
    super();
    this.src = '';
    this.initials = '';
    this.size = 'medium';
  }

  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      background: var(--md-sys-color-primary-container, #eaddff);
      color: var(--md-sys-color-on-primary-container, #21005d);
      user-select: none;
      flex-shrink: 0;
    }

    :host([size="small"]) {
      width: 28px;
      height: 28px;
      font-size: 11px;
    }

    :host([size="medium"]) {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }

    :host([size="large"]) {
      width: 56px;
      height: 56px;
      font-size: 22px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .initials {
      font-weight: 500;
      line-height: 1;
      letter-spacing: 0.5px;
    }

    .icon-slot {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    ::slotted(*) {
      color: var(--md-sys-color-on-primary-container, #21005d);
    }

    :host([size="small"]) ::slotted(*) {
      --md-icon-size: 16px;
      font-size: 16px;
    }

    :host([size="medium"]) ::slotted(*) {
      --md-icon-size: 24px;
      font-size: 24px;
    }

    :host([size="large"]) ::slotted(*) {
      --md-icon-size: 32px;
      font-size: 32px;
    }
  `;

  override render() {
    if (this.src) {
      return html`<img src=${this.src} alt="" />`;
    }
    if (this.initials) {
      return html`<span class="initials">${this.initials}</span>`;
    }
    return html`<span class="icon-slot"><slot>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </slot></span>`;
  }
}

customElements.define('md-avatar', MdAvatar);

declare global {
  interface HTMLElementTagNameMap {
    'md-avatar': MdAvatar;
  }
}
