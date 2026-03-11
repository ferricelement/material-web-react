import { createComponent, event } from '../../utils/create-component.js';
import { MdOutlinedTextField } from '@material/web/textfield/outlined-text-field.js';

export const OutlinedTextField = createComponent<MdOutlinedTextField>({
  tagName: 'md-outlined-text-field',
  elementClass: MdOutlinedTextField,
  events: {
    onInput: event<InputEvent>('input'),
    onChange: event<Event>('change'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
