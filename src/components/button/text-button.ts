import { createComponent, event } from '../../utils/create-component.js';
import { MdTextButton } from '@material/web/button/text-button.js';

export const TextButton = createComponent<MdTextButton>({
  tagName: 'md-text-button',
  elementClass: MdTextButton,
  events: {
    onClick: event<MouseEvent>('click'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
