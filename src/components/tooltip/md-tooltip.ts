import { LitElement, html, css } from 'lit';
import '@material/web/elevation/elevation.js';

export class MdTooltip extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
    position: { type: String, reflect: true },
    open: { type: Boolean, reflect: true },
  };

  declare variant: 'plain' | 'rich';
  declare position: 'top' | 'bottom' | 'left' | 'right';
  declare open: boolean;

  private _hovered = false;
  private _closeTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    super();
    this.variant = 'plain';
    this.position = 'bottom';
    this.open = false;
  }

  /** Keep the rich tooltip open while the user hovers it. */
  private _onMouseEnter() {
    this._hovered = true;
    clearTimeout(this._closeTimer);
  }

  private _onMouseLeave() {
    this._hovered = false;
    this._closeTimer = setTimeout(() => {
      if (!this._hovered) this.open = false;
    }, 100);
  }

  /**
   * Schedule a close — gives the user ~100 ms to bridge the gap between the
   * anchor and the tooltip.  If the mouse enters the tooltip host in time the
   * close is cancelled.
   */
  scheduleClose() {
    if (this.variant !== 'rich') {
      this.open = false;
      return;
    }
    this._closeTimer = setTimeout(() => {
      if (!this._hovered) this.open = false;
    }, 100);
  }

  static override styles = css`
    :host {
      position: absolute;
      z-index: 999;
      pointer-events: none;
      display: none;
    }

    :host([open]) {
      display: block;
    }

    :host([variant='rich']) {
      pointer-events: auto;
    }

    /* Invisible padding so the user can bridge the gap between anchor and tooltip */
    :host([variant='rich'][position='top']) { padding-bottom: 8px; }
    :host([variant='rich'][position='bottom']) { padding-top: 8px; }
    :host([variant='rich'][position='left']) { padding-right: 8px; }
    :host([variant='rich'][position='right']) { padding-left: 8px; }

    /* ── Plain tooltip ── */
    .plain {
      background: var(--md-sys-color-surface-container-highest, #E6E0E9);
      color: var(--md-sys-color-on-surface, #1C1B1F);
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
      padding: 4px 8px;
      font-family: var(--md-ref-typeface-plain, 'Roboto', sans-serif);
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0.4px;
      max-width: 200px;
      animation: tooltip-fade-in 150ms ease-out;
    }

    /* ── Rich tooltip ── */
    .rich {
      position: relative;
      background: var(--md-sys-color-surface-container, #F3EDF7);
      color: var(--md-sys-color-on-surface-variant, #49454F);
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      padding: 12px 16px;
      max-width: 320px;
      min-width: 112px;
      animation: tooltip-fade-in 150ms ease-out;
      font-family: var(--md-ref-typeface-plain, 'Roboto', sans-serif);
    }

    .rich md-elevation {
      --md-elevation-level: 2;
      --md-elevation-shadow-color: var(--md-sys-color-shadow, #000);
    }

    .subhead {
      color: var(--md-sys-color-on-surface-variant, #49454F);
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: 0.1px;
      margin-bottom: 4px;
    }

    .supporting-text {
      color: var(--md-sys-color-on-surface-variant, #49454F);
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: 0.25px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }

    ::slotted([slot='action']) {
      --md-text-button-label-text-color: var(--md-sys-color-primary, #6750A4);
    }

    @keyframes tooltip-fade-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* ── Positioning ── */
    :host([position='top']) {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
    }

    :host([position='bottom']) {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
    }

    :host([position='left']) {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
    }

    :host([position='right']) {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
    }

    /* Plain tooltips still use margin for spacing */
    :host([variant='plain'][position='top']) { margin-bottom: 8px; }
    :host([variant='plain'][position='bottom']) { margin-top: 8px; }
    :host([variant='plain'][position='left']) { margin-right: 8px; }
    :host([variant='plain'][position='right']) { margin-left: 8px; }
  `;

  override render() {
    if (this.variant === 'rich') {
      return html`
        <div
          class="rich"
          role="tooltip"
          @mouseenter=${this._onMouseEnter}
          @mouseleave=${this._onMouseLeave}
        >
          <md-elevation></md-elevation>
          <div class="subhead"><slot name="headline"></slot></div>
          <div class="supporting-text"><slot></slot></div>
          <div class="actions"><slot name="action"></slot></div>
        </div>
      `;
    }

    return html`
      <div class="plain" role="tooltip">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('md-tooltip', MdTooltip);

declare global {
  interface HTMLElementTagNameMap {
    'md-tooltip': MdTooltip;
  }
}
