import { LitElement, html, css } from 'lit';

/**
 * MD3 Button Group — a container that groups related buttons together
 * with a connected appearance, shared outline, and consistent spacing.
 *
 * Supports filled, outlined, tonal, and elevated variants.
 * Adjacent buttons share edges with small inner corner radii while
 * the outer corners remain fully rounded (pill shape).
 */
export class MdButtonGroup extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    connected: { type: Boolean, reflect: true },
    orientation: { type: String, reflect: true },
  };

  declare variant: 'filled' | 'outlined' | 'tonal' | 'elevated' | 'text';
  declare disabled: boolean;
  declare connected: boolean;
  declare orientation: 'horizontal' | 'vertical';

  constructor() {
    super();
    this.variant = 'outlined';
    this.disabled = false;
    this.connected = true;
    this.orientation = 'horizontal';
  }

  static override styles = css`
    :host {
      display: inline-flex;
      position: relative;
      box-sizing: border-box;
      --_spacing: 0px;
      --_inner-corner: 4px;
      --_outer-corner: 9999px;
    }

    :host([disabled]) {
      pointer-events: none;
      opacity: 0.38;
    }

    /* -- Non-connected: standard spacing between buttons -- */
    :host(:not([connected])) {
      --_spacing: 8px;
      --_inner-corner: 9999px;
    }

    /* -- Orientation -- */
    :host([orientation='vertical']) .container {
      flex-direction: column;
    }

    .container {
      display: inline-flex;
      flex-direction: row;
      align-items: stretch;
      gap: var(--_spacing);
      border-radius: var(--_outer-corner);
      position: relative;
    }

    /* ========================================================
       OUTLINED variant — shared outer outline, inner dividers
       ======================================================== */
    :host([variant='outlined']) .container {
      border: 1px solid var(--md-sys-color-outline, #79747e);
    }

    :host([variant='outlined']) ::slotted(*) {
      --md-filled-button-container-shape: 0px;
      --md-outlined-button-container-shape: 0px;
      --md-text-button-container-shape: 0px;
      border: none !important;
      outline: none;
      background: transparent;
      border-radius: 0;
    }

    /* ========================================================
       FILLED variant
       ======================================================== */
    :host([variant='filled']) .container {
      background: var(--md-sys-color-primary, #6750a4);
      color: var(--md-sys-color-on-primary, #ffffff);
    }

    /* ========================================================
       TONAL variant
       ======================================================== */
    :host([variant='tonal']) .container {
      background: var(--md-sys-color-secondary-container, #e8def8);
      color: var(--md-sys-color-on-secondary-container, #1d192b);
    }

    /* ========================================================
       ELEVATED variant
       ======================================================== */
    :host([variant='elevated']) .container {
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      color: var(--md-sys-color-primary, #6750a4);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3),
        0 1px 3px 1px rgba(0, 0, 0, 0.15);
    }

    /* ========================================================
       Slotted button shapes — connected mode
       First, middle, and last child corner rounding
       ======================================================== */

    /* Horizontal connected */
    :host([connected][orientation='horizontal']) ::slotted(:first-child),
    :host([connected]:not([orientation])) ::slotted(:first-child) {
      border-radius: var(--_outer-corner) var(--_inner-corner)
        var(--_inner-corner) var(--_outer-corner);
    }

    :host([connected][orientation='horizontal']) ::slotted(:last-child),
    :host([connected]:not([orientation])) ::slotted(:last-child) {
      border-radius: var(--_inner-corner) var(--_outer-corner)
        var(--_outer-corner) var(--_inner-corner);
    }

    :host([connected][orientation='horizontal'])
      ::slotted(:not(:first-child):not(:last-child)),
    :host([connected]:not([orientation]))
      ::slotted(:not(:first-child):not(:last-child)) {
      border-radius: var(--_inner-corner);
    }

    /* Single child — full rounding */
    :host([connected]) ::slotted(:only-child) {
      border-radius: var(--_outer-corner);
    }

    /* Vertical connected */
    :host([connected][orientation='vertical']) ::slotted(:first-child) {
      border-radius: var(--_outer-corner) var(--_outer-corner)
        var(--_inner-corner) var(--_inner-corner);
    }

    :host([connected][orientation='vertical']) ::slotted(:last-child) {
      border-radius: var(--_inner-corner) var(--_inner-corner)
        var(--_outer-corner) var(--_outer-corner);
    }

    :host([connected][orientation='vertical'])
      ::slotted(:not(:first-child):not(:last-child)) {
      border-radius: var(--_inner-corner);
    }

    /* ========================================================
       Dividers between connected buttons (outlined variant)
       ======================================================== */
    :host([connected][variant='outlined'][orientation='horizontal'])
      ::slotted(:not(:last-child)),
    :host([connected][variant='outlined']:not([orientation]))
      ::slotted(:not(:last-child)) {
      border-right: 1px solid var(--md-sys-color-outline, #79747e);
    }

    :host([connected][variant='outlined'][orientation='vertical'])
      ::slotted(:not(:last-child)) {
      border-bottom: 1px solid var(--md-sys-color-outline, #79747e);
    }

    /* ========================================================
       Generic slotted button resets for connected mode
       ======================================================== */
    :host([connected]) ::slotted(*) {
      --md-filled-button-container-shape: inherit;
      --md-outlined-button-container-shape: inherit;
      --md-text-button-container-shape: inherit;
      --md-filled-tonal-button-container-shape: inherit;
      --md-elevated-button-container-shape: inherit;
      margin: 0;
      flex-shrink: 0;
    }

    /* Hover state layer for filled/tonal/elevated buttons */
    :host([variant='filled']) ::slotted(*),
    :host([variant='tonal']) ::slotted(*),
    :host([variant='elevated']) ::slotted(*) {
      --md-filled-button-container-color: transparent;
      --md-filled-tonal-button-container-color: transparent;
      --md-elevated-button-container-color: transparent;
      --md-elevated-button-container-shadow-color: transparent;
      --md-elevated-button-container-elevation: 0;
      border: none !important;
      box-shadow: none !important;
    }

    /* Text variant — no container, just grouped */
    :host([variant='text']) ::slotted(*) {
      --md-text-button-container-shape: inherit;
    }
  `;

  override render() {
    return html`
      <div
        class="container"
        role="group"
        aria-label=${this.ariaLabel || 'Button group'}
        aria-disabled=${this.disabled}
        aria-orientation=${this.orientation}
      >
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
    `;
  }

  private _onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const children = slot.assignedElements({ flatten: true });

    children.forEach((child) => {
      if (this.disabled) {
        child.setAttribute('disabled', '');
      }
    });

    this.dispatchEvent(
      new CustomEvent('slot-change', {
        bubbles: true,
        composed: true,
        detail: { count: children.length },
      }),
    );
  }
}

customElements.define('md-button-group', MdButtonGroup);

declare global {
  interface HTMLElementTagNameMap {
    'md-button-group': MdButtonGroup;
  }
}
