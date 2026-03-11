import { LitElement, html, css } from 'lit';
import '@material/web/labs/navigationdrawer/navigation-drawer-modal.js';

/**
 * Wrapper around the labs NavigationDrawerModal that adds proper
 * fixed-position overlay styling that the labs component is missing.
 */
export class MdNavigationDrawerModalWrapper extends LitElement {
  static override properties = {
    opened: { type: Boolean, reflect: true },
    pivot: { type: String },
  };

  declare opened: boolean;
  declare pivot: 'start' | 'end';

  constructor() {
    super();
    this.opened = false;
    this.pivot = 'end';
  }

  static override styles = css`
    :host {
      display: contents;
    }

    .overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      pointer-events: none;
      visibility: hidden;
    }

    :host([opened]) .overlay {
      pointer-events: auto;
      visibility: visible;
    }

    md-navigation-drawer-modal {
      position: fixed;
      inset: 0;
      z-index: 1000;
      --md-navigation-drawer-modal-scrim-color: var(--md-sys-color-scrim, #000);
      --md-navigation-drawer-modal-scrim-opacity: 0.32;
    }
  `;

  override render() {
    return html`
      <div class="overlay">
        <md-navigation-drawer-modal
          .opened=${this.opened}
          .pivot=${this.pivot}
          @navigation-drawer-changed=${this._handleChanged}
        >
          <slot></slot>
        </md-navigation-drawer-modal>
      </div>
    `;
  }

  private _handleChanged(e: CustomEvent) {
    this.opened = e.detail.opened;
    // Re-dispatch so external listeners can hear it
    this.dispatchEvent(new CustomEvent('navigation-drawer-changed', {
      detail: e.detail,
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('md-navigation-drawer-modal-wrapper', MdNavigationDrawerModalWrapper);

declare global {
  interface HTMLElementTagNameMap {
    'md-navigation-drawer-modal-wrapper': MdNavigationDrawerModalWrapper;
  }
}
