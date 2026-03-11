import { createComponent, event } from '../../utils/create-component.js';
import { MdRadio } from '@material/web/radio/radio.js';

export const Radio = createComponent<MdRadio>({
  tagName: 'md-radio',
  elementClass: MdRadio,
  events: {
    onChange: event<Event>('change'),
    onInput: event<InputEvent>('input'),
  },
});
