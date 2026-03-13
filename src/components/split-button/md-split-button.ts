import { LitElement, html, svg, css, nothing } from 'lit';
import '@material/web/elevation/elevation.js';

/**
 * MD3 Split Button — a button divided into a leading action and a trailing
 * toggle/dropdown section, separated by a visual divider.
 *
 * Variants: filled, outlined, tonal, elevated (default: filled).
 *
 * @fires action-click - When the leading (main action) button is clicked
 * @fires trailing-click - When the trailing toggle button is clicked
 * @fires toggle-change - When the trailing toggle state changes, detail: { checked }
 */
export class MdSplitButton extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    checked: { type: Boolean, reflect: true },
    label: { type: String },
    ariaLabelAction: { type: String, attribute: 'aria-label-action' },
    ariaLabelTrailing: { type: String, attribute: 'aria-label-trailing' },
  };

  declare variant: 'filled' | 'outlined' | 'tonal' | 'elevated';
  declare disabled: boolean;
  declare checked: boolean;
  declare label: string;
  declare ariaLabelAction: string;
  declare ariaLabelTrailing: string;

  constructor() {
    super();
    this.variant = 'filled';
    this.disabled = false;
    this.checked = false;
    this.label = '';
    this.ariaLabelAction = '';
    this.ariaLabelTrailing = 'Toggle menu';
  }

  /* ------------------------------------------------------------------ */
  /*  Styles                                                             */
  /* ------------------------------------------------------------------ */

  static override styles = css`
    /* ===== Host ===== */
    :host {
      display: inline-flex;
      vertical-align: middle;
      --_gap: 2px;
      --_inner-corner: 4px;
      --_outer-corner: var(--md-sys-shape-corner-full, 100px);
      --_height: 40px;
      --_icon-size: 18px;
      --_transition: 0.2s cubic-bezier(0.2, 0, 0, 1);
    }

    :host([disabled]) {
      pointer-events: none;
    }

    /* ===== Container ===== */
    .container {
      display: inline-flex;
      align-items: center;
      gap: var(--_gap);
      height: var(--_height);
    }

    /* ===== Shared button base ===== */
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      height: 100%;
      padding: 0;
      position: relative;
      overflow: hidden;
      font-family: var(
        --md-sys-typescale-label-large-font,
        var(--md-ref-typeface-plain, Roboto, sans-serif)
      );
      font-size: var(--md-sys-typescale-label-large-size, 0.875rem);
      font-weight: var(--md-sys-typescale-label-large-weight, 500);
      letter-spacing: var(
        --md-sys-typescale-label-large-tracking,
        0.00625rem
      );
      line-height: var(--md-sys-typescale-label-large-line-height, 1.25rem);
      transition: background-color var(--_transition),
        box-shadow var(--_transition), color var(--_transition);
    }

    button:focus-visible {
      outline: 2px solid var(--md-sys-color-primary, #6750a4);
      outline-offset: 2px;
      z-index: 1;
    }

    button::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      opacity: 0;
      transition: opacity var(--_transition);
      pointer-events: none;
    }

    button:hover::after {
      opacity: 0.08;
    }

    button:active::after {
      opacity: 0.12;
    }

    /* ===== Leading (action) button ===== */
    .leading {
      border-radius: var(--_outer-corner) var(--_inner-corner)
        var(--_inner-corner) var(--_outer-corner);
      padding: 0 24px 0 24px;
      gap: 8px;
    }

    :host .leading ::slotted(*) {
      margin-inline-end: 4px;
    }

    /* ===== Trailing (toggle) button ===== */
    .trailing {
      border-radius: var(--_inner-corner) var(--_outer-corner)
        var(--_outer-corner) var(--_inner-corner);
      min-width: var(--_height);
      width: var(--_height);
    }

    .trailing-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
    }

    .trailing-icon svg {
      width: var(--_icon-size);
      height: var(--_icon-size);
      fill: currentColor;
    }

    :host([checked]) .trailing-icon {
      transform: rotate(180deg);
    }

    /* ===== Disabled state ===== */
    :host([disabled]) button {
      cursor: default;
      opacity: 0.38;
    }

    /* ------------------------------------------------------------------ */
    /* Variant: Filled (default)                                          */
    /* ------------------------------------------------------------------ */
    :host([variant='filled']) button,
    :host(:not([variant])) button {
      background: var(--md-sys-color-primary, #6750a4);
      color: var(--md-sys-color-on-primary, #ffffff);
    }

    :host([variant='filled']) button::after,
    :host(:not([variant])) button::after {
      background: var(--md-sys-color-on-primary, #ffffff);
    }

    :host([variant='filled'][disabled]) button,
    :host(:not([variant])[disabled]) button {
      background: color-mix(
        in srgb,
        var(--md-sys-color-on-surface, #1d1b20) 12%,
        transparent
      );
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    /* ------------------------------------------------------------------ */
    /* Variant: Tonal                                                     */
    /* ------------------------------------------------------------------ */
    :host([variant='tonal']) button {
      background: var(
        --md-sys-color-secondary-container,
        #e8def8
      );
      color: var(
        --md-sys-color-on-secondary-container,
        #1d192b
      );
    }

    :host([variant='tonal']) button::after {
      background: var(
        --md-sys-color-on-secondary-container,
        #1d192b
      );
    }

    :host([variant='tonal'][disabled]) button {
      background: color-mix(
        in srgb,
        var(--md-sys-color-on-surface, #1d1b20) 12%,
        transparent
      );
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    /* ------------------------------------------------------------------ */
    /* Variant: Outlined                                                  */
    /* ------------------------------------------------------------------ */
    :host([variant='outlined']) button {
      background: transparent;
      color: var(--md-sys-color-primary, #6750a4);
      box-shadow: inset 0 0 0 1px var(--md-sys-color-outline, #79747e);
    }

    :host([variant='outlined']) button::after {
      background: var(--md-sys-color-primary, #6750a4);
    }

    :host([variant='outlined'][disabled]) button {
      color: var(--md-sys-color-on-surface, #1d1b20);
      box-shadow: inset 0 0 0 1px
        color-mix(
          in srgb,
          var(--md-sys-color-on-surface, #1d1b20) 12%,
          transparent
        );
    }

    /* Outlined divider: use inner border on adjacent edges */
    :host([variant='outlined']) .container {
      --_gap: 0px;
    }

    :host([variant='outlined']) .leading {
      border-right: none;
      border-radius: var(--_outer-corner) 0 0 var(--_outer-corner);
      box-shadow: inset 0 0 0 1px var(--md-sys-color-outline, #79747e);
      clip-path: inset(-4px 0 -4px -4px);
    }

    :host([variant='outlined']) .trailing {
      border-left: none;
      border-radius: 0 var(--_outer-corner) var(--_outer-corner) 0;
      box-shadow: inset 0 0 0 1px var(--md-sys-color-outline, #79747e);
      clip-path: inset(-4px -4px -4px 0);
    }

    :host([variant='outlined']) .divider {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1px;
      height: 100%;
      background: var(--md-sys-color-outline, #79747e);
      flex-shrink: 0;
    }

    :host([variant='outlined'][disabled]) .divider {
      background: color-mix(
        in srgb,
        var(--md-sys-color-on-surface, #1d1b20) 12%,
        transparent
      );
    }

    :host(:not([variant='outlined'])) .divider {
      display: none;
    }

    /* ------------------------------------------------------------------ */
    /* Variant: Elevated                                                  */
    /* ------------------------------------------------------------------ */
    :host([variant='elevated']) button {
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      color: var(--md-sys-color-primary, #6750a4);
      --md-elevation-level: 1;
      --md-elevation-shadow-color: var(--md-sys-color-shadow, #000);
    }

    :host([variant='elevated']) button::after {
      background: var(--md-sys-color-primary, #6750a4);
    }

    :host([variant='elevated']) button:hover {
      --md-elevation-level: 2;
    }

    :host([variant='elevated'][disabled]) button {
      background: color-mix(
        in srgb,
        var(--md-sys-color-on-surface, #1d1b20) 12%,
        transparent
      );
      color: var(--md-sys-color-on-surface, #1d1b20);
      --md-elevation-level: 0;
    }

    /* ------------------------------------------------------------------ */
    /* Ripple (state-layer)                                               */
    /* ------------------------------------------------------------------ */
    .ripple {
      position: absolute;
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.45s ease-out forwards;
      pointer-events: none;
      opacity: 0.12;
    }

    :host([variant='filled']) .ripple,
    :host(:not([variant])) .ripple {
      background: var(--md-sys-color-on-primary, #ffffff);
    }

    :host([variant='tonal']) .ripple {
      background: var(
        --md-sys-color-on-secondary-container,
        #1d192b
      );
    }

    :host([variant='outlined']) .ripple,
    :host([variant='elevated']) .ripple {
      background: var(--md-sys-color-primary, #6750a4);
    }

    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  override render() {
    const chevronDown = svg`<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>`;

    return html`
      <div class="container" role="group">
        <button
          class="leading"
          ?disabled=${this.disabled}
          aria-label=${this.ariaLabelAction || this.label || nothing}
          @click=${this._handleActionClick}
          @pointerdown=${this._ripple}
        >
          <md-elevation></md-elevation>
          <slot name="leading-icon"></slot>
          ${this.label
            ? html`<span class="label-text">${this.label}</span>`
            : html`<slot></slot>`}
        </button>

        <div class="divider" aria-hidden="true"></div>

        <button
          class="trailing"
          ?disabled=${this.disabled}
          aria-label=${this.ariaLabelTrailing}
          aria-pressed=${this.checked}
          @click=${this._handleTrailingClick}
          @pointerdown=${this._ripple}
        >
          <md-elevation></md-elevation>
          <slot name="trailing-icon">
            <span class="trailing-icon">
              <svg viewBox="0 0 24 24">${chevronDown}</svg>
            </span>
          </slot>
        </button>
      </div>
    `;
  }

  /* ------------------------------------------------------------------ */
  /*  Event handlers                                                     */
  /* ------------------------------------------------------------------ */

  private _handleActionClick() {
    this.dispatchEvent(
      new CustomEvent('action-click', { bubbles: true, composed: true }),
    );
  }

  private _handleTrailingClick() {
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent('trailing-click', { bubbles: true, composed: true }),
    );
    this.dispatchEvent(
      new CustomEvent('toggle-change', {
        bubbles: true,
        composed: true,
        detail: { checked: this.checked },
      }),
    );
  }

  /** Simple CSS ripple spawned at pointer position. */
  private _ripple(e: PointerEvent) {
    const button = e.currentTarget as HTMLElement;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    const shadow = button.getRootNode() as ShadowRoot;
    // Append ripple inside the button via shadow root query
    button.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  }
}

customElements.define('md-split-button', MdSplitButton);

declare global {
  interface HTMLElementTagNameMap {
    'md-split-button': MdSplitButton;
  }
}
