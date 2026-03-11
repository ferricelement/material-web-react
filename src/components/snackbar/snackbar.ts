import { createComponent, event } from '../../utils/create-component.js';
import { MdSnackbar } from './md-snackbar.js';

export const Snackbar = createComponent<MdSnackbar>({
  tagName: 'md-snackbar',
  elementClass: MdSnackbar,
  events: {
    onOpen: event<Event>('open'),
    onClose: event<Event>('close'),
  },
});
