import { LitElement, html, svg, css } from 'lit';

/**
 * MD3 Rating component.
 *
 * Star rating input with hover preview and click-to-select.
 */
export class MdRating extends LitElement {
  static override properties = {
    value: { type: Number, reflect: true },
    max: { type: Number },
    readonly: { type: Boolean, reflect: true },
    size: { type: String },
    _hoverValue: { state: true },
  };

  declare value: number;
  declare max: number;
  declare readonly: boolean;
  declare size: string;
  declare _hoverValue: number;

  constructor() {
    super();
    this.value = 0;
    this.max = 5;
    this.readonly = false;
    this.size = 'medium';
    this._hoverValue = 0;
  }

  static override styles = css`
    :host {
      display: inline-flex;
      gap: 4px;
      align-items: center;
    }

    .star {
      cursor: pointer;
      transition: transform 150ms ease;
      position: relative;
    }

    .star:hover {
      transform: scale(1.15);
    }

    :host([readonly]) .star {
      cursor: default;
    }

    :host([readonly]) .star:hover {
      transform: none;
    }

    .star svg {
      display: block;
    }

    .star-filled {
      fill: var(--md-sys-color-primary, #6750a4);
    }

    .star-empty {
      fill: var(--md-sys-color-outline-variant, #cac4d0);
    }

    .star-half {
      fill: var(--md-sys-color-primary, #6750a4);
    }
  `;

  private get _sizePixels(): number {
    const sizes: Record<string, number> = { small: 20, medium: 24, large: 36 };
    return sizes[this.size] || parseInt(this.size) || 24;
  }

  override render() {
    const display = this._hoverValue || this.value;
    const s = this._sizePixels;
    return html`
      ${Array.from({ length: this.max }, (_, i) => {
        const starNum = i + 1;
        const filled = display >= starNum;
        const half = !filled && display >= starNum - 0.5;
        return html`
          <span class="star"
            @click=${() => this._handleClick(starNum)}
            @mouseenter=${() => this._handleHover(starNum)}
            @mouseleave=${this._handleLeave}>
            <svg width=${s} height=${s} viewBox="0 0 24 24">
              ${filled
                ? svg`<path class="star-filled" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>`
                : half
                  ? svg`<path class="star-half" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" opacity="0.3"/>
                         <path class="star-filled" d="M12 2v15.27L5.82 21l1.64-7.03L2 9.24l7.19-.61L12 2z"/>`
                  : svg`<path class="star-empty" d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>`}
            </svg>
          </span>
        `;
      })}
    `;
  }

  private _handleClick(starNum: number) {
    if (this.readonly) return;
    this.value = starNum;
    this.dispatchEvent(new CustomEvent('rating-changed', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  private _handleHover(starNum: number) {
    if (this.readonly) return;
    this._hoverValue = starNum;
  }

  private _handleLeave() {
    this._hoverValue = 0;
  }
}

customElements.define('md-rating', MdRating);

declare global {
  interface HTMLElementTagNameMap {
    'md-rating': MdRating;
  }
}
