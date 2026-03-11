import { LitElement, html, css, nothing } from 'lit';

/**
 * MD3 Data Table component.
 *
 * Renders tabular data with optional sorting and pagination.
 * Columns and rows are provided as JSON properties.
 */
export class MdDataTable extends LitElement {
  static override properties = {
    columns: { type: Array },
    rows: { type: Array },
    sortable: { type: Boolean },
    paginated: { type: Boolean },
    pageSize: { type: Number, attribute: 'page-size' },
    _sortCol: { state: true },
    _sortDir: { state: true },
    _page: { state: true },
  };

  declare columns: Array<string | { key: string; label: string; align?: 'start' | 'end' }>;
  declare rows: Array<string[] | Record<string, unknown>>;
  declare sortable: boolean;
  declare paginated: boolean;
  declare pageSize: number;
  declare _sortCol: string;
  declare _sortDir: 'asc' | 'desc';
  declare _page: number;

  constructor() {
    super();
    this.columns = [];
    this.rows = [];
    this.sortable = false;
    this.paginated = false;
    this.pageSize = 10;
    this._sortCol = '';
    this._sortDir = 'asc';
    this._page = 0;
  }

  static override styles = css`
    :host {
      display: block;
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-family: inherit;
    }

    thead {
      background: var(--md-sys-color-surface-container, #f3edf7);
    }

    th {
      text-align: start;
      padding: 12px 16px;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.5px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      white-space: nowrap;
      user-select: none;
    }

    th.sortable {
      cursor: pointer;
    }

    th.sortable:hover {
      color: var(--md-sys-color-on-surface, #1d1b20);
    }

    th[data-align="end"], td[data-align="end"] {
      text-align: end;
    }

    .sort-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
      vertical-align: middle;
      margin-left: 4px;
      fill: currentColor;
      opacity: 0;
      transition: opacity 150ms, transform 150ms;
    }

    th.sorted .sort-icon {
      opacity: 1;
    }

    th.sorted.desc .sort-icon {
      transform: rotate(180deg);
    }

    td {
      padding: 12px 16px;
      font-size: 14px;
      color: var(--md-sys-color-on-surface, #1d1b20);
      border-bottom: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
    }

    tr:last-child td {
      border-bottom: none;
    }

    tbody tr:hover {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 4%, var(--md-sys-color-surface, #fef7ff));
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 16px;
      padding: 8px 16px;
      border-top: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .page-info {
      font-size: 12px;
    }

    .page-btn {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: var(--md-sys-color-on-surface, #1d1b20);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .page-btn:hover:not(:disabled) {
      background: color-mix(in srgb, var(--md-sys-color-on-surface, #1d1b20) 8%, transparent);
    }

    .page-btn:disabled {
      opacity: 0.38;
      cursor: default;
    }

    .page-btn svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }
  `;

  private get _normalizedColumns(): Array<{ key: string; label: string; align: string }> {
    return this.columns.map((col, i) =>
      typeof col === 'string' ? { key: String(i), label: col, align: 'start' } : { key: col.key, label: col.label, align: col.align || 'start' }
    );
  }

  private _getCellValue(row: string[] | Record<string, unknown>, col: { key: string }): unknown {
    if (Array.isArray(row)) return row[parseInt(col.key)] ?? '';
    return row[col.key] ?? '';
  }

  private get _sortedRows() {
    if (!this._sortCol) return this.rows;
    const col = this._normalizedColumns.find(c => c.key === this._sortCol);
    if (!col) return this.rows;
    const dir = this._sortDir === 'asc' ? 1 : -1;
    return [...this.rows].sort((a, b) => {
      const aVal = this._getCellValue(a, col);
      const bVal = this._getCellValue(b, col);
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * dir;
      }
      return String(aVal).localeCompare(String(bVal)) * dir;
    });
  }

  private get _pagedRows() {
    const sorted = this._sortedRows;
    if (!this.paginated) return sorted;
    const start = this._page * this.pageSize;
    return sorted.slice(start, start + this.pageSize);
  }

  private get _totalPages() {
    return Math.ceil(this.rows.length / this.pageSize);
  }

  override render() {
    const cols = this._normalizedColumns;
    return html`
      <table>
        <thead>
          <tr>
            ${cols.map(col => {
              const isSorted = this._sortCol === col.key;
              const classes = [
                this.sortable ? 'sortable' : '',
                isSorted ? 'sorted' : '',
                isSorted && this._sortDir === 'desc' ? 'desc' : '',
              ].filter(Boolean).join(' ');
              return html`
                <th class=${classes}
                    data-align=${col.align}
                    @click=${this.sortable ? () => this._handleSort(col.key) : nothing}>
                  ${col.label}
                  ${this.sortable ? html`
                    <svg class="sort-icon" viewBox="0 0 24 24">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
                    </svg>
                  ` : nothing}
                </th>
              `;
            })}
          </tr>
        </thead>
        <tbody>
          ${this._pagedRows.map(row => html`
            <tr>
              ${cols.map(col => html`
                <td data-align=${col.align}>${this._getCellValue(row, col)}</td>
              `)}
            </tr>
          `)}
        </tbody>
      </table>
      ${this.paginated ? html`
        <div class="pagination">
          <span class="page-info">
            ${this._page * this.pageSize + 1}–${Math.min((this._page + 1) * this.pageSize, this.rows.length)}
            of ${this.rows.length}
          </span>
          <button class="page-btn" ?disabled=${this._page === 0} @click=${this._prevPage}>
            <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
          <button class="page-btn" ?disabled=${this._page >= this._totalPages - 1} @click=${this._nextPage}>
            <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </div>
      ` : nothing}
    `;
  }

  private _handleSort(key: string) {
    if (this._sortCol === key) {
      this._sortDir = this._sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this._sortCol = key;
      this._sortDir = 'asc';
    }
    this.dispatchEvent(new CustomEvent('data-table-sort', {
      detail: { column: this._sortCol, direction: this._sortDir },
      bubbles: true,
      composed: true,
    }));
  }

  private _prevPage() {
    if (this._page > 0) {
      this._page--;
      this._dispatchPageChange();
    }
  }

  private _nextPage() {
    if (this._page < this._totalPages - 1) {
      this._page++;
      this._dispatchPageChange();
    }
  }

  private _dispatchPageChange() {
    this.dispatchEvent(new CustomEvent('data-table-page', {
      detail: { page: this._page },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('md-data-table', MdDataTable);

declare global {
  interface HTMLElementTagNameMap {
    'md-data-table': MdDataTable;
  }
}
