import { LitElement, html, css } from 'lit';

/**
 * MD3 Timeline component.
 *
 * Displays a vertical sequence of events with a continuous connecting line.
 */
export class MdTimeline extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding-left: 8px;
    }
  `;

  override render() {
    return html`<slot @slotchange=${this._onSlotChange}></slot>`;
  }

  private _onSlotChange() {
    const slot = this.shadowRoot?.querySelector('slot');
    const items = slot
      ?.assignedElements()
      .filter((el) => el.tagName === 'MD-TIMELINE-ITEM');
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      (items[i] as MdTimelineItem).isLast = i === items.length - 1;
    }
  }
}

/**
 * MD3 Timeline Item. A single event in the timeline.
 */
export class MdTimelineItem extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
    isLast: { type: Boolean, attribute: false },
  };

  declare variant: 'default' | 'outlined' | 'filled';
  declare isLast: boolean;

  constructor() {
    super();
    this.variant = 'default';
    this.isLast = false;
  }

  static override styles = css`
    :host {
      display: grid;
      grid-template-columns: 20px 1fr;
      grid-template-rows: auto 1fr;
      gap: 0 16px;
      min-height: 48px;
    }

    /* ── indicator column ── */
    .dot-wrapper {
      grid-column: 1;
      grid-row: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 24px;
      position: relative;
      z-index: 1;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--md-sys-color-primary, #6750a4);
      flex-shrink: 0;
    }

    :host([variant='outlined']) .dot {
      background: transparent;
      border: 2.5px solid var(--md-sys-color-primary, #6750a4);
      width: 12px;
      height: 12px;
      box-sizing: border-box;
    }

    :host([variant='filled']) .dot {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--md-sys-color-primary, #6750a4);
    }

    ::slotted([slot='icon']) {
      width: 14px;
      height: 14px;
      color: var(--md-sys-color-on-primary, #fff);
      --md-icon-size: 14px;
      font-size: 14px;
    }

    .line-segment {
      grid-column: 1;
      grid-row: 2;
      display: flex;
      justify-content: center;
    }

    .line {
      width: 2px;
      background: var(--md-sys-color-outline-variant, #cac4d0);
      min-height: 100%;
    }

    .line.hidden {
      visibility: hidden;
    }

    /* ── content column ── */
    .header {
      grid-column: 2;
      grid-row: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 24px;
    }

    .body {
      grid-column: 2;
      grid-row: 2;
      padding-top: 4px;
      padding-bottom: 20px;
    }

    /* Slot styling */
    ::slotted([slot='time']) {
      font-family: var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto, sans-serif));
      font-size: var(--md-sys-typescale-label-small-size, 0.6875rem);
      font-weight: var(--md-sys-typescale-label-small-weight, 500);
      letter-spacing: var(--md-sys-typescale-label-small-tracking, 0.03125rem);
      line-height: var(--md-sys-typescale-label-small-line-height, 1rem);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      display: block;
    }

    ::slotted([slot='heading']) {
      font-family: var(--md-sys-typescale-title-small-font, var(--md-ref-typeface-plain, Roboto, sans-serif));
      font-size: var(--md-sys-typescale-title-small-size, 0.875rem);
      font-weight: var(--md-sys-typescale-title-small-weight, 500);
      letter-spacing: var(--md-sys-typescale-title-small-tracking, 0.00625rem);
      line-height: var(--md-sys-typescale-title-small-line-height, 1.25rem);
      color: var(--md-sys-color-on-surface, #1d1b20);
      display: block;
      margin: 0;
    }

    ::slotted(:not([slot])) {
      font-family: var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto, sans-serif));
      font-size: var(--md-sys-typescale-body-small-size, 0.75rem);
      line-height: var(--md-sys-typescale-body-small-line-height, 1rem);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      display: block;
    }
  `;

  override render() {
    return html`
      <div class="dot-wrapper">
        <div class="dot">
          <slot name="icon"></slot>
        </div>
      </div>
      <div class="header">
        <slot name="time"></slot>
        <slot name="heading"></slot>
      </div>
      <div class="line-segment">
        <div class="line ${this.isLast ? 'hidden' : ''}"></div>
      </div>
      <div class="body">
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
