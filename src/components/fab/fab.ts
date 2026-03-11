import { createComponent, event } from '../../utils/create-component.js';
import { MdFab } from '@material/web/fab/fab.js';

export const Fab = createComponent<MdFab>({
  tagName: 'md-fab',
  elementClass: MdFab,
  events: {
    onClick: event<MouseEvent>('click'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
