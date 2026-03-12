import { LitElement, html, svg, css } from 'lit';

/**
 * MD3 Pull-to-Refresh component.
 *
 * Wraps scrollable content and adds pull-down-to-refresh behavior.
 * The entire content area translates downward during a pull gesture,
 * revealing the refresh indicator above.
 * Works with both touch (mobile) and pointer/mouse (desktop) events.
 */
export class MdPullToRefresh extends LitElement {
  static override properties = {
    disabled: { type: Boolean, reflect: true },
    refreshing: { type: Boolean, reflect: true },
    threshold: { type: Number },
  };

  declare disabled: boolean;
  declare refreshing: boolean;
  declare threshold: number;

  private _startY = 0;
  private _startX = 0;
  private _pullDistance = 0;
  private _pulling = false;
  private _tracking = false;
  private _isHorizontal: boolean | null = null;

  constructor() {
    super();
    this.disabled = false;
    this.refreshing = false;
    this.threshold = 80;
  }

  static override styles = css`
    :host {
      display: block;
      position: relative;
      overflow: hidden;
    }

    :host([disabled]) {
      pointer-events: none;
    }

    .scroll-container {
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior-y: contain;
      will-change: transform;
    }

    .scroll-container.pulling {
      transition: none;
      user-select: none;
      -webkit-user-select: none;
    }

    .scroll-container:not(.pulling) {
      transition: transform 300ms cubic-bezier(0.2, 0, 0, 1);
    }

    .indicator-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      pointer-events: none;
      z-index: 1;
    }

    .indicator {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--md-sys-color-primary-container, #eaddff);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15),
        0px 1px 2px 0px rgba(0, 0, 0, 0.3);
      will-change: transform, opacity;
    }

    .indicator.pulling {
      transition: none;
    }

    .indicator:not(.pulling) {
      transition: transform 300ms cubic-bezier(0.2, 0, 0, 1),
        opacity 300ms cubic-bezier(0.2, 0, 0, 1);
    }

    .spinner-svg {
      width: 24px;
      height: 24px;
    }

    .spinner-circle {
      fill: none;
      stroke: var(--md-sys-color-primary, #6750a4);
      stroke-width: 3;
      stroke-linecap: round;
      transform-origin: center;
    }

    .spinner-circle.spinning {
      animation: spin 1.2s linear infinite, dash 1.5s ease-in-out infinite;
    }

    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 70, 150;
        stroke-dashoffset: -25;
      }
      100% {
        stroke-dasharray: 70, 150;
        stroke-dashoffset: -99;
      }
    }
  `;

