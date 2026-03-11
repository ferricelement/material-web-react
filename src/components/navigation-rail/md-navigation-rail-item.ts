import { LitElement, html, css } from 'lit';
import '@material/web/ripple/ripple.js';
import '@material/web/focus/md-focus-ring.js';

export class MdNavigationRailItem extends LitElement {
  static override properties = {
    active: { type: Boolean, reflect: true },
    label: { type: String },
    disabled: { type: Boolean, reflect: true },
  };

  declare active: boolean;
  declare label: string;
  declare disabled: boolean;

  constructor() {
    super();
    this.active = false;
    this.label = '';
    this.disabled = false;
  }

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 56px;
      cursor: pointer;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    :host([disabled]) {
      cursor: default;
      opacity: 0.38;
      pointer-events: none;
    }

    .indicator {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 32px;
      border-radius: 16px;
      overflow: hidden;
      transition: background 200ms ease;
    }

    :host([active]) .indicator {
      background: var(--md-sys-color-secondary-container, #e8def8);
    }

    :host(:not([active])) .indicator:hover {
      background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    }

    .icon {
      color: var(--md-sys-color-on-surface-variant, #49454f);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host([active]) .icon {
      color: var(--md-sys-color-on-secondary-container, #1d192b);
    }

    .label {
      margin-top: 4px;
      font-family: var(--md-ref-typeface-plain, 'Roboto', sans-serif);
      font-size: 12px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0.5px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      text-align: center;
    }

    :host([active]) .label {
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-weight: 700;
    }
  `;

  override render() {
    return html`
      <div class="indicator" @click=${this._handleClick}>
        <md-ripple></md-ripple>
        <md-focus-ring inward></md-focus-ring>
        <div class="icon">
          ${this.active
            ? html`<slot name="active-icon"><slot></slot></slot>`
            : html`<slot></slot>`}
        </div>
      </div>
      ${this.label ? html`<div class="label">${this.label}</div>` : ''}
    `;
  }

  private _handleClick() {
    if (!this.disabled) {
      this.dispatchEvent(new CustomEvent('navigation-rail-item-interaction', {
        bubbles: true,
        composed: true,
        detail: { item: this },
      }));
    }
  }
}

customElements.define('md-navigation-rail-item', MdNavigationRailItem);

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-rail-item': MdNavigationRailItem;
  }
}
