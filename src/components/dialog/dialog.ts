import { createComponent, event } from '../../utils/create-component.js';
import { MdDialog } from '@material/web/dialog/dialog.js';

export const Dialog = createComponent<MdDialog>({
  tagName: 'md-dialog',
  elementClass: MdDialog,
  events: {
    onOpen: event<Event>('open'),
    onClose: event<Event>('close'),
    onOpened: event<Event>('opened'),
    onClosed: event<Event>('closed'),
    onCancel: event<Event>('cancel'),
  },
});
