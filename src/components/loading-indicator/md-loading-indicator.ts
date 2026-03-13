import { LitElement, html, css, nothing } from 'lit';

/**
 * MD3 Loading Indicator
 *
 * A compact loading animation that morphs between shapes in sequence.
 * Designed as a replacement for indeterminate circular progress indicators
 * for short wait times (under 5 seconds). Can be used inline within buttons,
 * cards, or other components.
 *
 * @attr {string} size - Indicator size: 'small' (20px), 'medium' (36px), 'large' (48px)
 * @attr {boolean} contained - Whether to show a container behind the indicator
 * @attr {number} value - Determinate progress value (0-1). Omit for indeterminate.
 * @attr {boolean} hide - When true, plays hide animation then removes indicator
 * @attr {number} show-delay - Delay in ms before indicator appears (avoids flashes for fast loads)
 */
export class MdLoadingIndicator extends LitElement {
  static override properties = {
    size: { type: String, reflect: true },
    contained: { type: Boolean, reflect: true },
    value: { type: Number },
    hide: { type: Boolean, reflect: true },
    showDelay: { type: Number, attribute: 'show-delay' },
  };

  declare size: 'small' | 'medium' | 'large';
  declare contained: boolean;
  declare value: number | undefined;
  declare hide: boolean;
  declare showDelay: number;

