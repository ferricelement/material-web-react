import { createComponent, event } from '../../utils/create-component.js';
import { MdFilledButton } from '@material/web/button/filled-button.js';

export const FilledButton = createComponent<MdFilledButton>({
  tagName: 'md-filled-button',
  elementClass: MdFilledButton,
  events: {
    onClick: event<MouseEvent>('click'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
