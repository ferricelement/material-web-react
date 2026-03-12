import { createComponent, event } from '../../utils/create-component.js';
import { MdAlert, MdBanner } from './md-alert.js';

export const Alert = createComponent<MdAlert>({
  tagName: 'md-alert',
  elementClass: MdAlert,
  events: {
    onClose: event<CustomEvent>('close'),
  },
});

export const Banner = createComponent<MdBanner>({
  tagName: 'md-banner',
  elementClass: MdBanner,
  events: {
    onClose: event<CustomEvent>('close'),
  },
});
