import { LitElement, html, css } from 'lit';

/**
 * MD3 Virtual List / Infinite Scroll.
 *
 * Renders only the visible items in a large list by tracking scroll position
 * and emitting a `range-change` event with `{ start, end }` so the consumer
 * can provide the correct children for the visible window.
 *
 * @fires range-change - Fired when the visible index range changes.
 *   `event.detail` is `{ start: number; end: number }`.
 */
export class MdVirtualList extends LitElement {
  static override properties = {
    itemCount: { type: Number, attribute: 'item-count' },
    itemHeight: { type: Number, attribute: 'item-height' },
    overscan: { type: Number },
    _start: { type: Number, state: true },
    _end: { type: Number, state: true },
  };

  declare itemCount: number;
  declare itemHeight: number;
  declare overscan: number;
  declare _start: number;
  declare _end: number;

  constructor() {
    super();
    this.itemCount = 0;
    this.itemHeight = 48;
    this.overscan = 5;
    this._start = 0;
    this._end = 0;
  }

  static override styles = css`
    :host {
      display: block;
      position: relative;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      background: var(--md-sys-color-surface, #fef7ff);
      color: var(--md-sys-color-on-surface, #1d1b20);
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      /* A sensible default height; consumers will typically override via style */
      height: 400px;
    }

    .spacer {
      width: 100%;
      pointer-events: none;
    }

    .viewport {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      will-change: transform;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    // Initial range will be calculated after first render when we know the height
  }

  override firstUpdated() {
    this._recalculate();
  }

  override updated(changed: Map<string | number | symbol, unknown>) {
    if (changed.has('itemCount') || changed.has('itemHeight') || changed.has('overscan')) {
      this._recalculate();
    }
  }

  private _handleScroll() {
    this._recalculate();
  }

  private _recalculate() {
    const scrollTop = this.scrollTop;
    const viewportHeight = this.clientHeight;

    if (!viewportHeight || !this.itemHeight) return;

    const totalItems = this.itemCount;
    const rawStart = Math.floor(scrollTop / this.itemHeight);
    const rawEnd = Math.ceil((scrollTop + viewportHeight) / this.itemHeight);

    const start = Math.max(0, rawStart - this.overscan);
    const end = Math.min(totalItems, rawEnd + this.overscan);

    if (start !== this._start || end !== this._end) {
      this._start = start;
      this._end = end;

      this.dispatchEvent(
        new CustomEvent('range-change', {
          detail: { start, end },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  override render() {
    const totalHeight = this.itemCount * this.itemHeight;
    const offsetY = this._start * this.itemHeight;

    return html`
      <div class="spacer" style="height:${totalHeight}px"></div>
      <div class="viewport" style="transform:translateY(${offsetY}px)">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('md-virtual-list', MdVirtualList);

// Listen for scroll on the host element itself (since it has overflow-y: auto)
MdVirtualList.addInitializer((instance) => {
  const el = instance as MdVirtualList;
  el.addEventListener('scroll', () => {
    (el as any)._handleScroll();
  });
});

declare global {
  interface HTMLElementTagNameMap {
    'md-virtual-list': MdVirtualList;
  }
}
