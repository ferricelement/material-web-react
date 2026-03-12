import { LitElement, html, css, svg } from 'lit';

const uploadIcon = svg`<path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>`;

export class MdFileUpload extends LitElement {
  static override properties = {
    accept: { type: String, reflect: true },
    multiple: { type: Boolean, reflect: true },
    maxFiles: { type: Number, attribute: 'max-files' },
    maxSize: { type: Number, attribute: 'max-size' },
    disabled: { type: Boolean, reflect: true },
    noClick: { type: Boolean, attribute: 'no-click' },
    _dragOver: { type: Boolean, state: true },
  };

  declare accept: string;
  declare multiple: boolean;
  declare maxFiles: number;
  declare maxSize: number;
  declare disabled: boolean;
  declare noClick: boolean;
  declare _dragOver: boolean;

  constructor() {
    super();
    this.accept = '';
    this.multiple = false;
    this.maxFiles = 0;
    this.maxSize = 0;
    this.disabled = false;
    this.noClick = false;
    this._dragOver = false;
  }

  static override styles = css`
    :host {
      display: block;
    }

    :host([disabled]) {
      opacity: 0.38;
      pointer-events: none;
    }

    .dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 160px;
      padding: 32px 24px;
      border: 2px dashed var(--md-sys-color-outline-variant, #cac4d0);
      border-radius: var(--md-sys-shape-corner-large, 16px);
      background: var(--md-sys-color-surface, #fef7ff);
      cursor: pointer;
      transition: border-color 0.2s, background-color 0.2s, transform 0.15s;
      user-select: none;
    }

    :host([no-click]) .dropzone {
      cursor: default;
    }

    .dropzone:hover:not(.drag-over) {
      background: var(--md-sys-color-surface-container-lowest, #fff);
      border-color: var(--md-sys-color-outline, #79747e);
    }

    .dropzone.drag-over {
      border-color: var(--md-sys-color-primary, #6750a4);
      border-style: solid;
      background: var(--md-sys-color-primary-container, #eaddff);
      transform: scale(1.01);
    }

    .default-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .icon {
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .icon svg {
      width: 40px;
      height: 40px;
      fill: currentColor;
    }

    .drag-over .icon {
      color: var(--md-sys-color-primary, #6750a4);
    }

    .label {
      font-family: var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto, sans-serif));
      font-size: var(--md-sys-typescale-body-large-size, 1rem);
      line-height: var(--md-sys-typescale-body-large-line-height, 1.5rem);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      text-align: center;
    }

    .drag-over .label {
      color: var(--md-sys-color-on-primary-container, #21005d);
    }

    .hint {
      font-family: var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto, sans-serif));
      font-size: var(--md-sys-typescale-body-small-size, 0.75rem);
      line-height: var(--md-sys-typescale-body-small-line-height, 1rem);
      color: var(--md-sys-color-on-surface-variant, #49454f);
      opacity: 0.7;
    }

    input {
      display: none;
    }
  `;

  override render() {
    const classes = `dropzone${this._dragOver ? ' drag-over' : ''}`;

    return html`
      <div
        class=${classes}
        @click=${this._onClick}
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        <slot>
          <div class="default-content">
            <div class="icon">
              <svg viewBox="0 0 24 24">${uploadIcon}</svg>
            </div>
            <div class="label">Drag & drop files here or click to browse</div>
            ${this._renderHint()}
          </div>
        </slot>
      </div>
      <input
        type="file"
        .accept=${this.accept}
        ?multiple=${this.multiple}
        @change=${this._onInputChange}
      />
    `;
  }

  private _renderHint() {
    const hints: string[] = [];
    if (this.accept) {
      hints.push(this.accept.replace(/\./g, '').toUpperCase());
    }
    if (this.maxSize > 0) {
      hints.push(`max ${this._formatSize(this.maxSize)}`);
    }
    if (this.maxFiles > 0) {
      hints.push(`up to ${this.maxFiles} file${this.maxFiles > 1 ? 's' : ''}`);
    }
    if (hints.length === 0) return null;
    return html`<div class="hint">${hints.join(' · ')}</div>`;
  }

  private _formatSize(bytes: number): string {
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(0)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${bytes} B`;
  }

  private _onClick() {
    if (this.disabled || this.noClick) return;
    const input = this.shadowRoot?.querySelector('input');
    input?.click();
  }

  private _onInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;
    this._processFiles(Array.from(input.files));
    input.value = '';
  }

  private _onDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (this.disabled) return;
    this._dragOver = true;
  }

  private _onDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this._dragOver = false;
  }

  private _onDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    this._dragOver = false;
    if (this.disabled) return;

    const files = Array.from(e.dataTransfer?.files || []);
    if (files.length) {
      this._processFiles(files);
    }
  }

  private _processFiles(files: File[]) {
    const accepted: File[] = [];
    const rejected: Array<{ file: File; reason: string }> = [];

    for (const file of files) {
      if (this.accept && !this._matchesAccept(file)) {
        rejected.push({ file, reason: 'type' });
        continue;
      }
      if (this.maxSize > 0 && file.size > this.maxSize) {
        rejected.push({ file, reason: 'size' });
        continue;
      }
      accepted.push(file);
    }

    if (this.maxFiles > 0 && accepted.length > this.maxFiles) {
      const excess = accepted.splice(this.maxFiles);
      for (const file of excess) {
        rejected.push({ file, reason: 'count' });
      }
    }

    if (accepted.length > 0) {
      this.dispatchEvent(
        new CustomEvent('files-selected', {
          detail: { files: accepted },
          bubbles: true,
          composed: true,
        }),
      );
    }

    if (rejected.length > 0) {
      this.dispatchEvent(
        new CustomEvent('files-rejected', {
          detail: { files: rejected },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private _matchesAccept(file: File): boolean {
    const accepts = this.accept.split(',').map((a) => a.trim().toLowerCase());
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    return accepts.some((a) => {
      if (a.startsWith('.')) {
        return fileName.endsWith(a);
      }
      if (a.endsWith('/*')) {
        return fileType.startsWith(a.replace('/*', '/'));
      }
      return fileType === a;
    });
  }
}

customElements.define('md-file-upload', MdFileUpload);

declare global {
  interface HTMLElementTagNameMap {
    'md-file-upload': MdFileUpload;
  }
}
