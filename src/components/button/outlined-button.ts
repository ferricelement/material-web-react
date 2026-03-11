import { createComponent, event } from '../../utils/create-component.js';
import { MdOutlinedButton } from '@material/web/button/outlined-button.js';

export const OutlinedButton = createComponent<MdOutlinedButton>({
  tagName: 'md-outlined-button',
  elementClass: MdOutlinedButton,
  events: {
    onClick: event<MouseEvent>('click'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
