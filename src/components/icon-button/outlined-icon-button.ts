import { createComponent, event } from '../../utils/create-component.js';
import { MdOutlinedIconButton } from '@material/web/iconbutton/outlined-icon-button.js';

export const OutlinedIconButton = createComponent<MdOutlinedIconButton>({
  tagName: 'md-outlined-icon-button',
  elementClass: MdOutlinedIconButton,
  events: {
    onClick: event<MouseEvent>('click'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
