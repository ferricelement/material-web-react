import { createComponent, event } from '../../utils/create-component.js';
import { MdFilledIconButton } from '@material/web/iconbutton/filled-icon-button.js';

export const FilledIconButton = createComponent<MdFilledIconButton>({
  tagName: 'md-filled-icon-button',
  elementClass: MdFilledIconButton,
  events: {
    onClick: event<MouseEvent>('click'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
