import { LitElement, html, css, nothing } from 'lit';

/**
 * MD3 Floating Toolbar Item -- an individual action within the toolbar.
 *
 * Renders a slotted icon inside a tappable container with MD3 state-layer
 * (hover / press / focus-visible) interactions.
 */
export class MdFloatingToolbarItem extends LitElement {
  static override properties = {
    label: { type: String },
    disabled: { type: Boolean, reflect: true },
    active: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare disabled: boolean;
  declare active: boolean;

  constructor() {
    super();
    this.label = '';
    this.disabled = false;
    this.active = false;
  }

  static override styles = css`
    :host {
      display: inline-flex;
      position: relative;
    }

    :host([disabled]) {
      pointer-events: none;
      opacity: 0.38;
    }

    .item-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      cursor: pointer;
      padding: 0;
      margin: 0;
      position: relative;
      -webkit-tap-highlight-color: transparent;
      transition: color 0.2s cubic-bezier(0.2, 0, 0, 1),
                  background-color 0.2s cubic-bezier(0.2, 0, 0, 1);
    }

    :host([active]) .item-button {
      color: var(--md-sys-color-primary, #6750a4);
    }

    .item-button::before {
      content: '';
      position: absolute;
      inset: 4px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0;
      transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1);
    }

    .item-button:hover::before {
      opacity: 0.08;
    }

    .item-button:active::before {
      opacity: 0.12;
    }

    .item-button:focus-visible {
      outline: 2px solid var(--md-sys-color-primary, #6750a4);
      outline-offset: 2px;
    }

    .item-button:disabled {
      cursor: default;
    }

    ::slotted(*) {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
  `;

  override render() {
    return html`
      <button
        class="item-button"
        ?disabled=${this.disabled}
        aria-label=${this.label || nothing}
        aria-pressed=${this.active ? 'true' : nothing}
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }

  private _handleClick(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('item-click', { bubbles: true, composed: true }),
    );
  }
}

/**
 * MD3 Floating Toolbar Divider -- a thin visual separator between groups.
 */
export class MdFloatingToolbarDivider extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      padding: 0 4px;
    }

    .divider {
      width: 1px;
      height: 24px;
      background: var(--md-sys-color-outline-variant, #cac4d0);
      border-radius: 0.5px;
    }
  `;

  override render() {
    return html`<div class="divider" role="separator"></div>`;
  }
}

/**
 * MD3 Floating Toolbar -- a contextual toolbar that floats over content.
 *
 * Typically used for text-selection toolbars, contextual actions, or any set
 * of actions that should be overlaid on the current view. Features a rounded
 * pill container with elevation, show/hide animations, and support for
 * standard or vibrant color schemes.
 *
 * @slot - Default slot for `md-floating-toolbar-item` and
 *         `md-floating-toolbar-divider` elements.
 *
 * @fires open  - Dispatched when the toolbar finishes appearing.
 * @fires close - Dispatched when the toolbar finishes hiding.
 */
export class MdFloatingToolbar extends LitElement {
  static override properties = {
    open: { type: Boolean, reflect: true },
    variant: { type: String, reflect: true },
    position: { type: String, reflect: true },
    docked: { type: Boolean, reflect: true },
  };

  /** Whether the toolbar is visible. Animates in/out on change. */
  declare open: boolean;

  /**
   * Color variant.
   * - `"standard"` uses surface-container background (default).
   * - `"vibrant"` uses primary-container background.
   */
  declare variant: 'standard' | 'vibrant';

  /**
   * Positioning hint.
   * - `"top"` -- anchored near the top of the nearest positioned ancestor.
   * - `"bottom"` -- anchored near the bottom (default).
   * - `"center"` -- vertically centered.
   */
  declare position: 'top' | 'bottom' | 'center';

  /**
   * When `true` the toolbar uses a flat (0 dp rounded) shape and no
   * elevation, sitting flush against its container edge -- "docked" mode per
   * the M3 spec.
   */
  declare docked: boolean;

  constructor() {
    super();
    this.open = false;
    this.variant = 'standard';
    this.position = 'bottom';
    this.docked = false;
  }

  static override styles = css`
    /* ─── Host ─────────────────────────────────────────────────── */
    :host {
      display: inline-block;
      position: relative;
      z-index: 50;
    }

    /* ─── Surface container ────────────────────────────────────── */
    .toolbar {
      display: inline-flex;
      align-items: center;
      gap: 0;
      padding: 4px 8px;
      min-height: 48px;
      box-sizing: border-box;

      /* MD3 pill shape (50% of height) */
      border-radius: var(--md-floating-toolbar-container-shape, 9999px);

      /* Standard surface container */
      background: var(
        --md-floating-toolbar-container-color,
        var(--md-sys-color-surface-container, #f3edf7)
      );
      color: var(
        --md-floating-toolbar-on-container-color,
        var(--md-sys-color-on-surface, #1d1b20)
      );

      /* MD3 level-2 shadow */
      box-shadow: var(
        --md-floating-toolbar-container-shadow,
        0 1px 2px rgba(0, 0, 0, 0.3),
        0 2px 6px 2px rgba(0, 0, 0, 0.15)
      );

      /* Show / hide animation */
      opacity: 0;
      transform: scale(0.85);
      pointer-events: none;
      transition:
        opacity 0.2s cubic-bezier(0.2, 0, 0, 1),
        transform 0.25s cubic-bezier(0.05, 0.7, 0.1, 1);
    }

    /* ─── Open state ───────────────────────────────────────────── */
    :host([open]) .toolbar {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }

    /* ─── Vibrant variant ──────────────────────────────────────── */
    :host([variant='vibrant']) .toolbar {
      background: var(
        --md-floating-toolbar-container-color,
        var(--md-sys-color-primary-container, #eaddff)
      );
      color: var(
        --md-floating-toolbar-on-container-color,
        var(--md-sys-color-on-primary-container, #21005d)
      );
    }

    /* ─── Docked variant ───────────────────────────────────────── */
    :host([docked]) .toolbar {
      border-radius: var(--md-floating-toolbar-container-shape, 0);
      box-shadow: none;
      width: 100%;
    }

    :host([docked]) {
      display: block;
    }

    /* ─── Position helpers (apply via host attribute) ──────────── */
    :host([position='top']) {
      /* The consumer can also just use CSS to position.
         These are convenience transforms for the show animation. */
    }

    :host([position='top']) .toolbar {
      transform-origin: top center;
    }

    :host([position='bottom']) .toolbar {
      transform-origin: bottom center;
    }

    :host([position='center']) .toolbar {
      transform-origin: center center;
    }

    /* When open, always scale to 1 regardless of origin */
    :host([open][position='top']) .toolbar,
    :host([open][position='bottom']) .toolbar,
    :host([open][position='center']) .toolbar {
      transform: scale(1);
    }

    /* ─── Slotted items ────────────────────────────────────────── */
    ::slotted(md-floating-toolbar-item) {
      flex-shrink: 0;
    }

    ::slotted(md-floating-toolbar-divider) {
      flex-shrink: 0;
    }
  `;

  override render() {
    return html`
      <div
        class="toolbar"
        role="toolbar"
        aria-hidden=${!this.open}
      >
        <slot></slot>
      </div>
    `;
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      const eventName = this.open ? 'open' : 'close';
      this.dispatchEvent(
        new CustomEvent(eventName, { bubbles: true, composed: true }),
      );
    }
  }

  /** Programmatically show the toolbar. */
  show() {
    this.open = true;
  }

  /** Programmatically hide the toolbar. */
  hide() {
    this.open = false;
  }

  /** Toggle visibility. */
  toggle() {
    this.open = !this.open;
  }
}

customElements.define('md-floating-toolbar', MdFloatingToolbar);
customElements.define('md-floating-toolbar-item', MdFloatingToolbarItem);
customElements.define('md-floating-toolbar-divider', MdFloatingToolbarDivider);

declare global {
  interface HTMLElementTagNameMap {
    'md-floating-toolbar': MdFloatingToolbar;
    'md-floating-toolbar-item': MdFloatingToolbarItem;
    'md-floating-toolbar-divider': MdFloatingToolbarDivider;
  }
}
