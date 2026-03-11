import { createComponent, event } from '../../utils/create-component.js';
import { MdFilledTextField } from '@material/web/textfield/filled-text-field.js';

export const FilledTextField = createComponent<MdFilledTextField>({
  tagName: 'md-filled-text-field',
  elementClass: MdFilledTextField,
  events: {
    onInput: event<InputEvent>('input'),
    onChange: event<Event>('change'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
