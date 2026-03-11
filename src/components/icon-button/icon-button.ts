import { createComponent, event } from '../../utils/create-component.js';
import { MdIconButton } from '@material/web/iconbutton/icon-button.js';

export const IconButton = createComponent<MdIconButton>({
  tagName: 'md-icon-button',
  elementClass: MdIconButton,
  events: {
    onClick: event<MouseEvent>('click'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
