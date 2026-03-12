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

/**
 * MD3 Hero Transition — a large hero banner that smoothly collapses into
 * a compact header bar on scroll. Uses opacity crossfade (no height animation)
 * for GPU-friendly performance.
 */
export class MdHeroTransition extends LitElement {
  static override properties = {
    expandedHeight: { type: Number, attribute: 'expanded-height' },
    collapsedHeight: { type: Number, attribute: 'collapsed-height' },
    src: { type: String },
    headline: { type: String },
    supportingText: { type: String, attribute: 'supporting-text' },
    scrollTarget: { type: Object, attribute: false },
  };

  declare expandedHeight: number;
  declare collapsedHeight: number;
  declare src: string;
  declare headline: string;
  declare supportingText: string;
  declare scrollTarget: HTMLElement | Window | null;

  private _progress = 0;
  private _lastProgress = -1;
  private _scrollHandler: (() => void) | null = null;

  constructor() {
    super();
    this.expandedHeight = 300;
    this.collapsedHeight = 64;
    this.src = '';
    this.headline = '';
    this.supportingText = '';
    this.scrollTarget = null;
  }

  static override styles = css`
    :host {
      display: block;
    }

    .hero {
      position: sticky;
      top: 0;
      z-index: 2;
      overflow: visible;
      background: var(--md-sys-color-surface, #fffbfe);
    }

    .hero.collapsed-bg {
      background: var(--md-sys-color-surface-container, #f3edf7);
    }

    .elevation {
      position: absolute;
      inset: 0;
      pointer-events: none;
      transition: box-shadow 200ms cubic-bezier(0.2, 0, 0, 1);
    }

    .elevation.level-1 {
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
        0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    }

    .elevation.level-2 {
      box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3),
        0px 2px 6px 2px rgba(0, 0, 0, 0.15);
    }

    .expanded-layer {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      will-change: opacity;
      transition: opacity 100ms cubic-bezier(0.2, 0, 0, 1);
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-bg-fallback {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        var(--md-sys-color-primary-container, #eaddff) 0%,
        var(--md-sys-color-tertiary-container, #ffd8e4) 100%
      );
    }

    .expanded-scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        transparent 40%,
        rgba(0, 0, 0, 0.4) 100%
      );
      pointer-events: none;
    }

    .expanded-content {
      position: relative;
      padding: 24px;
      z-index: 1;
    }

    .expanded-headline {
      font-family: var(--md-sys-typescale-headline-large-font, 'Roboto', sans-serif);
      font-size: 32px;
      font-weight: 400;
      line-height: 40px;
      color: var(--md-sys-color-inverse-on-surface, #f5eff7);
    }

    .expanded-supporting {
      font-size: 14px;
      line-height: 20px;
      color: var(--md-sys-color-inverse-on-surface, #f5eff7);
      opacity: 0.85;
      margin-top: 4px;
    }

    :host(:not([src])) .expanded-headline,
    :host(:not([src])) .expanded-supporting {
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .collapsed-layer {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      padding: 0 16px;
      will-change: opacity;
      transition: opacity 100ms cubic-bezier(0.2, 0, 0, 1);
    }

    .collapsed-headline {
      font-family: var(--md-sys-typescale-title-large-font, 'Roboto', sans-serif);
      font-size: 22px;
      font-weight: 400;
      line-height: 28px;
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    .scroll-spacer {
      position: relative;
      z-index: 3;
      pointer-events: none;
    }

    .body-content {
      position: relative;
      z-index: 3;
      background: var(--md-sys-color-surface, #fffbfe);
    }
  `;

  override render() {
    const progress = this._progress;
    const scrollRange = this.expandedHeight - this.collapsedHeight;
    const elevLevel = progress > 0.8 ? 2 : progress > 0.3 ? 1 : 0;
    const isCollapsedBg = progress > 0.5;

    return html`
      <div
        class="hero ${isCollapsedBg ? 'collapsed-bg' : ''}"
        style="height: ${this.collapsedHeight}px"
      >
        <div class="elevation ${elevLevel > 0 ? `level-${elevLevel}` : ''}"></div>

        <!-- Expanded layer -->
        <div class="expanded-layer" style="opacity: ${1 - progress}; height: ${this.expandedHeight}px">
          <slot name="expanded">
            ${this.src
              ? html`<img class="hero-bg" src=${this.src} alt="" loading="eager" />
                     <div class="expanded-scrim"></div>`
              : html`<div class="hero-bg-fallback"></div>`}
            <div class="expanded-content">
              ${this.headline
                ? html`<div class="expanded-headline">${this.headline}</div>`
                : nothing}
              ${this.supportingText
                ? html`<div class="expanded-supporting">${this.supportingText}</div>`
                : nothing}
            </div>
          </slot>
        </div>

        <!-- Collapsed layer -->
        <div
          class="collapsed-layer"
          style="height: ${this.collapsedHeight}px; opacity: ${progress}"
        >
          <slot name="collapsed">
            <div class="collapsed-headline">${this.headline}</div>
          </slot>
        </div>
      </div>

      <div class="scroll-spacer" style="height: ${scrollRange}px"></div>

      <div class="body-content">
        <slot></slot>
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

      const scrollRange = this.expandedHeight - this.collapsedHeight;
      const progress = Math.min(Math.max(scrollY / scrollRange, 0), 1);

      this._progress = progress;

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

customElements.define('md-hero-transition', MdHeroTransition);

declare global {
  interface HTMLElementTagNameMap {
    'md-parallax-header': MdParallaxHeader;
    'md-hero-transition': MdHeroTransition;
  }
}
