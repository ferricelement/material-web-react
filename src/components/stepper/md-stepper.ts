import { LitElement, html, css } from 'lit';

/**
 * MD3 Stepper component.
 *
 * Displays a multi-step progress indicator. Supports horizontal and vertical orientations.
 */
export class MdStepper extends LitElement {
  static override properties = {
    activeStep: { type: Number, attribute: 'active-step', reflect: true },
    orientation: { type: String, reflect: true },
  };

  declare activeStep: number;
  declare orientation: 'horizontal' | 'vertical';

  constructor() {
    super();
    this.activeStep = 0;
    this.orientation = 'horizontal';
  }

  static override styles = css`
    :host {
      display: block;
    }

    :host([orientation="horizontal"]) .track {
      display: flex;
      align-items: flex-start;
    }

    :host([orientation="vertical"]) .track {
      display: flex;
      flex-direction: column;
    }
  `;

  override render() {
    return html`
      <div class="track">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  override updated(changed: Map<string, unknown>) {
    if (changed.has('activeStep') || changed.has('orientation')) {
      this._updateSteps();
    }
  }

  private _handleSlotChange() {
    this._updateSteps();
  }

  private _updateSteps() {
    const slot = this.shadowRoot?.querySelector('slot');
    if (!slot) return;
    const items = slot.assignedElements() as HTMLElement[];
    const total = items.length;
    items.forEach((item: any, i: number) => {
      item.index = i;
      item.total = total;
      item.orientation = this.orientation;
      if (i < this.activeStep) {
        item.state = 'completed';
      } else if (i === this.activeStep) {
        item.state = 'active';
      } else {
        item.state = 'inactive';
      }
    });
  }
}

/**
 * MD3 Stepper Step. A single step in the stepper.
 */
export class MdStepperStep extends LitElement {
  static override properties = {
    label: { type: String },
    description: { type: String },
    state: { type: String, reflect: true },
    index: { type: Number },
    total: { type: Number },
    orientation: { type: String, reflect: true },
    optional: { type: Boolean },
    error: { type: Boolean, reflect: true },
  };

  declare label: string;
  declare description: string;
  declare state: 'active' | 'completed' | 'inactive';
  declare index: number;
  declare total: number;
  declare orientation: 'horizontal' | 'vertical';
  declare optional: boolean;
  declare error: boolean;

  constructor() {
    super();
    this.label = '';
    this.description = '';
    this.state = 'inactive';
    this.index = 0;
    this.total = 0;
    this.orientation = 'horizontal';
    this.optional = false;
    this.error = false;
  }

  static override styles = css`
    :host {
      display: flex;
      align-items: center;
    }

    :host([orientation="horizontal"]) {
      flex: 1;
    }

    :host([orientation="vertical"]) {
      flex-direction: row;
      padding: 8px 0;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: default;
    }

    .circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 500;
      flex-shrink: 0;
      transition: background 200ms, color 200ms;
    }

    :host([state="active"]) .circle {
      background: var(--md-sys-color-primary, #6750a4);
      color: var(--md-sys-color-on-primary, #fff);
    }

    :host([state="completed"]) .circle {
      background: var(--md-sys-color-primary, #6750a4);
      color: var(--md-sys-color-on-primary, #fff);
    }

    :host([state="inactive"]) .circle {
      background: var(--md-sys-color-surface-container-highest, #e6e0e9);
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    :host([error]) .circle {
      background: var(--md-sys-color-error, #b3261e);
      color: var(--md-sys-color-on-error, #fff);
    }

    .check-icon {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    .labels {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .label {
      font-size: 14px;
      font-weight: 500;
      color: var(--md-sys-color-on-surface, #1d1b20);
      white-space: nowrap;
    }

    :host([state="inactive"]) .label {
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    :host([error]) .label {
      color: var(--md-sys-color-error, #b3261e);
    }

    .description {
      font-size: 12px;
      color: var(--md-sys-color-on-surface-variant, #49454f);
    }

    .connector {
      flex: 1;
      height: 1px;
      background: var(--md-sys-color-outline-variant, #cac4d0);
      margin: 0 8px;
      min-width: 24px;
    }

    :host([orientation="vertical"]) .connector {
      display: none;
    }

    :host(:last-child) .connector {
      display: none;
    }
  `;

  override render() {
    return html`
      <div class="step">
        <div class="circle">
          ${this.state === 'completed' && !this.error
            ? html`<svg class="check-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`
            : this.error
              ? html`!`
              : this.index + 1}
        </div>
        <div class="labels">
          <span class="label">${this.label}</span>
          ${this.description
            ? html`<span class="description">${this.description}</span>`
            : this.optional
              ? html`<span class="description">Optional</span>`
              : ''}
        </div>
      </div>
      <div class="connector"></div>
    `;
  }
}

customElements.define('md-stepper', MdStepper);
customElements.define('md-stepper-step', MdStepperStep);

declare global {
  interface HTMLElementTagNameMap {
    'md-stepper': MdStepper;
    'md-stepper-step': MdStepperStep;
  }
}
