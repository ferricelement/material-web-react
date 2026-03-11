import { LitElement, html, css } from 'lit';

/**
 * MD3 Timeline component.
 *
 * Displays a vertical sequence of events.
 */
export class MdTimeline extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}

/**
 * MD3 Timeline Item. A single event in the timeline.
 */
export class MdTimelineItem extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
  };

  declare variant: 'default' | 'outlined' | 'filled';

  constructor() {
    super();
    this.variant = 'default';
  }

  static override styles = css`
    :host {
      display: flex;
      gap: 16px;
      position: relative;
      padding-bottom: 24px;
    }

    :host(:last-child) {
      padding-bottom: 0;
    }

    :host(:last-child) .line {
      display: none;
    }

    .indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 40px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--md-sys-color-primary, #6750a4);
      flex-shrink: 0;
      z-index: 1;
    }

    :host([variant="outlined"]) .dot {
      background: transparent;
      border: 2px solid var(--md-sys-color-primary, #6750a4);
      width: 8px;
      height: 8px;
    }

    :host([variant="filled"]) .dot {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .line {
      width: 2px;
      flex: 1;
      background: var(--md-sys-color-outline-variant, #cac4d0);
      margin-top: 4px;
    }

    .content {
      flex: 1;
      min-width: 0;
      padding-top: 0;
    }

    ::slotted([slot="icon"]) {
      width: 16px;
      height: 16px;
      color: var(--md-sys-color-on-primary, #fff);
      --md-icon-size: 16px;
      font-size: 16px;
    }

    ::slotted([slot="heading"]) {
      font-size: 14px;
      font-weight: 500;
      color: var(--md-sys-color-on-surface, #1d1b20);
      margin: 0 0 4px;
      display: block;
    }

    ::slotted([slot="time"]) {
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      display: block;
      margin-bottom: 4px;
    }

    ::slotted(:not([slot])) {
      font-size: 14px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      line-height: 1.5;
    }
  `;

  override render() {
    return html`
      <div class="indicator">
        <div class="dot">
          <slot name="icon"></slot>
        </div>
        <div class="line"></div>
      </div>
      <div class="content">
        <slot name="time"></slot>
        <slot name="heading"></slot>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('md-timeline', MdTimeline);
customElements.define('md-timeline-item', MdTimelineItem);

declare global {
  interface HTMLElementTagNameMap {
    'md-timeline': MdTimeline;
    'md-timeline-item': MdTimelineItem;
  }
}
