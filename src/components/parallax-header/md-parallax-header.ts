import { LitElement, html, css, nothing } from 'lit';

/**
 * MD3 Parallax Header — background scrolls at a slower rate than content,
 * creating a depth/parallax effect. Content fades out as the user scrolls past.
 */
export class MdParallaxHeader extends LitElement {
  static override properties = {
    height: { type: Number },
    parallaxFactor: { type: Number, attribute: 'parallax-factor' },
    src: { type: String },
    overlay: { type: Boolean, reflect: true },
    scrollTarget: { type: Object, attribute: false },
  };

  declare height: number;
  declare parallaxFactor: number;
  declare src: string;
  declare overlay: boolean;
  declare scrollTarget: HTMLElement | Window | null;

  private _bgTranslateY = 0;
  private _contentOpacity = 1;
  private _contentTranslateY = 0;
  private _lastProgress = -1;
  private _scrollHandler: (() => void) | null = null;

  constructor() {
    super();
    this.height = 300;
    this.parallaxFactor = 0.5;
    this.src = '';
    this.overlay = false;
    this.scrollTarget = null;
  }

  static override styles = css`
    :host {
      display: block;
      position: relative;
    }

    .container {
      position: relative;
      overflow: hidden;
    }

    .background {
      position: absolute;
      left: 0;
      right: 0;
      will-change: transform;
    }

    .bg-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    ::slotted([slot='background']) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        transparent 30%,
        var(--md-sys-color-scrim, rgba(0, 0, 0, 0.38)) 100%
      );
      pointer-events: none;
    }

    .content {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 24px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      will-change: transform, opacity;
      z-index: 1;
    }

    :host([overlay]) .content {
      color: var(--md-sys-color-inverse-on-surface, #f5eff7);
    }
  `;

  override render() {
    const extraHeight = this.height * this.parallaxFactor;
    const bgHeight = this.height + extraHeight;

    return html`
      <div class="container" style="height: ${this.height}px">
        <div
          class="background"
          style="top: ${-extraHeight}px; height: ${bgHeight}px; transform: translateY(${this._bgTranslateY}px)"
        >
          <slot name="background">
            ${this.src
              ? html`<img
                  class="bg-image"
                  src=${this.src}
                  alt=""
                  loading="eager"
                />`
              : html`<div
                  style="width:100%;height:100%;background:var(--md-sys-color-surface-container-high, #ece6f0)"
                ></div>`}
          </slot>
        </div>
        ${this.overlay ? html`<div class="scrim"></div>` : nothing}
        <div
          class="content"
          style="opacity: ${this._contentOpacity}; transform: translateY(${this._contentTranslateY}px)"
        >
          <slot></slot>
        </div>
      </div>
    `;
  }

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

  private _resolvedTarget: HTMLElement | Window | null = null;

  private _findScrollParent(): HTMLElement | Window {
    if (this.scrollTarget) return this.scrollTarget;
    let el = this.parentElement;
    while (el) {
      const style = getComputedStyle(el);
      if (
        style.overflowY === 'auto' ||
        style.overflowY === 'scroll' ||
        style.overflow === 'auto' ||
        style.overflow === 'scroll'
      ) {
        return el;
      }
      el = el.parentElement;
    }
    return window;
  }

  private _setupScrollListener() {
    const target = this._findScrollParent();
    this._resolvedTarget = target;
    this._scrollHandler = () => {
      const scrollY =
        target instanceof Window ? target.scrollY : target.scrollTop;

      const progress = Math.min(Math.max(scrollY / this.height, 0), 1);

      this._bgTranslateY = scrollY * this.parallaxFactor;
      this._contentOpacity = 1 - progress;
      this._contentTranslateY = -scrollY * 0.2;

      if (this._lastProgress !== progress) {
        this._lastProgress = progress;
        this.dispatchEvent(
          new CustomEvent('scroll-progress', {
            detail: { progress },
            bubbles: true,
            composed: true,
          }),
        );
      }

      this.requestUpdate();
    };
    target.addEventListener('scroll', this._scrollHandler, { passive: true });
  }

  private _teardownScrollListener() {
    if (this._scrollHandler && this._resolvedTarget) {
      this._resolvedTarget.removeEventListener('scroll', this._scrollHandler);
      this._scrollHandler = null;
      this._resolvedTarget = null;
    }
  }
}

customElements.define('md-parallax-header', MdParallaxHeader);

declare global {
  interface HTMLElementTagNameMap {
    'md-parallax-header': MdParallaxHeader;
  }
}
