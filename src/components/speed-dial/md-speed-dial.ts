import { LitElement, html, svg, css, nothing } from 'lit';
import '@material/web/elevation/elevation.js';

/**
 * MD3 Speed Dial Action — individual action button rendered as a small FAB.
 */
export class MdSpeedDialAction extends LitElement {
  static override properties = {
    label: { type: String },
    disabled: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare disabled: boolean;

  constructor() {
    super();
    this.label = '';
    this.disabled = false;
  }

  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 8px;
      pointer-events: auto;
    }

    :host([disabled]) {
      pointer-events: none;
      opacity: 0.38;
    }

    .label {
      position: relative;
      background: var(--md-sys-color-surface-container-high, #ece6f0);
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-family: var(--md-sys-typescale-label-medium-font, var(--md-ref-typeface-plain, Roboto, sans-serif));
      font-size: var(--md-sys-typescale-label-medium-size, 0.75rem);
      line-height: var(--md-sys-typescale-label-medium-line-height, 1rem);
      letter-spacing: var(--md-sys-typescale-label-medium-tracking, 0.03125rem);
      font-weight: var(--md-sys-typescale-label-medium-weight, 500);
      padding: 4px 12px;
      border-radius: 100px;
      white-space: nowrap;
      --md-elevation-level: 1;
      --md-elevation-shadow-color: var(--md-sys-color-shadow, #000);
    }

    .action-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: none;
      background: var(--md-sys-color-surface-container-high, #ece6f0);
      color: var(--md-sys-color-on-surface, #1d1b20);
      cursor: pointer;
      padding: 0;
      position: relative;
      --md-elevation-level: 1;
      --md-elevation-shadow-color: var(--md-sys-color-shadow, #000);
      transition: background-color 0.2s;
    }

    .action-button:hover {
      --md-elevation-level: 2;
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, var(--md-sys-color-surface-container-high, #ece6f0));
    }

    .action-button:active {
      --md-elevation-level: 1;
    }

    .action-button:focus-visible {
      outline: 2px solid var(--md-sys-color-primary, #6750a4);
      outline-offset: 2px;
    }

    ::slotted(*) {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `;

  override render() {
    return html`
      ${this.label ? html`<span class="label"><md-elevation></md-elevation>${this.label}</span>` : nothing}
      <button
        class="action-button"
        ?disabled=${this.disabled}
        @click=${this._handleClick}
        aria-label=${this.label || nothing}
      >
        <md-elevation></md-elevation>
        <slot></slot>
      </button>
    `;
  }

  private _handleClick(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('action-click', { bubbles: true, composed: true }),
    );
  }
}

/**
 * MD3 Speed Dial — expanding FAB that reveals action buttons when clicked.
 */
export class MdSpeedDial extends LitElement {
  static override properties = {
    open: { type: Boolean, reflect: true },
    direction: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  declare open: boolean;
  declare direction: 'up' | 'down' | 'left' | 'right';
  declare disabled: boolean;

  constructor() {
    super();
    this.open = false;
    this.direction = 'up';
    this.disabled = false;
  }

  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    :host([disabled]) {
      pointer-events: none;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    /* Direction layouts */
    :host([direction='up']) .container {
      flex-direction: column-reverse;
    }

    :host([direction='down']) .container {
      flex-direction: column;
    }

    :host([direction='left']) .container {
      flex-direction: row-reverse;
    }

    :host([direction='right']) .container {
      flex-direction: row;
    }

    /* Align actions to end (right side) for vertical, bottom for horizontal */
    :host([direction='up']) .actions,
    :host([direction='down']) .actions {
      flex-direction: column;
      align-items: flex-end;
    }

    :host([direction='left']) .actions,
    :host([direction='right']) .actions {
      flex-direction: row;
      align-items: center;
    }

    .trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: 16px;
      border: none;
      background: var(--md-sys-color-primary-container, #eaddff);
      color: var(--md-sys-color-on-primary-container, #21005d);
      cursor: pointer;
      padding: 0;
      position: relative;
      z-index: 1;
      --md-elevation-level: 3;
      --md-elevation-shadow-color: var(--md-sys-color-shadow, #000);
      transition: background-color 0.2s;
    }

    :host([disabled]) .trigger {
      opacity: 0.38;
      cursor: default;
    }

    .trigger:hover:not(:disabled) {
      --md-elevation-level: 4;
      background: color-mix(in srgb, var(--md-sys-color-on-primary-container, #21005d) 8%, var(--md-sys-color-primary-container, #eaddff));
    }

    .trigger:active:not(:disabled) {
      --md-elevation-level: 3;
    }

    .trigger:focus-visible {
      outline: 2px solid var(--md-sys-color-primary, #6750a4);
      outline-offset: 2px;
    }

    .trigger-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
    }

    :host([open]) .trigger-icon {
      transform: rotate(45deg);
    }

    .trigger-icon svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    .actions {
      display: flex;
      gap: 8px;
      pointer-events: none;
    }

    :host([direction='up']) .actions {
      padding-bottom: 12px;
    }

    :host([direction='down']) .actions {
      padding-top: 12px;
    }

    :host([direction='left']) .actions {
      padding-right: 12px;
    }

    :host([direction='right']) .actions {
      padding-left: 12px;
    }

    /* Staggered animation for action items */
    ::slotted(md-speed-dial-action) {
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1),
                  transform 0.3s cubic-bezier(0.2, 0, 0, 1);
    }

    :host([direction='up']) ::slotted(md-speed-dial-action) {
      transform: translateY(16px) scale(0.8);
    }

    :host([direction='down']) ::slotted(md-speed-dial-action) {
      transform: translateY(-16px) scale(0.8);
    }

    :host([direction='left']) ::slotted(md-speed-dial-action) {
      transform: translateX(16px) scale(0.8);
    }

    :host([direction='right']) ::slotted(md-speed-dial-action) {
      transform: translateX(-16px) scale(0.8);
    }

    :host([open]) ::slotted(md-speed-dial-action) {
      opacity: 1;
      transform: translateY(0) translateX(0) scale(1);
      pointer-events: auto;
    }

    /* Staggered delays */
    :host([open]) ::slotted(md-speed-dial-action:nth-child(1)) {
      transition-delay: 0ms;
    }

    :host([open]) ::slotted(md-speed-dial-action:nth-child(2)) {
      transition-delay: 30ms;
    }

    :host([open]) ::slotted(md-speed-dial-action:nth-child(3)) {
      transition-delay: 60ms;
    }

    :host([open]) ::slotted(md-speed-dial-action:nth-child(4)) {
      transition-delay: 90ms;
    }

    :host([open]) ::slotted(md-speed-dial-action:nth-child(5)) {
      transition-delay: 120ms;
    }

    :host([open]) ::slotted(md-speed-dial-action:nth-child(6)) {
      transition-delay: 150ms;
    }

    /* Scrim/overlay */
    .scrim {
      position: fixed;
      inset: 0;
      z-index: -1;
    }
  `;

  override render() {
    return html`
      ${this.open ? html`<div class="scrim" @click=${this._toggle}></div>` : nothing}
      <div class="container">
        <button
          class="trigger"
          ?disabled=${this.disabled}
          @click=${this._toggle}
          aria-expanded=${this.open}
          aria-label=${this.open ? 'Close actions' : 'Open actions'}
        >
          <md-elevation></md-elevation>
          <span class="trigger-icon">
            <slot name="icon">
              <svg viewBox="0 0 24 24">
                ${svg`<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>`}
              </svg>
            </slot>
          </span>
        </button>
        <div class="actions">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private _toggle() {
    if (this.disabled) return;
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent(this.open ? 'open' : 'close', {
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define('md-speed-dial', MdSpeedDial);
customElements.define('md-speed-dial-action', MdSpeedDialAction);

declare global {
  interface HTMLElementTagNameMap {
    'md-speed-dial': MdSpeedDial;
    'md-speed-dial-action': MdSpeedDialAction;
  }
}
