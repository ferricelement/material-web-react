import { createComponent, event } from '../../utils/create-component.js';
import { MdOutlinedSelect } from '@material/web/select/outlined-select.js';

export const OutlinedSelect = createComponent<MdOutlinedSelect>({
  tagName: 'md-outlined-select',
  elementClass: MdOutlinedSelect,
  events: {
    onChange: event<Event>('change'),
    onInput: event<InputEvent>('input'),
    onOpening: event<Event>('opening'),
    onClosing: event<Event>('closing'),
  },
});
