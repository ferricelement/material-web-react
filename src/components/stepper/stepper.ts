import { createComponent } from '../../utils/create-component.js';
import { MdStepper, MdStepperStep } from './md-stepper.js';

export const Stepper = createComponent<MdStepper>({
  tagName: 'md-stepper',
  elementClass: MdStepper,
  events: {},
});

export const StepperStep = createComponent<MdStepperStep>({
  tagName: 'md-stepper-step',
  elementClass: MdStepperStep,
  events: {},
});
