import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@material/web/elevation/elevation.js';

@customElement('md-snackbar')
export class MdSnackbar extends LitElement {
  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  message = '';

  @property({ type: Number, attribute: 'auto-close-duration' })
  autoCloseDuration = 5000;

  @property({ type: Boolean, attribute: 'close-on-escape' })
  closeOnEscape = true;

  private _autoCloseTimer?: ReturnType<typeof setTimeout>;

  static override styles = css`
    :host {
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 1000;
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .container {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 288px;
      max-width: 560px;
      padding: 14px 16px;
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
      background: var(--md-sys-color-inverse-surface, #313033);
      color: var(--md-sys-color-inverse-on-surface, #f4eff4);
      font-family: var(--md-ref-typeface-plain, 'Roboto', sans-serif);
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.25px;
    }

    .message {
      flex: 1;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-inline-start: 8px;
    }

    ::slotted([slot='action']) {
      --md-text-button-label-text-color: var(--md-sys-color-inverse-primary, #d0bcff);
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    if (this.closeOnEscape) {
      this._handleKeydown = this._handleKeydown.bind(this);
      document.addEventListener('keydown', this._handleKeydown);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._handleKeydown);
    this._clearAutoClose();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open) {
        this._startAutoClose();
        this.dispatchEvent(new Event('open'));
      } else {
        this._clearAutoClose();
        this.dispatchEvent(new Event('close'));
      }
    }
  }

  close() {
    this.open = false;
  }

  private _startAutoClose() {
    this._clearAutoClose();
    if (this.autoCloseDuration > 0) {
      this._autoCloseTimer = setTimeout(() => {
        this.close();
      }, this.autoCloseDuration);
    }
  }

  private _clearAutoClose() {
    if (this._autoCloseTimer) {
      clearTimeout(this._autoCloseTimer);
      this._autoCloseTimer = undefined;
    }
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.open && this.closeOnEscape) {
      this.close();
    }
  }

  override render() {
    return html`
      <md-elevation></md-elevation>
      <div class="container" role="status" aria-live="polite">
        <span class="message">${this.message}<slot></slot></span>
        <div class="actions">
          <slot name="action"></slot>
          <slot name="dismiss"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-snackbar': MdSnackbar;
  }
}
