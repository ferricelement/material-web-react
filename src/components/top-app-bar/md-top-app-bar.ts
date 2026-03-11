import { LitElement, html, css } from 'lit';
import '@material/web/elevation/elevation.js';

export class MdTopAppBar extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
    headline: { type: String },
    scrollTarget: { type: Object, attribute: false },
  };

  declare variant: 'center-aligned' | 'small' | 'medium' | 'large';
  declare headline: string;
  declare scrollTarget: HTMLElement | Window | null;

  private _scrollHandler: (() => void) | null = null;
  private _scrolled = false;

  constructor() {
    super();
    this.variant = 'small';
    this.headline = '';
    this.scrollTarget = null;
  }

  static override styles = css`
    :host {
      display: block;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .bar {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 4px;
      background: var(--md-sys-color-surface, #fffbfe);
      transition: background 200ms ease, box-shadow 200ms ease;
    }

    :host([variant='small']) .bar,
    :host([variant='center-aligned']) .bar {
      height: 64px;
      gap: 4px;
    }

    :host([variant='medium']) .bar {
      height: 112px;
      flex-wrap: wrap;
      align-content: flex-start;
      padding-top: 8px;
    }

    :host([variant='large']) .bar {
      height: 152px;
      flex-wrap: wrap;
      align-content: flex-start;
      padding-top: 8px;
    }

    .bar.scrolled {
      background: var(--md-sys-color-surface-container, #f3edf7);
    }

    md-elevation {
      --md-elevation-level: 0;
      transition: --md-elevation-level 200ms ease;
    }

    .bar.scrolled md-elevation {
      --md-elevation-level: 2;
    }

    .leading {
      display: flex;
      align-items: center;
    }

    .headline {
      flex: 1;
      font-family: var(--md-ref-typeface-plain, 'Roboto', sans-serif);
      color: var(--md-sys-color-on-surface, #1d1b20);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([variant='small']) .headline,
    :host([variant='center-aligned']) .headline {
      font-size: 22px;
      font-weight: 400;
      line-height: 28px;
      padding: 0 16px;
    }

    :host([variant='center-aligned']) .headline {
      text-align: center;
    }

    :host([variant='medium']) .headline,
    :host([variant='large']) .headline {
      width: 100%;
      padding: 0 16px;
      align-self: flex-end;
      padding-bottom: 16px;
    }

    :host([variant='medium']) .headline {
      font-size: 24px;
      font-weight: 400;
      line-height: 32px;
    }

    :host([variant='large']) .headline {
      font-size: 28px;
      font-weight: 400;
      line-height: 36px;
    }

    .trailing {
      display: flex;
      align-items: center;
    }

    .top-row {
      display: flex;
      align-items: center;
      width: 100%;
      height: 64px;
      padding: 0;
    }

    .top-row .spacer {
      flex: 1;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this._setupScrollListener();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._teardownScrollListener();
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('scrollTarget')) {
      this._teardownScrollListener();
      this._setupScrollListener();
    }
  }

  private _setupScrollListener() {
    const target = this.scrollTarget || window;
    this._scrollHandler = () => {
      const scrollTop = target instanceof Window
        ? target.scrollY
        : target.scrollTop;
      const wasScrolled = this._scrolled;
      this._scrolled = scrollTop > 0;
      if (wasScrolled !== this._scrolled) {
        this.requestUpdate();
      }
    };
    target.addEventListener('scroll', this._scrollHandler, { passive: true });
  }

  private _teardownScrollListener() {
    if (this._scrollHandler) {
      const target = this.scrollTarget || window;
      target.removeEventListener('scroll', this._scrollHandler);
      this._scrollHandler = null;
    }
  }

  override render() {
    const isCompact = this.variant === 'small' || this.variant === 'center-aligned';
    const barClasses = `bar${this._scrolled ? ' scrolled' : ''}`;

    if (isCompact) {
      return html`
        <div class=${barClasses}>
          <md-elevation></md-elevation>
          <div class="leading"><slot name="leading"></slot></div>
          <div class="headline">${this.headline}<slot name="headline"></slot></div>
          <div class="trailing"><slot name="trailing"></slot></div>
        </div>
      `;
    }

    return html`
      <div class=${barClasses}>
        <md-elevation></md-elevation>
        <div class="top-row">
          <div class="leading"><slot name="leading"></slot></div>
          <div class="spacer"></div>
          <div class="trailing"><slot name="trailing"></slot></div>
        </div>
        <div class="headline">${this.headline}<slot name="headline"></slot></div>
      </div>
    `;
  }
}

customElements.define('md-top-app-bar', MdTopAppBar);

declare global {
  interface HTMLElementTagNameMap {
    'md-top-app-bar': MdTopAppBar;
  }
}
