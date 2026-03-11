import { LitElement, html, css, nothing } from 'lit';

/**
 * MD3 Side Sheet component.
 *
 * A supplementary surface anchored to the side of the screen.
 *
 * Variants:
 * - `standard`: Coexists with main content, no scrim.
 * - `modal`: Overlays with scrim, fixed positioning.
 *
 * Supports drag-to-dismiss on the drag handle.
 */
export class MdSideSheet extends LitElement {
  static override properties = {
    open: { type: Boolean, reflect: true },
    variant: { type: String, reflect: true },
    side: { type: String, reflect: true },
    showDragHandle: { type: Boolean, attribute: 'show-drag-handle' },
  };

  declare open: boolean;
  declare variant: 'standard' | 'modal';
  declare side: 'start' | 'end';
  declare showDragHandle: boolean;

  private _startX = 0;
  private _currentX = 0;
  private _dragging = false;

  constructor() {
    super();
    this.open = false;
    this.variant = 'modal';
    this.side = 'end';
    this.showDragHandle = true;
  }

  static override styles = css`
    :host {
      display: contents;
    }

    /* Modal overlay */
    .scrim {
      position: fixed;
      inset: 0;
      z-index: 999;
      background: var(--md-sys-color-scrim, #000);
      opacity: 0;
      visibility: hidden;
      transition: opacity 300ms cubic-bezier(0.2, 0, 0, 1),
                  visibility 0s 300ms;
      pointer-events: none;
    }

    :host([variant='modal'][open]) .scrim {
      opacity: 0.32;
      visibility: visible;
      pointer-events: auto;
      transition: opacity 300ms cubic-bezier(0.2, 0, 0, 1);
    }

    /* Sheet container */
    .sheet {
      background: var(--md-sys-color-surface-container-low, #f7f2fa);
      display: flex;
      flex-direction: column;
      width: 360px;
      max-width: calc(100vw - 56px);
      height: 100%;
      overflow: hidden;
      transition: transform 300ms cubic-bezier(0.2, 0, 0, 1);
      will-change: transform;
    }

    /* Modal positioning */
    :host([variant='modal']) .sheet {
      position: fixed;
      top: 0;
      bottom: 0;
      z-index: 1000;
      box-shadow: var(--md-sys-elevation-level1,
        0px 1px 3px 1px rgba(0,0,0,0.15),
        0px 1px 2px 0px rgba(0,0,0,0.3));
    }

    /* End side (right in LTR) */
    :host([side='end']) .sheet,
    :host(:not([side])) .sheet {
      right: 0;
      border-radius: 28px 0 0 28px;
      transform: translateX(100%);
    }

    :host([side='end'][open]) .sheet,
    :host(:not([side])[open]) .sheet {
      transform: translateX(0);
    }

    /* Start side (left in LTR) */
    :host([side='start']) .sheet {
      left: 0;
      border-radius: 0 28px 28px 0;
      transform: translateX(-100%);
    }

    :host([side='start'][open]) .sheet {
      transform: translateX(0);
    }

    /* Standard variant */
    :host([variant='standard']) .sheet {
      position: relative;
      box-shadow: none;
      border-radius: 0;
    }

    :host([variant='standard'][side='end']) .sheet,
    :host([variant='standard']:not([side])) .sheet {
      border-left: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    :host([variant='standard'][side='start']) .sheet {
      border-right: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    .sheet.dragging {
      transition: none;
    }

    /* Drag handle */
    .drag-handle-area {
      display: flex;
      align-items: center;
      padding: 0;
      cursor: grab;
      touch-action: none;
      position: absolute;
      top: 0;
      bottom: 0;
      width: 24px;
      z-index: 1;
    }

    :host([side='end']) .drag-handle-area,
    :host(:not([side])) .drag-handle-area {
      left: 0;
    }

    :host([side='start']) .drag-handle-area {
      right: 0;
    }

    .drag-handle-area:active {
      cursor: grabbing;
    }

    .drag-handle {
      width: 4px;
      height: 32px;
      border-radius: 2px;
      background: var(--md-sys-color-on-surface-variant, #49454f);
      opacity: 0.4;
      margin: 0 auto;
    }

    /* Content */
    .content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
    }

    /* Reset slotted list background to match sheet surface */
    ::slotted(md-list) {
      background: transparent;
      --md-list-container-color: transparent;
    }
  `;

  override render() {
    return html`
      ${this.variant === 'modal'
        ? html`<div class="scrim" @click=${this._handleScrimClick}></div>`
        : nothing}
      <div class="sheet ${this._dragging ? 'dragging' : ''}">
        ${this.showDragHandle
          ? html`
            <div class="drag-handle-area"
              @pointerdown=${this._handleDragStart}
              @pointermove=${this._handleDragMove}
              @pointerup=${this._handleDragEnd}
              @pointercancel=${this._handleDragEnd}
            >
              <div class="drag-handle"></div>
            </div>`
          : nothing}
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      this.dispatchEvent(new CustomEvent('side-sheet-changed', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }));
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this._onKeyDown = this._onKeyDown.bind(this);
    document.addEventListener('keydown', this._onKeyDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._onKeyDown);
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.open && this.variant === 'modal') {
      this.open = false;
    }
  }

  private _handleScrimClick() {
    this.open = false;
  }

  private _handleDragStart(e: PointerEvent) {
    this._dragging = true;
    this._startX = e.clientX;
    this._currentX = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    this.requestUpdate();
  }

  private _handleDragMove(e: PointerEvent) {
    if (!this._dragging) return;
    const delta = e.clientX - this._startX;
    // For end side, positive delta = dragging right (dismiss)
    // For start side, negative delta = dragging left (dismiss)
    if (this.side === 'start') {
      this._currentX = Math.min(0, delta);
    } else {
      this._currentX = Math.max(0, delta);
    }
    const sheet = this.shadowRoot?.querySelector('.sheet') as HTMLElement;
    if (sheet) {
      sheet.style.transform = `translateX(${this._currentX}px)`;
    }
  }

  private _handleDragEnd() {
    if (!this._dragging) return;
    this._dragging = false;
    const sheet = this.shadowRoot?.querySelector('.sheet') as HTMLElement;

    // If dragged more than 100px in dismiss direction, dismiss
    if (Math.abs(this._currentX) > 100) {
      this.open = false;
    }

    if (sheet) {
      sheet.style.transform = '';
    }
    this._currentX = 0;
    this.requestUpdate();
  }
}

customElements.define('md-side-sheet', MdSideSheet);

declare global {
  interface HTMLElementTagNameMap {
    'md-side-sheet': MdSideSheet;
  }
}
