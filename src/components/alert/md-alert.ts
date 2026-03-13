import { LitElement, html, css, nothing, svg } from 'lit';

const severityIcons = {
  info: svg`<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>`,
  success: svg`<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>`,
  warning: svg`<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>`,
  error: svg`<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>`,
};

export class MdAlert extends LitElement {
  static override properties = {
    severity: { type: String, reflect: true },
    variant: { type: String, reflect: true },
    closable: { type: Boolean, reflect: true },
  };

  declare severity: 'info' | 'success' | 'warning' | 'error';
  declare variant: 'standard' | 'filled' | 'outlined';
  declare closable: boolean;

  constructor() {
    super();
    this.severity = 'info';
    this.variant = 'standard';
    this.closable = false;
  }

  static override styles = css`
    :host {
      display: block;

      --_info-color: var(--md-alert-info-color, var(--md-sys-color-primary, #6750a4));
      --_info-container: var(--md-alert-info-container-color, var(--md-sys-color-primary-container, #eaddff));
      --_info-on-container: var(--md-alert-info-on-container-color, var(--md-sys-color-on-primary-container, #21005d));

      --_success-color: var(--md-alert-success-color, #2e7d32);
      --_success-container: var(--md-alert-success-container-color, #e8f5e9);
      --_success-on-container: var(--md-alert-success-on-container-color, #1b5e20);

      --_warning-color: var(--md-alert-warning-color, #ed6c02);
      --_warning-container: var(--md-alert-warning-container-color, #fff3e0);
      --_warning-on-container: var(--md-alert-warning-on-container-color, #e65100);

      --_error-color: var(--md-alert-error-color, var(--md-sys-color-error, #b3261e));
      --_error-container: var(--md-alert-error-container-color, var(--md-sys-color-error-container, #f9dedc));
      --_error-on-container: var(--md-alert-error-on-container-color, var(--md-sys-color-on-error-container, #410e0b));
    }

    /* Severity color mapping */
    :host([severity='info']) { --_color: var(--_info-color); --_container: var(--_info-container); --_on-container: var(--_info-on-container); }
    :host([severity='success']) { --_color: var(--_success-color); --_container: var(--_success-container); --_on-container: var(--_success-on-container); }
    :host([severity='warning']) { --_color: var(--_warning-color); --_container: var(--_warning-container); --_on-container: var(--_warning-on-container); }
    :host([severity='error']) { --_color: var(--_error-color); --_container: var(--_error-container); --_on-container: var(--_error-on-container); }

    .alert {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      font-family: var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto, sans-serif));
      font-size: var(--md-sys-typescale-body-medium-size, 0.875rem);
      line-height: var(--md-sys-typescale-body-medium-line-height, 1.25rem);
      letter-spacing: var(--md-sys-typescale-body-medium-tracking, 0.015625rem);
    }

    /* Standard variant — tonal surface */
    :host([variant='standard']) .alert {
      background: var(--_container);
      color: var(--_on-container);
      border-radius: var(--md-sys-shape-corner-medium, 12px);
    }

    /* Filled variant — prominent, uses main color */
    :host([variant='filled']) .alert {
      background: var(--_color);
      color: var(--md-sys-color-inverse-on-surface, #fff);
    }

    :host([variant='filled']) .icon-container {
      color: var(--md-sys-color-inverse-on-surface, #fff);
    }

    :host([variant='filled']) .close-btn {
      color: var(--md-sys-color-inverse-on-surface, #fff);
    }

    :host([variant='filled']) .close-btn:hover {
      background: rgba(255, 255, 255, 0.12);
    }

    /* Outlined variant */
    :host([variant='outlined']) .alert {
      background: var(--md-sys-color-surface, #fef7ff);
      color: var(--md-sys-color-on-surface, #1d1b20);
      border: 1px solid var(--_color);
    }

    .icon-container {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      color: var(--_color);
    }

    .icon-container svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }

    ::slotted([slot='icon']) {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .content {
      flex: 1;
      min-width: 0;
      padding-top: 1px;
    }

    .actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      margin-left: auto;
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: 50%;
      color: var(--_on-container, var(--md-sys-color-on-surface-variant, #49454f));
      padding: 0;
      margin: -4px -8px -4px 0;
      transition: background-color 0.2s;
    }

    .close-btn:hover {
      background: var(--md-sys-color-on-surface, rgba(0, 0, 0, 0.08));
      background: color-mix(in srgb, currentColor 8%, transparent);
    }

    .close-btn svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
  `;

