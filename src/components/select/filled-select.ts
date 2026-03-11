import { createComponent, event } from '../../utils/create-component.js';
import { MdFilledSelect } from '@material/web/select/filled-select.js';

export const FilledSelect = createComponent<MdFilledSelect>({
  tagName: 'md-filled-select',
  elementClass: MdFilledSelect,
  events: {
    onChange: event<Event>('change'),
    onInput: event<InputEvent>('input'),
    onOpening: event<Event>('opening'),
    onClosing: event<Event>('closing'),
  },
});
