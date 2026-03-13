import { LitElement, html, css } from 'lit';
import '@material/web/elevation/elevation.js';

/**
 * MD3 Carousel component.
 *
 * A horizontally scrollable container with snap behavior and item masking.
 *
 * Variants:
 * - `multi-browse`: Multiple items flex to fill space (default)
 * - `uncontained`: Fixed-width items scroll past the edge
 * - `hero`: One large item with small peek items
 */
export class MdCarousel extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
    itemWidth: { type: Number, attribute: 'item-width' },
    gap: { type: Number },
    padding: { type: Number },
    loop: { type: Boolean },
    _activeIndex: { state: true },
    _showPrev: { state: true },
    _showNext: { state: true },
  };

  declare variant: 'multi-browse' | 'uncontained' | 'hero';
  declare itemWidth: number;
  declare gap: number;
  declare padding: number;
  declare loop: boolean;
  declare _activeIndex: number;
  declare _showPrev: boolean;
  declare _showNext: boolean;

  private _observer: IntersectionObserver | null = null;
  private _scrollTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    super();
    this.variant = 'multi-browse';
    this.itemWidth = 200;
    this.gap = 8;
    this.padding = 16;
    this.loop = false;
    this._activeIndex = 0;
    this._showPrev = false;
    this._showNext = true;
  }

  static override styles = css`
    :host {
      display: block;
      position: relative;
    }

    .track {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-behavior: smooth;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .track::-webkit-scrollbar {
      display: none;
    }

    /* Slotted items base styling */
    ::slotted(*) {
      flex-shrink: 0;
      scroll-snap-align: start;
      border-radius: var(--md-sys-shape-corner-extra-large, 28px);
      overflow: hidden;
    }

    /* Navigation arrows */
    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: none;
      background: var(--md-sys-color-surface-container-high, #ece6f0);
      color: var(--md-sys-color-on-surface, #1d1b20);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 200ms ease;
      --md-elevation-level: 1;
      --md-elevation-shadow-color: var(--md-sys-color-shadow, #000);
    }

    :host(:hover) .nav-btn.visible {
      opacity: 1;
    }

    .nav-btn:hover {
      background: var(--md-sys-color-surface-container-highest, #e6e0e9);
    }

    .nav-btn.prev {
      left: 8px;
    }

    .nav-btn.next {
      right: 8px;
    }

    .nav-btn svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
  `;

  override render() {
    const trackStyle = this._getTrackStyle();
    const itemStyle = this._getItemStyle();

    return html`
      <button class="nav-btn prev ${this._showPrev ? 'visible' : ''}"
        @click=${this._scrollPrev}
        aria-label="Previous">
        <md-elevation></md-elevation>
        <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <div class="track" style=${trackStyle} @scroll=${this._handleScroll}>
        <style>
          ::slotted(*) { ${itemStyle} }
        </style>
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
      <button class="nav-btn next ${this._showNext ? 'visible' : ''}"
        @click=${this._scrollNext}
        aria-label="Next">
        <md-elevation></md-elevation>
        <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
      </button>
    `;
  }

  private _getTrackStyle(): string {
    return `gap: ${this.gap}px; padding: 0 ${this.padding}px;`;
  }

  private _getItemStyle(): string {
    switch (this.variant) {
      case 'hero':
        return '';
      case 'uncontained':
        return `width: ${this.itemWidth}px; min-width: ${this.itemWidth}px;`;
      case 'multi-browse':
      default:
        return `flex: 0 0 ${this.itemWidth}px; min-width: ${this.itemWidth}px;`;
    }
  }

  override firstUpdated() {
    this._setupItems();
    this._updateNavButtons();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('variant') || changed.has('itemWidth') || changed.has('gap') || changed.has('padding')) {
      this._setupItems();
    }
  }

  private _handleSlotChange() {
    this._setupItems();
    this._updateNavButtons();
  }

  private _setupItems() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return;
    const items = slot.assignedElements() as HTMLElement[];

    // Apply hero variant sizing
    if (this.variant === 'hero') {
      items.forEach((item, i) => {
        if (i === 0 || (this._activeIndex >= 0 && i === this._activeIndex)) {
          // For hero, we'll use CSS to handle the first visible item being larger
        }
        // Hero: first item large, rest small
        const track = this.shadowRoot?.querySelector('.track') as HTMLElement;
        if (track) {
          const trackWidth = track.clientWidth - this.padding * 2;
          const heroWidth = trackWidth * 0.7;
          const peekWidth = trackWidth * 0.25;
          if (i === 0) {
            item.style.width = `${heroWidth}px`;
            item.style.minWidth = `${heroWidth}px`;
            item.style.flex = 'none';
          } else {
            item.style.width = `${peekWidth}px`;
            item.style.minWidth = `${peekWidth}px`;
            item.style.flex = 'none';
          }
        }
      });
    }

    // Setup intersection observer
    this._setupObserver(items);
  }

  private _setupObserver(items: HTMLElement[]) {
    if (this._observer) {
      this._observer.disconnect();
    }

    const track = this.shadowRoot?.querySelector('.track');
    if (!track) return;

    this._observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const items = (this.shadowRoot?.querySelector('slot') as HTMLSlotElement)?.assignedElements() || [];
            const index = items.indexOf(entry.target as HTMLElement);
            if (index >= 0 && index !== this._activeIndex) {
              this._activeIndex = index;
              this.dispatchEvent(new CustomEvent('carousel-scroll', {
                detail: { index: this._activeIndex },
                bubbles: true,
                composed: true,
              }));
            }
          }
        }
      },
      { root: track, threshold: 0.5 }
    );

    items.forEach((item) => this._observer!.observe(item));
  }

  private _handleScroll() {
    if (this._scrollTimeout) clearTimeout(this._scrollTimeout);
    this._scrollTimeout = setTimeout(() => {
      this._updateNavButtons();
    }, 100);
  }

  private _updateNavButtons() {
    const track = this.shadowRoot?.querySelector('.track') as HTMLElement;
    if (!track) return;

    this._showPrev = track.scrollLeft > 10;
    this._showNext = track.scrollLeft < track.scrollWidth - track.clientWidth - 10;
  }

  private _scrollPrev() {
    const track = this.shadowRoot?.querySelector('.track') as HTMLElement;
    if (!track) return;
    track.scrollBy({ left: -(this.itemWidth + this.gap), behavior: 'smooth' });
  }

  private _scrollNext() {
    const track = this.shadowRoot?.querySelector('.track') as HTMLElement;
    if (!track) return;
    track.scrollBy({ left: this.itemWidth + this.gap, behavior: 'smooth' });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    if (this._scrollTimeout) {
      clearTimeout(this._scrollTimeout);
    }
  }
}

customElements.define('md-carousel', MdCarousel);

declare global {
  interface HTMLElementTagNameMap {
    'md-carousel': MdCarousel;
  }
}