  override render() {
    const progress = Math.min(this._pullDistance / this.threshold, 1);
    const circumference = 2 * Math.PI * 9;
    const arcLength = this.refreshing
      ? circumference
      : progress * circumference * 0.75;

    // How far content + indicator translate down
    const resistedDistance = this._pulling
      ? this._applyResistance(this._pullDistance)
      : 0;

    const refreshOffset = 56; // space for indicator during refresh

    // Content translation
    const contentY = this._pulling
      ? resistedDistance
      : this.refreshing
        ? refreshOffset
        : 0;

    // Indicator position: centered above the content, revealed by content moving down
    const indicatorY = this._pulling
      ? resistedDistance - 48
      : this.refreshing
        ? (refreshOffset - 40) / 2
        : -48;

    const indicatorScale = this._pulling
      ? 0.5 + progress * 0.5
      : this.refreshing
        ? 1
        : 0.5;

    const indicatorOpacity = this._pulling
      ? progress
      : this.refreshing
        ? 1
        : 0;

    const isPullingOrRefreshing = this._pulling || this.refreshing;

    return html`
      <div
        class="indicator-container"
        style="transform: translateY(${indicatorY}px)"
      >
        <div
          class="indicator ${this._pulling ? 'pulling' : ''}"
          style="transform: scale(${indicatorScale}); opacity: ${indicatorOpacity}"
        >
          <svg class="spinner-svg" viewBox="0 0 24 24">
            ${svg`
              <circle
                class="spinner-circle ${this.refreshing ? 'spinning' : ''}"
                cx="12"
                cy="12"
                r="9"
                stroke-dasharray="${arcLength} ${circumference}"
                stroke-dashoffset="0"
              />
            `}
          </svg>
        </div>
      </div>
      <div
        class="scroll-container ${this._pulling ? 'pulling' : ''}"
        style="transform: translateY(${contentY}px)"
      >
        <slot></slot>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('touchstart', this._onTouchStart, { passive: true });
    this.addEventListener('touchmove', this._onTouchMove, { passive: false });
    this.addEventListener('touchend', this._onTouchEnd);
    this.addEventListener('touchcancel', this._onTouchEnd);
    this.addEventListener('pointerdown', this._onPointerDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('touchstart', this._onTouchStart);
    this.removeEventListener('touchmove', this._onTouchMove);
    this.removeEventListener('touchend', this._onTouchEnd);
    this.removeEventListener('touchcancel', this._onTouchEnd);
    this.removeEventListener('pointerdown', this._onPointerDown);
    document.removeEventListener('pointermove', this._onPointerMove);
    document.removeEventListener('pointerup', this._onPointerUp);
  }

  override updated(changed: Map<string, unknown>) {
    if (
      changed.has('refreshing') &&
      !this.refreshing &&
      changed.get('refreshing') === true
    ) {
      this._pullDistance = 0;
      this.requestUpdate();
    }
  }

  private _applyResistance(distance: number): number {
    if (distance <= this.threshold) return distance;
    const over = distance - this.threshold;
    return this.threshold + over * 0.4;
  }

  private get _scrollContainer(): HTMLElement | null {
    return this.shadowRoot?.querySelector('.scroll-container') ?? null;
  }

  private _canPull(): boolean {
    const sc = this._scrollContainer;
    const scrollTop = sc ? sc.scrollTop : 0;
    return !this.disabled && !this.refreshing && scrollTop <= 0;
  }

  // ── Touch events (mobile) ──

  private _onTouchStart = (e: TouchEvent) => {
    if (!this._canPull()) return;
    this._startTracking(e.touches[0].clientY, e.touches[0].clientX);
  };

  private _onTouchMove = (e: TouchEvent) => {
    if (!this._tracking) return;
    const moved = this._handleMove(
      e.touches[0].clientY,
      e.touches[0].clientX,
    );
    if (moved && this._pulling) {
      e.preventDefault();
    }
  };

  private _onTouchEnd = () => {
    this._endTracking();
  };

  // ── Pointer events (desktop) ──

  private _onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (e.button !== 0) return;
    if (!this._canPull()) return;
    this._startTracking(e.clientY, e.clientX);
    document.addEventListener('pointermove', this._onPointerMove);
    document.addEventListener('pointerup', this._onPointerUp);
  };

  private _onPointerMove = (e: PointerEvent) => {
    if (!this._tracking) return;
    this._handleMove(e.clientY, e.clientX);
  };

  private _onPointerUp = () => {
    this._endTracking();
    document.removeEventListener('pointermove', this._onPointerMove);
    document.removeEventListener('pointerup', this._onPointerUp);
  };

  // ── Shared logic ──

  private _startTracking(y: number, x: number) {
    this._startY = y;
    this._startX = x;
    this._tracking = true;
    this._pulling = false;
    this._pullDistance = 0;
    this._isHorizontal = null;
  }

  private _handleMove(y: number, x: number): boolean {
    const deltaY = y - this._startY;
    const deltaX = x - this._startX;

    if (this._isHorizontal === null) {
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        this._isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    if (this._isHorizontal) return false;

    if (deltaY <= 0) {
      if (this._pulling) {
        this._pulling = false;
        this._pullDistance = 0;
        this.requestUpdate();
      }
      return false;
    }

    const sc = this._scrollContainer;
    if (sc && sc.scrollTop > 0) return false;

    this._pulling = true;
    this._pullDistance = deltaY;
    this.requestUpdate();
    return true;
  }

  private _endTracking() {
    if (!this._tracking) return;

    const pastThreshold = this._pulling && this._pullDistance >= this.threshold;
    this._pulling = false;
    this._tracking = false;
    this._isHorizontal = null;

    if (pastThreshold) {
      this.refreshing = true;
      this.dispatchEvent(
        new CustomEvent('refresh', {
          bubbles: true,
          composed: true,
        }),
      );
    } else {
      this._pullDistance = 0;
    }

    this.requestUpdate();
  }
}

customElements.define('md-pull-to-refresh', MdPullToRefresh);

declare global {
  interface HTMLElementTagNameMap {
    'md-pull-to-refresh': MdPullToRefresh;
  }
}
