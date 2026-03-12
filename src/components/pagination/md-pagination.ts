import { LitElement, html, css, nothing, svg } from 'lit';

const chevronLeft = svg`<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>`;
const chevronRight = svg`<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>`;
const firstPageIcon = svg`<path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>`;
const lastPageIcon = svg`<path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>`;

/**
 * MD3 Pagination component.
 *
 * Standalone page navigation with prev/next, page numbers, and optional first/last buttons.
 */
export class MdPagination extends LitElement {
  static override properties = {
    page: { type: Number, reflect: true },
    totalPages: { type: Number, attribute: 'total-pages' },
    totalItems: { type: Number, attribute: 'total-items' },
    pageSize: { type: Number, attribute: 'page-size' },
    siblingCount: { type: Number, attribute: 'sibling-count' },
    showFirstLast: { type: Boolean, attribute: 'show-first-last' },
    disabled: { type: Boolean, reflect: true },
  };

  declare page: number;
  declare totalPages: number;
  declare totalItems: number;
  declare pageSize: number;
  declare siblingCount: number;
  declare showFirstLast: boolean;
  declare disabled: boolean;

  constructor() {
    super();
    this.page = 1;
    this.totalPages = 0;
    this.totalItems = 0;
    this.pageSize = 0;
    this.siblingCount = 1;
    this.showFirstLast = false;
    this.disabled = false;
  }

  private get _resolvedTotalPages(): number {
    if (this.totalPages > 0) return this.totalPages;
    if (this.totalItems > 0 && this.pageSize > 0) {
      return Math.ceil(this.totalItems / this.pageSize);
    }
    return 1;
  }

  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: var(
        --md-sys-typescale-label-large-font,
        var(--md-ref-typeface-plain, Roboto, sans-serif)
      );
    }

    :host([disabled]) {
      opacity: 0.38;
      pointer-events: none;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      height: 36px;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: none;
      color: var(--md-sys-color-on-surface, #1d1b20);
      cursor: pointer;
      font-family: inherit;
      font-size: var(--md-sys-typescale-label-large-size, 0.875rem);
      font-weight: var(--md-sys-typescale-label-large-weight, 500);
      transition: background-color 0.2s;
      position: relative;
    }

    button:hover:not(:disabled):not(.active) {
      background: color-mix(
        in srgb,
        var(--md-sys-color-on-surface, #1d1b20) 8%,
        transparent
      );
    }

    button:focus-visible {
      outline: 2px solid var(--md-sys-color-primary, #6750a4);
      outline-offset: 2px;
    }

    button:disabled {
      color: var(--md-sys-color-on-surface, #1d1b20);
      opacity: 0.38;
      cursor: default;
    }

    button.active {
      background: var(--md-sys-color-primary, #6750a4);
      color: var(--md-sys-color-on-primary, #fff);
    }

    button.active:hover {
      background: color-mix(
        in srgb,
        var(--md-sys-color-on-primary, #fff) 8%,
        var(--md-sys-color-primary, #6750a4)
      );
    }

    .nav-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .ellipsis {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      height: 36px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      font-size: var(--md-sys-typescale-label-large-size, 0.875rem);
      letter-spacing: 2px;
      user-select: none;
    }
  `;

  override render() {
    const total = this._resolvedTotalPages;
    const current = Math.max(1, Math.min(this.page, total));
    const pages = this._getPageRange(current, total);

    return html`
      ${this.showFirstLast
        ? html`<button
            class="nav-btn"
            ?disabled=${current <= 1}
            @click=${() => this._setPage(1)}
            aria-label="First page"
          >
            <svg viewBox="0 0 24 24">${firstPageIcon}</svg>
          </button>`
        : nothing}

      <button
        class="nav-btn"
        ?disabled=${current <= 1}
        @click=${() => this._setPage(current - 1)}
        aria-label="Previous page"
      >
        <svg viewBox="0 0 24 24">${chevronLeft}</svg>
      </button>

      ${pages.map((p) =>
        p === '...'
          ? html`<span class="ellipsis">...</span>`
          : html`<button
              class=${p === current ? 'active' : ''}
              aria-current=${p === current ? 'page' : 'false'}
              @click=${() => this._setPage(p as number)}
            >
              ${p}
            </button>`,
      )}

      <button
        class="nav-btn"
        ?disabled=${current >= total}
        @click=${() => this._setPage(current + 1)}
        aria-label="Next page"
      >
        <svg viewBox="0 0 24 24">${chevronRight}</svg>
      </button>

      ${this.showFirstLast
        ? html`<button
            class="nav-btn"
            ?disabled=${current >= total}
            @click=${() => this._setPage(total)}
            aria-label="Last page"
          >
            <svg viewBox="0 0 24 24">${lastPageIcon}</svg>
          </button>`
        : nothing}
    `;
  }

  private _setPage(p: number) {
    const total = this._resolvedTotalPages;
    const clamped = Math.max(1, Math.min(p, total));
    if (clamped === this.page) return;
    this.page = clamped;
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: { page: this.page },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Generates the page number range with ellipsis.
   * Always shows first, last, current, and `siblingCount` pages around current.
   */
  private _getPageRange(
    current: number,
    total: number,
  ): (number | '...')[] {
    const sibling = this.siblingCount;

    // If total pages fits without ellipsis
    if (total <= 5 + sibling * 2) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(current - sibling, 2);
    const rightSibling = Math.min(current + sibling, total - 1);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < total - 1;

    const pages: (number | '...')[] = [1];

    if (showLeftEllipsis) {
      pages.push('...');
    } else {
      // Fill pages 2..leftSibling-1
      for (let i = 2; i < leftSibling; i++) {
        pages.push(i);
      }
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      pages.push(i);
    }

    if (showRightEllipsis) {
      pages.push('...');
    } else {
      for (let i = rightSibling + 1; i < total; i++) {
        pages.push(i);
      }
    }

    pages.push(total);
    return pages;
  }
}

customElements.define('md-pagination', MdPagination);

declare global {
  interface HTMLElementTagNameMap {
    'md-pagination': MdPagination;
  }
}
