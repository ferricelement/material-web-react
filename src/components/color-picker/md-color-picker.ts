import { LitElement, html, css } from 'lit';

/**
 * MD3 Color Picker component.
 *
 * A compact color picker with a saturation/brightness area, hue slider,
 * hex input, and color preview swatch.
 */
export class MdColorPicker extends LitElement {
  static override properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
    _hue: { state: true },
    _saturation: { state: true },
    _brightness: { state: true },
    _draggingArea: { state: true },
    _draggingHue: { state: true },
    _hexInput: { state: true },
  };

  declare value: string;
  declare disabled: boolean;
  declare _hue: number;
  declare _saturation: number;
  declare _brightness: number;
  declare _draggingArea: boolean;
  declare _draggingHue: boolean;
  declare _hexInput: string;

  constructor() {
    super();
    this.value = '#6750a4';
    this.disabled = false;
    this._hue = 0;
    this._saturation = 100;
    this._brightness = 100;
    this._draggingArea = false;
    this._draggingHue = false;
    this._hexInput = '';
  }

  static override styles = css`
    :host {
      display: inline-block;
      font-family: var(--md-sys-typescale-body-medium-font, 'Roboto', sans-serif);
    }

    :host([disabled]) {
      opacity: 0.38;
      pointer-events: none;
    }

    .container {
      width: 256px;
      background: var(--md-sys-color-surface-container, #f3edf7);
      border-radius: var(--md-sys-shape-corner-large, 16px);
      padding: 16px;
      box-shadow: var(--md-sys-elevation-1, 0px 1px 2px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15));
    }

    .color-area {
      position: relative;
      width: 100%;
      height: 160px;
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      overflow: hidden;
      cursor: crosshair;
      touch-action: none;
    }

    .color-area canvas {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }

    .area-thumb {
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2.5px solid #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      transform: translate(-50%, -50%);
      pointer-events: none;
      box-sizing: border-box;
    }

    .hue-slider {
      position: relative;
      width: 100%;
      height: 16px;
      margin-top: 12px;
      border-radius: 8px;
      background: linear-gradient(
        to right,
        hsl(0, 100%, 50%),
        hsl(60, 100%, 50%),
        hsl(120, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(240, 100%, 50%),
        hsl(300, 100%, 50%),
        hsl(360, 100%, 50%)
      );
      cursor: pointer;
      touch-action: none;
    }

    .hue-thumb {
      position: absolute;
      top: 50%;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2.5px solid #fff;
      box-shadow: 0 1px 4px rgba(0,0,0,0.4);
      transform: translate(-50%, -50%);
      pointer-events: none;
      box-sizing: border-box;
    }

    .controls {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
    }

    .swatch {
      width: 36px;
      height: 36px;
      border-radius: var(--md-sys-shape-corner-medium, 12px);
      border: 1px solid var(--md-sys-color-outline-variant, #cac4d0);
      flex-shrink: 0;
    }

    .hex-input {
      flex: 1;
      min-width: 0;
      height: 36px;
      padding: 0 12px;
      border: 1px solid var(--md-sys-color-outline, #79747e);
      border-radius: var(--md-sys-shape-corner-small, 8px);
      background: var(--md-sys-color-surface, #fffbfe);
      color: var(--md-sys-color-on-surface, #1d1b20);
      font-family: var(--md-sys-typescale-body-medium-font, 'Roboto', monospace);
      font-size: 14px;
      outline: none;
      box-sizing: border-box;
    }

    .hex-input:focus {
      border-color: var(--md-sys-color-primary, #6750a4);
      border-width: 2px;
      padding: 0 11px;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this._parseHexToHsb(this.value);
    this._hexInput = this.value;
    this._boundPointerMove = this._handlePointerMove.bind(this);
    this._boundPointerUp = this._handlePointerUp.bind(this);
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value') && !this._draggingArea && !this._draggingHue) {
      this._parseHexToHsb(this.value);
      this._hexInput = this.value;
    }
    if (changed.has('_hue') || changed.has('_saturation') || changed.has('_brightness')) {
      this._drawCanvas();
    }
  }

  override firstUpdated() {
    this._drawCanvas();
  }

  private _boundPointerMove!: (e: PointerEvent) => void;
  private _boundPointerUp!: (e: PointerEvent) => void;

  override render() {
    const thumbX = (this._saturation / 100) * 100;
    const thumbY = ((100 - this._brightness) / 100) * 100;
    const thumbColor = this._hsbToHex(this._hue, this._saturation, this._brightness);
    const hueX = (this._hue / 360) * 100;
    const hueThumbColor = `hsl(${this._hue}, 100%, 50%)`;

    return html`
      <div class="container">
        <div class="color-area"
          @pointerdown=${this._handleAreaPointerDown}>
          <canvas></canvas>
          <div class="area-thumb"
            style="left:${thumbX}%;top:${thumbY}%;background:${thumbColor}"></div>
        </div>

        <div class="hue-slider"
          @pointerdown=${this._handleHuePointerDown}>
          <div class="hue-thumb"
            style="left:${hueX}%;background:${hueThumbColor}"></div>
        </div>

        <div class="controls">
          <div class="swatch" style="background:${this.value}"></div>
          <input class="hex-input"
            type="text"
            .value=${this._hexInput}
            @input=${this._handleHexInput}
            @change=${this._handleHexCommit}
            @keydown=${this._handleHexKeydown}
            maxlength="7"
            spellcheck="false"
          />
        </div>
      </div>
    `;
  }

  private _drawCanvas() {
    const canvas = this.shadowRoot?.querySelector('canvas');
    if (!canvas) return;

    const rect = canvas.parentElement!;
    const w = rect.clientWidth || 256;
    const h = rect.clientHeight || 160;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const ctx = canvas.getContext('2d')!;

    // Base hue fill
    ctx.fillStyle = `hsl(${this._hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, w, h);

    // White gradient (left to right)
    const whiteGrad = ctx.createLinearGradient(0, 0, w, 0);
    whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = whiteGrad;
    ctx.fillRect(0, 0, w, h);

    // Black gradient (top to bottom)
    const blackGrad = ctx.createLinearGradient(0, 0, 0, h);
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
    blackGrad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = blackGrad;
    ctx.fillRect(0, 0, w, h);
  }

  // --- Area pointer handling ---
  private _handleAreaPointerDown(e: PointerEvent) {
    if (this.disabled) return;
    e.preventDefault();
    this._draggingArea = true;
    this._updateAreaFromPointer(e);
    document.addEventListener('pointermove', this._boundPointerMove);
    document.addEventListener('pointerup', this._boundPointerUp);
  }

  // --- Hue pointer handling ---
  private _handleHuePointerDown(e: PointerEvent) {
    if (this.disabled) return;
    e.preventDefault();
    this._draggingHue = true;
    this._updateHueFromPointer(e);
    document.addEventListener('pointermove', this._boundPointerMove);
    document.addEventListener('pointerup', this._boundPointerUp);
  }

  private _handlePointerMove(e: PointerEvent) {
    e.preventDefault();
    if (this._draggingArea) {
      this._updateAreaFromPointer(e);
    } else if (this._draggingHue) {
      this._updateHueFromPointer(e);
    }
  }

  private _handlePointerUp() {
    this._draggingArea = false;
    this._draggingHue = false;
    document.removeEventListener('pointermove', this._boundPointerMove);
    document.removeEventListener('pointerup', this._boundPointerUp);
  }

  private _updateAreaFromPointer(e: PointerEvent) {
    const area = this.shadowRoot!.querySelector('.color-area') as HTMLElement;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    this._saturation = x * 100;
    this._brightness = (1 - y) * 100;
    this._commitValue();
  }

  private _updateHueFromPointer(e: PointerEvent) {
    const slider = this.shadowRoot!.querySelector('.hue-slider') as HTMLElement;
    if (!slider) return;
    const rect = slider.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    this._hue = x * 360;
    this._commitValue();
  }

  private _commitValue() {
    const hex = this._hsbToHex(this._hue, this._saturation, this._brightness);
    this.value = hex;
    this._hexInput = hex;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: hex },
      bubbles: true,
      composed: true,
    }));
  }

  // --- Hex input handling ---
  private _handleHexInput(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this._hexInput = input.value;
  }

  private _handleHexCommit() {
    const hex = this._normalizeHex(this._hexInput);
    if (hex) {
      this._parseHexToHsb(hex);
      this.value = hex;
      this._hexInput = hex;
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: hex },
        bubbles: true,
        composed: true,
      }));
    } else {
      // Revert to current value
      this._hexInput = this.value;
    }
  }

  private _handleHexKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this._handleHexCommit();
    }
  }

  // --- Color conversion utilities ---
  private _normalizeHex(input: string): string | null {
    let hex = input.trim();
    if (!hex.startsWith('#')) hex = '#' + hex;
    // Expand shorthand: #abc -> #aabbcc
    if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      return hex.toLowerCase();
    }
    return null;
  }

  private _parseHexToHsb(hex: string) {
    const normalized = this._normalizeHex(hex);
    if (!normalized) return;
    const r = parseInt(normalized.slice(1, 3), 16) / 255;
    const g = parseInt(normalized.slice(3, 5), 16) / 255;
    const b = parseInt(normalized.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;
    if (d !== 0) {
      if (max === r) h = ((g - b) / d + 6) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }

    const s = max === 0 ? 0 : (d / max) * 100;
    const v = max * 100;

    this._hue = h;
    this._saturation = s;
    this._brightness = v;
  }

  private _hsbToHex(h: number, s: number, b: number): string {
    const sFrac = s / 100;
    const vFrac = b / 100;
    const c = vFrac * sFrac;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = vFrac - c;
    let r = 0, g = 0, bl = 0;

    if (h < 60)       { r = c; g = x; bl = 0; }
    else if (h < 120) { r = x; g = c; bl = 0; }
    else if (h < 180) { r = 0; g = c; bl = x; }
    else if (h < 240) { r = 0; g = x; bl = c; }
    else if (h < 300) { r = x; g = 0; bl = c; }
    else              { r = c; g = 0; bl = x; }

    const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('pointermove', this._boundPointerMove);
    document.removeEventListener('pointerup', this._boundPointerUp);
  }
}

customElements.define('md-color-picker', MdColorPicker);

declare global {
  interface HTMLElementTagNameMap {
    'md-color-picker': MdColorPicker;
  }
}
