import { LitElement, html, css } from 'lit';

/**
 * MD3 Swipe Actions container. Wraps content to make it swipeable,
 * revealing action buttons behind the main content row.
 */
export class MdSwipeActions extends LitElement {
  static override properties = {
    disabled: { type: Boolean, reflect: true },
    threshold: { type: Number },
  };

  declare disabled: boolean;
  declare threshold: number;

  private _startX: number = 0;
  private _startY: number = 0;
  private _currentX: number = 0;
  private _isSwiping: boolean = false;
  private _directionLocked: boolean = false;
  private _isHorizontal: boolean = false;
  private _openDirection: 'start' | 'end' | null = null;

  constructor() {
    super();
    this.disabled = false;
    this.threshold = 0.4;
  }

  static override styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
      touch-action: pan-y;
    }

    :host([disabled]) {
      pointer-events: none;
    }

    .actions-container {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: stretch;
    }

    .actions-start {
      left: 0;
      background: var(--md-sys-color-tertiary-container, #ffd8e4);
    }

    .actions-end {
      right: 0;
      background: var(--md-sys-color-error-container, #f9dedc);
    }

    .content {
      position: relative;
      z-index: 1;
      background: var(--md-sys-color-surface, #fef7ff);
      will-change: transform;
    }

    .content.animating {
      transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
      flex-shrink: 0;
    }
  `;

  override render() {
    return html`
      <div class="actions-container actions-start">
        <slot name="start"></slot>
      </div>
      <div class="actions-container actions-end">
        <slot name="end"></slot>
      </div>
      <div
        class="content"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
      >
        <slot></slot>
      </div>
    `;
  }

  private _getContentEl(): HTMLElement | null {
    return this.shadowRoot?.querySelector('.content') ?? null;
  }

  private _onPointerDown(e: PointerEvent) {
    if (this.disabled) return;

    const content = this._getContentEl();
    if (!content) return;

    content.setPointerCapture(e.pointerId);
    content.classList.remove('animating');

    this._startX = e.clientX;
    this._startY = e.clientY;
    this._currentX = this._getCurrentTranslateX();
    this._isSwiping = true;
    this._directionLocked = false;
    this._isHorizontal = false;
  }

  private _onPointerMove(e: PointerEvent) {
    if (!this._isSwiping || this.disabled) return;

    const deltaX = e.clientX - this._startX;
    const deltaY = e.clientY - this._startY;

    // Lock direction after a small movement
    if (!this._directionLocked && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      this._directionLocked = true;
      const angle = Math.abs(Math.atan2(deltaY, deltaX) * (180 / Math.PI));
      // Consider horizontal if within 30 degrees of the horizontal axis
      this._isHorizontal = angle < 30 || angle > 150;

      if (!this._isHorizontal) {
        this._isSwiping = false;
        return;
      }

      this.dispatchEvent(new CustomEvent('swipe-start', {
        detail: { direction: deltaX > 0 ? 'start' : 'end' },
        bubbles: true,
        composed: true,
      }));
    }

    if (!this._isHorizontal) return;

    e.preventDefault();

    const content = this._getContentEl();
    if (!content) return;

    let newX = this._currentX + deltaX;

    // Prevent swiping in wrong direction if no actions exist
    const startSlot = this.shadowRoot?.querySelector('slot[name="start"]') as HTMLSlotElement | null;
    const endSlot = this.shadowRoot?.querySelector('slot[name="end"]') as HTMLSlotElement | null;
    const hasStartActions = (startSlot?.assignedElements().length ?? 0) > 0;
    const hasEndActions = (endSlot?.assignedElements().length ?? 0) > 0;

    if (newX > 0 && !hasStartActions) newX = 0;
    if (newX < 0 && !hasEndActions) newX = 0;

    // Apply resistance at extremes
    const hostWidth = this.offsetWidth;
    const maxSwipe = hostWidth * 0.8;
    if (Math.abs(newX) > maxSwipe) {
      const over = Math.abs(newX) - maxSwipe;
      newX = Math.sign(newX) * (maxSwipe + over * 0.2);
    }

    content.style.transform = `translateX(${newX}px)`;
  }

  private _onPointerUp(e: PointerEvent) {
    if (!this._isSwiping) return;
    this._isSwiping = false;

    if (!this._isHorizontal) return;

    const content = this._getContentEl();
    if (!content) return;

    content.classList.add('animating');

    const translateX = this._getCurrentTranslateX();
    const hostWidth = this.offsetWidth;
    const ratio = Math.abs(translateX) / hostWidth;

    if (ratio >= this.threshold) {
      // Lock open — find the width of the revealed actions
      const direction: 'start' | 'end' = translateX > 0 ? 'start' : 'end';
      const slotName = direction === 'start' ? 'start' : 'end';
      const slot = this.shadowRoot?.querySelector(`slot[name="${slotName}"]`) as HTMLSlotElement | null;
      const actions = slot?.assignedElements() ?? [];
      let actionsWidth = 0;
      for (const action of actions) {
        actionsWidth += (action as HTMLElement).offsetWidth;
      }

      const lockX = direction === 'start' ? actionsWidth : -actionsWidth;
      content.style.transform = `translateX(${lockX}px)`;
      this._openDirection = direction;

      this.dispatchEvent(new CustomEvent('swipe-end', {
        detail: { direction },
        bubbles: true,
        composed: true,
      }));
    } else {
      // Snap back
      content.style.transform = 'translateX(0)';
      this._openDirection = null;

      if (Math.abs(translateX) > 5) {
        this.dispatchEvent(new CustomEvent('swipe-end', {
          detail: { direction: translateX > 0 ? 'start' : 'end' },
          bubbles: true,
          composed: true,
        }));
      }
    }
  }

  private _getCurrentTranslateX(): number {
    const content = this._getContentEl();
    if (!content) return 0;
    const style = getComputedStyle(content);
    const matrix = new DOMMatrix(style.transform);
    return matrix.m41;
  }

  /** Programmatically close (snap back) the swipe actions. */
  close() {
    const content = this._getContentEl();
    if (!content) return;
    content.classList.add('animating');
    content.style.transform = 'translateX(0)';
    this._openDirection = null;
  }
}

/**
 * MD3 Swipe Action. An individual action button revealed by swiping.
 */
export class MdSwipeAction extends LitElement {
  static override properties = {
    label: { type: String },
    color: { type: String },
  };

  declare label: string;
  declare color: string;

  constructor() {
    super();
    this.label = '';
    this.color = '';
  }

  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 4px;
      min-width: 72px;
      padding: 0 16px;
      cursor: pointer;
      user-select: none;
      font-family: var(--md-sys-typescale-label-medium-font, Roboto, sans-serif);
      font-size: var(--md-sys-typescale-label-medium-size, 12px);
      font-weight: var(--md-sys-typescale-label-medium-weight, 500);
      line-height: var(--md-sys-typescale-label-medium-line-height, 16px);
      letter-spacing: var(--md-sys-typescale-label-medium-tracking, 0.5px);
      color: var(--md-swipe-action-color, var(--md-sys-color-on-surface, #1d1b20));
      background: var(--md-swipe-action-background, transparent);
      transition: opacity 200ms ease;
    }

    :host(:hover) {
      opacity: 0.85;
    }

    :host(:active) {
      opacity: 0.7;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .label {
      white-space: nowrap;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this._applyColor();
  }

  override updated() {
    this._applyColor();
  }

  private _applyColor() {
    if (this.color) {
      this.style.setProperty('--md-swipe-action-background', this.color);
    }
  }

  override render() {
    return html`
      <div class="icon" @click=${this._onClick}>
        <slot></slot>
      </div>
      ${this.label ? html`<span class="label" @click=${this._onClick}>${this.label}</span>` : ''}
    `;
  }

  private _onClick() {
    this.dispatchEvent(new CustomEvent('action-click', {
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('md-swipe-actions', MdSwipeActions);
customElements.define('md-swipe-action', MdSwipeAction);

declare global {
  interface HTMLElementTagNameMap {
    'md-swipe-actions': MdSwipeActions;
    'md-swipe-action': MdSwipeAction;
  }
}