  override render() {
    const iconSvg = severityIcons[this.severity] || severityIcons.info;

    return html`
      <div class="alert" role="alert">
        <div class="icon-container">
          <slot name="icon">
            <svg viewBox="0 0 24 24">${iconSvg}</svg>
          </slot>
        </div>
        <div class="content">
          <slot></slot>
        </div>
        <div class="actions">
          <slot name="action"></slot>
        </div>
        ${this.closable
          ? html`<button
              class="close-btn"
              @click=${this._close}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24">
                <path
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </button>`
          : nothing}
      </div>
    `;
  }

  private _close() {
    this.dispatchEvent(
      new CustomEvent('close', { bubbles: true, composed: true }),
    );
  }
}

export class MdBanner extends LitElement {
  static override properties = {
    open: { type: Boolean, reflect: true },
    severity: { type: String, reflect: true },
  };

  declare open: boolean;
  declare severity: 'info' | 'success' | 'warning' | 'error';

  constructor() {
    super();
    this.open = false;
    this.severity = 'info';
  }

  static override styles = css`
    :host {
      display: block;

      --_info-color: var(--md-alert-info-color, var(--md-sys-color-primary, #6750a4));
      --_info-container: var(--md-alert-info-container-color, var(--md-sys-color-primary-container, #eaddff));
      --_info-on-container: var(--md-alert-info-on-container-color, var(--md-sys-color-on-primary-container, #21005d));

      --_success-color: var(--md-alert-success-color, #2e7d32);
      --_success-container: var(--md-alert-success-container-color, #e8f5e9);
      --_success-on-container: var(--md-alert-success-on-container-color, #1b5e20);

      --_warning-color: var(--md-alert-warning-color, #ed6c02);
      --_warning-container: var(--md-alert-warning-container-color, #fff3e0);
      --_warning-on-container: var(--md-alert-warning-on-container-color, #e65100);

      --_error-color: var(--md-alert-error-color, var(--md-sys-color-error, #b3261e));
      --_error-container: var(--md-alert-error-container-color, var(--md-sys-color-error-container, #f9dedc));
      --_error-on-container: var(--md-alert-error-on-container-color, var(--md-sys-color-on-error-container, #410e0b));
    }

    :host([severity='info']) { --_color: var(--_info-color); --_container: var(--_info-container); --_on-container: var(--_info-on-container); }
    :host([severity='success']) { --_color: var(--_success-color); --_container: var(--_success-container); --_on-container: var(--_success-on-container); }
    :host([severity='warning']) { --_color: var(--_warning-color); --_container: var(--_warning-container); --_on-container: var(--_warning-on-container); }
    :host([severity='error']) { --_color: var(--_error-color); --_container: var(--_error-container); --_on-container: var(--_error-on-container); }

    :host(:not([open])) {
      display: none;
    }

    .banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--_container);
      color: var(--_on-container);
      border-bottom: 1px solid var(--_color);
      font-family: var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto, sans-serif));
      font-size: var(--md-sys-typescale-body-medium-size, 0.875rem);
      line-height: var(--md-sys-typescale-body-medium-line-height, 1.25rem);
      letter-spacing: var(--md-sys-typescale-body-medium-tracking, 0.015625rem);
    }

    .icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      color: var(--_color);
    }

    .icon svg {
      width: 22px;
      height: 22px;
      fill: currentColor;
    }

    .content {
      flex: 1;
      min-width: 0;
    }

    .actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      gap: 8px;
    }

    .close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: 50%;
      color: var(--_on-container);
      padding: 0;
      transition: background-color 0.2s;
    }

    .close-btn:hover {
      background: color-mix(in srgb, currentColor 8%, transparent);
    }

    .close-btn svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
  `;

  override render() {
    const iconSvg = severityIcons[this.severity] || severityIcons.info;

    return html`
      <div class="banner" role="alert">
        <div class="icon">
          <svg viewBox="0 0 24 24">${iconSvg}</svg>
        </div>
        <div class="content">
          <slot></slot>
        </div>
        <div class="actions">
          <slot name="action"></slot>
        </div>
        <button class="close-btn" @click=${this._close} aria-label="Close">
          <svg viewBox="0 0 24 24">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>
    `;
  }

  private _close() {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent('close', { bubbles: true, composed: true }),
    );
  }
}

customElements.define('md-alert', MdAlert);
customElements.define('md-banner', MdBanner);

declare global {
  interface HTMLElementTagNameMap {
    'md-alert': MdAlert;
    'md-banner': MdBanner;
  }
}
