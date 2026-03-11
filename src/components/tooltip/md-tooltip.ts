import { LitElement, html, css } from 'lit';

export class MdTooltip extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
    position: { type: String, reflect: true },
    open: { type: Boolean, reflect: true },
  };

  declare variant: 'plain' | 'rich';
  declare position: 'top' | 'bottom' | 'left' | 'right';
  declare open: boolean;

  constructor() {
    super();
    this.variant = 'plain';
    this.position = 'bottom';
    this.open = false;
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

    .container {
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
      padding: 8px 12px;
      font-family: var(--md-ref-typeface-plain, 'Roboto', sans-serif);
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.4px;
      max-width: 200px;
      animation: tooltip-fade-in 150ms ease-out;
    }

    :host([variant='plain']) .container {
      background: var(--md-sys-color-inverse-surface, #313033);
      color: var(--md-sys-color-inverse-on-surface, #f4eff4);
    }

    :host([variant='rich']) .container {
      background: var(--md-sys-color-surface-container, #f3edf7);
      color: var(--md-sys-color-on-surface, #1d1b20);
      border: 1px solid var(--md-sys-color-outline, #79747e);
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      padding: 12px 16px;
      max-width: 320px;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.25px;
    }

    .title {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
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

    /* Positioning */
    :host([position='top']) {
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-bottom: 4px;
    }

    :host([position='bottom']) {
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 4px;
    }

    :host([position='left']) {
      right: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-right: 4px;
    }

    :host([position='right']) {
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      margin-left: 4px;
    }
  `;

  override render() {
    if (this.variant === 'rich') {
      return html`
        <div class="container" role="tooltip">
          <div class="title"><slot name="headline"></slot></div>
          <slot></slot>
          <div class="actions"><slot name="action"></slot></div>
        </div>
      `;
    }

    return html`
      <div class="container" role="tooltip">
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
