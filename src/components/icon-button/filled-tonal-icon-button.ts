import { createComponent, event } from '../../utils/create-component.js';
import { MdFilledTonalIconButton } from '@material/web/iconbutton/filled-tonal-icon-button.js';

export const FilledTonalIconButton = createComponent<MdFilledTonalIconButton>({
  tagName: 'md-filled-tonal-icon-button',
  elementClass: MdFilledTonalIconButton,
  events: {
    onClick: event<MouseEvent>('click'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
