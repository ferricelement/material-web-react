import { LitElement, html, css } from 'lit';

export class MdNavigationRail extends LitElement {
  static override properties = {
    alignment: { type: String, reflect: true },
  };

  declare alignment: 'top' | 'center' | 'bottom';

  constructor() {
    super();
    this.alignment = 'center';
  }

  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 80px;
      min-height: 100%;
      background: var(--md-sys-color-surface, #fffbfe);
    }

    .menu-button {
      display: flex;
      justify-content: center;
      padding: 12px 0;
    }

    .fab-container {
      display: flex;
      justify-content: center;
      padding: 12px 0;
    }

    .items {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px 0;
    }

    :host([alignment='top']) .items {
      justify-content: flex-start;
      flex: 0;
    }

    :host([alignment='center']) .items {
      justify-content: center;
      flex: 1;
    }

    :host([alignment='bottom']) .items {
      justify-content: flex-end;
      flex: 1;
    }
  `;

  override render() {
    return html`
      <div class="menu-button"><slot name="menu"></slot></div>
      <div class="fab-container"><slot name="fab"></slot></div>
      <div class="items"><slot></slot></div>
    `;
  }
}

customElements.define('md-navigation-rail', MdNavigationRail);

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-rail': MdNavigationRail;
  }
}
