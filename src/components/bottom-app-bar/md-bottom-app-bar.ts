import { LitElement, html, css } from 'lit';
import '@material/web/elevation/elevation.js';

export class MdBottomAppBar extends LitElement {
  static override properties = {};

  static override styles = css`
    :host {
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 100;
    }

    .bar {
      position: relative;
      display: flex;
      align-items: center;
      height: 80px;
      padding: 0 4px;
      background: var(--md-sys-color-surface-container, #f3edf7);
      gap: 4px;
    }

    .icons {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .spacer {
      flex: 1;
    }

    .fab-container {
      display: flex;
      align-items: center;
      padding: 0 12px;
    }
  `;

  override render() {
    return html`
      <div class="bar">
        <md-elevation></md-elevation>
        <div class="icons"><slot name="icons"></slot></div>
        <div class="spacer"></div>
        <div class="fab-container"><slot name="fab"></slot></div>
      </div>
    `;
  }
}

customElements.define('md-bottom-app-bar', MdBottomAppBar);

declare global {
  interface HTMLElementTagNameMap {
    'md-bottom-app-bar': MdBottomAppBar;
  }
}