  private _visible = false;
  private _showTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    super();
    this.size = 'medium';
    this.contained = false;
    this.value = undefined;
    this.hide = false;
    this.showDelay = 0;
  }

  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      --_indicator-color: var(
        --md-loading-indicator-color,
        var(--md-sys-color-primary, #6750a4)
      );
      --_container-color: var(
        --md-loading-indicator-container-color,
        transparent
      );
      --_indicator-size: 36px;
      --_container-size: 48px;
      --_shape-size: 10px;
    }

    :host([size='small']) {
      --_indicator-size: 20px;
      --_container-size: 28px;
      --_shape-size: 6px;
    }

    :host([size='large']) {
      --_indicator-size: 48px;
      --_container-size: 60px;
      --_shape-size: 14px;
    }

    :host([hide]) .indicator-track {
      animation: indicator-fade-out 200ms var(--md-sys-motion-easing-emphasized, cubic-bezier(0.2, 0, 0, 1)) forwards;
    }

    @keyframes indicator-fade-out {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.6); }
    }

    .container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--_container-size);
      height: var(--_container-size);
      border-radius: 50%;
      background: var(--_container-color);
    }

    :host(:not([contained])) .container {
      width: var(--_indicator-size);
      height: var(--_indicator-size);
    }

    :host([contained]) .container {
      background: var(
        --md-loading-indicator-container-color,
        var(--md-sys-color-surface-container-highest, #e6e0e9)
      );
    }

    .indicator-track {
      position: relative;
      width: var(--_indicator-size);
      height: var(--_indicator-size);
    }

    /* ---- Indeterminate morphing animation ---- */
    .morph-shape {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .morph-shape::before {
      content: '';
      display: block;
      width: var(--_shape-size);
      height: var(--_shape-size);
      background: var(--_indicator-color);
      animation: morph-sequence 2000ms var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)) infinite;
    }

    /*
     * Shape morph sequence:
     * circle -> rounded-square -> pill-h -> diamond -> circle -> pill-v -> rounded-square -> circle
     * The shape orbits in a circular path while morphing.
     */
    @keyframes morph-sequence {
      0% {
        border-radius: 50%;
        transform: rotate(0deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(0deg) scale(1);
      }
      12.5% {
        border-radius: 25%;
        transform: rotate(45deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-45deg) scale(1.15);
      }
      25% {
        border-radius: 50% / 35%;
        transform: rotate(90deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-90deg) scaleX(1.4) scaleY(0.75);
      }
      37.5% {
        border-radius: 15%;
        transform: rotate(135deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-135deg) scale(1.1) rotate(45deg);
      }
      50% {
        border-radius: 50%;
        transform: rotate(180deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-180deg) scale(0.85);
      }
      62.5% {
        border-radius: 35% / 50%;
        transform: rotate(225deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-225deg) scaleX(0.75) scaleY(1.4);
      }
      75% {
        border-radius: 25%;
        transform: rotate(270deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-270deg) scale(1.2);
      }
      87.5% {
        border-radius: 40%;
        transform: rotate(315deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-315deg) scale(1.05);
      }
      100% {
        border-radius: 50%;
        transform: rotate(360deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-360deg) scale(1);
      }
    }

    /* Secondary trailing shape for richer animation */
    .morph-shape-secondary::before {
      content: '';
      display: block;
      width: calc(var(--_shape-size) * 0.6);
      height: calc(var(--_shape-size) * 0.6);
      background: var(--_indicator-color);
      opacity: 0.5;
      animation: morph-sequence-secondary 2000ms var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1)) infinite;
    }

    @keyframes morph-sequence-secondary {
      0% {
        border-radius: 25%;
        transform: rotate(0deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(0deg) scale(0.8);
        opacity: 0.4;
      }
      25% {
        border-radius: 50%;
        transform: rotate(90deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-90deg) scale(1);
        opacity: 0.6;
      }
      50% {
        border-radius: 15%;
        transform: rotate(180deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-180deg) scale(0.9) rotate(45deg);
        opacity: 0.35;
      }
      75% {
        border-radius: 50%;
        transform: rotate(270deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-270deg) scale(1.1);
        opacity: 0.55;
      }
      100% {
        border-radius: 25%;
        transform: rotate(360deg) translateX(calc(var(--_indicator-size) * 0.28)) rotate(-360deg) scale(0.8);
        opacity: 0.4;
      }
    }

    /* ---- Determinate mode ---- */
    .determinate-ring {
      position: absolute;
      inset: 0;
    }

    .determinate-ring svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .determinate-ring circle {
      fill: none;
      stroke: var(--_indicator-color);
      stroke-width: 3.5;
      stroke-linecap: round;
      transition: stroke-dashoffset 300ms var(--md-sys-motion-easing-standard, cubic-bezier(0.2, 0, 0, 1));
    }

    .determinate-track {
      fill: none;
      stroke: color-mix(in srgb, var(--_indicator-color) 20%, transparent);
      stroke-width: 3.5;
    }

    /* Entrance animation */
    @keyframes indicator-fade-in {
      from { opacity: 0; transform: scale(0.5); }
      to { opacity: 1; transform: scale(1); }
    }

    .indicator-track {
      animation: indicator-fade-in 300ms var(--md-sys-motion-easing-emphasized-decelerate, cubic-bezier(0.05, 0.7, 0.1, 1)) both;
    }

    /* Screen reader */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    if (this.showDelay > 0) {
      this._visible = false;
      this._showTimer = setTimeout(() => {
        this._visible = true;
        this.requestUpdate();
      }, this.showDelay);
    } else {
      this._visible = true;
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._showTimer) {
      clearTimeout(this._showTimer);
      this._showTimer = null;
    }
  }

  private get _isDeterminate(): boolean {
    return this.value !== undefined && this.value !== null;
  }

  private get _clampedValue(): number {
    return Math.max(0, Math.min(1, this.value ?? 0));
  }

  private _renderDeterminate() {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - this._clampedValue);
    const percent = Math.round(this._clampedValue * 100);

    return html`
      <div class="determinate-ring">
        <svg viewBox="0 0 40 40">
          <circle class="determinate-track" cx="20" cy="20" r="${radius}" />
          <circle
            cx="20"
            cy="20"
            r="${radius}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
          />
        </svg>
      </div>
      <span class="sr-only">${percent}% loaded</span>
    `;
  }

  private _renderIndeterminate() {
    return html`
      <div class="morph-shape"></div>
      <div class="morph-shape morph-shape-secondary"></div>
      <span class="sr-only">Loading</span>
    `;
  }

  override render() {
    if (!this._visible) return nothing;

    return html`
      <div
        class="container"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="1"
        aria-valuenow=${this._isDeterminate ? this._clampedValue : nothing}
        aria-label="Loading"
      >
        <div class="indicator-track">
          ${this._isDeterminate
            ? this._renderDeterminate()
            : this._renderIndeterminate()}
        </div>
      </div>
    `;
  }
}

customElements.define('md-loading-indicator', MdLoadingIndicator);

declare global {
  interface HTMLElementTagNameMap {
    'md-loading-indicator': MdLoadingIndicator;
  }
}
