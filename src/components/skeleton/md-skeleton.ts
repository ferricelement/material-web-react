import { LitElement, css } from 'lit';

/**
 * MD3 Skeleton loading placeholder.
 *
 * Displays an animated placeholder that mimics content shape while loading.
 * Variants: text, circular, rectangular.
 */
export class MdSkeleton extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
    width: { type: String },
    height: { type: String },
  };

  declare variant: 'text' | 'circular' | 'rectangular';
  declare width: string;
  declare height: string;

  constructor() {
    super();
    this.variant = 'text';
    this.width = '';
    this.height = '';
  }

  static override styles = css`
    :host {
      display: block;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    :host {
      background: linear-gradient(
        90deg,
        var(--md-sys-color-surface-container-highest, #e6e0e9) 25%,
        var(--md-sys-color-surface-container, #f3edf7) 50%,
        var(--md-sys-color-surface-container-highest, #e6e0e9) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite ease-in-out;
    }

    :host([variant="text"]) {
      height: 1em;
      border-radius: var(--md-sys-shape-corner-extra-small, 4px);
    }

    :host([variant="circular"]) {
      border-radius: 50%;
    }

    :host([variant="rectangular"]) {
      border-radius: var(--md-sys-shape-corner-medium, 12px);
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this._applySize();
  }

  override updated() {
    this._applySize();
  }

  private _cssVal(v: string): string {
    // Add px if value is purely numeric
    return /^\d+(\.\d+)?$/.test(v) ? `${v}px` : v;
  }

  private _applySize() {
    if (this.width) this.style.width = this._cssVal(this.width);
    if (this.height) this.style.height = this._cssVal(this.height);
    if (this.variant === 'circular' && !this.height) {
      const size = this.width ? this._cssVal(this.width) : '40px';
      this.style.height = size;
      this.style.width = size;
    }
  }
}

customElements.define('md-skeleton', MdSkeleton);

declare global {
  interface HTMLElementTagNameMap {
    'md-skeleton': MdSkeleton;
  }
}
