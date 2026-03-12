import { LitElement, html, css } from 'lit';

/**
 * MD3 Popover component.
 *
 * A floating content panel triggered by an anchor element.
 * Richer than tooltip — can contain interactive content.
 */
export class MdPopover extends LitElement {
  static override properties = {
    open: { type: Boolean, reflect: true },
    anchor: { type: String },
    position: { type: String, reflect: true },
  };

  declare open: boolean;
  declare anchor: string;
  declare position: 'top' | 'bottom' | 'left' | 'right';

  constructor() {
    super();
    this.open = false;
    this.anchor = '';
    this.position = 'bottom';
  }

  static override styles = css`
    :host {
      display: contents;
    }

    .popover {
      position: fixed;
      z-index: 100;
      background: var(--md-sys-color-surface-container, #f3edf7);
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      box-shadow: 0px 2px 6px 2px rgba(0,0,0,0.15),
                  0px 1px 2px 0px rgba(0,0,0,0.3);
      padding: 16px;
      min-width: 200px;
      max-width: 360px;
      opacity: 0;
      visibility: hidden;
      transform: scale(0.95);
      transition: opacity 200ms cubic-bezier(0.2, 0, 0, 1),
                  transform 200ms cubic-bezier(0.2, 0, 0, 1),
                  visibility 0s 200ms;
    }

    :host([open]) .popover {
      opacity: 1;
      visibility: visible;
      transform: scale(1);
      transition: opacity 200ms cubic-bezier(0.2, 0, 0, 1),
                  transform 200ms cubic-bezier(0.2, 0, 0, 1);
    }
  `;

  override render() {
    return html`
      <div class="popover">
        <slot></slot>
      </div>
    `;
  }

  override connectedCallback() {
    super.connectedCallback();
    this._onDocClick = this._onDocClick.bind(this);
    document.addEventListener('click', this._onDocClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._onDocClick);
  }

  private _onDocClick(e: MouseEvent) {
    if (!this.open) return;
    const path = e.composedPath();
    if (!path.includes(this) && !path.includes(this._getAnchor() as EventTarget)) {
      this.open = false;
      this.dispatchEvent(new CustomEvent('popover-changed', {
        detail: { open: false },
        bubbles: true,
        composed: true,
      }));
    }
  }

  private _getAnchor(): HTMLElement | null {
    if (!this.anchor) return null;
    const root = this.getRootNode() as Document | ShadowRoot;
    return root.getElementById?.(this.anchor) || document.getElementById(this.anchor);
  }

  private _updatePosition() {
    const anchor = this._getAnchor();
    const popover = this.shadowRoot?.querySelector('.popover') as HTMLElement;
    if (!anchor || !popover) return;

    const rect = anchor.getBoundingClientRect();
    const gap = 8;

    switch (this.position) {
      case 'top':
        popover.style.left = `${rect.left}px`;
        popover.style.top = `${rect.top - gap}px`;
        popover.style.transform = this.open ? 'scale(1) translateY(-100%)' : 'scale(0.95) translateY(-100%)';
        break;
      case 'left':
        popover.style.left = `${rect.left - gap}px`;
        popover.style.top = `${rect.top}px`;
        popover.style.transform = this.open ? 'scale(1) translateX(-100%)' : 'scale(0.95) translateX(-100%)';
        break;
      case 'right':
        popover.style.left = `${rect.right + gap}px`;
        popover.style.top = `${rect.top}px`;
        popover.style.transform = '';
        break;
      default: // bottom
        popover.style.left = `${rect.left}px`;
        popover.style.top = `${rect.bottom + gap}px`;
        popover.style.transform = '';
        break;
    }
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open) {
        this._updatePosition();
      }
      this.dispatchEvent(new CustomEvent('popover-changed', {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      }));
    }
  }
}

customElements.define('md-popover', MdPopover);

declare global {
  interface HTMLElementTagNameMap {
    'md-popover': MdPopover;
  }
}
