import { createComponent, event } from '../../utils/create-component.js';
import { MdSwitch } from '@material/web/switch/switch.js';

export const Switch = createComponent<MdSwitch>({
  tagName: 'md-switch',
  elementClass: MdSwitch,
  events: {
    onChange: event<Event>('change'),
    onInput: event<InputEvent>('input'),
  },
});
