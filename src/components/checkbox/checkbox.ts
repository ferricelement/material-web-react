import { createComponent, event } from '../../utils/create-component.js';
import { MdCheckbox } from '@material/web/checkbox/checkbox.js';

export const Checkbox = createComponent<MdCheckbox>({
  tagName: 'md-checkbox',
  elementClass: MdCheckbox,
  events: {
    onChange: event<Event>('change'),
    onInput: event<InputEvent>('input'),
  },
});
