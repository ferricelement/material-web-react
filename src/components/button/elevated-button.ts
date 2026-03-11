import { createComponent, event } from '../../utils/create-component.js';
import { MdElevatedButton } from '@material/web/button/elevated-button.js';

export const ElevatedButton = createComponent<MdElevatedButton>({
  tagName: 'md-elevated-button',
  elementClass: MdElevatedButton,
  events: {
    onClick: event<MouseEvent>('click'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
