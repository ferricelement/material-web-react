import { createComponent, event } from '../../utils/create-component.js';
import { MdFilledTonalButton } from '@material/web/button/filled-tonal-button.js';

export const TonalButton = createComponent<MdFilledTonalButton>({
  tagName: 'md-filled-tonal-button',
  elementClass: MdFilledTonalButton,
  events: {
    onClick: event<MouseEvent>('click'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
