import { createComponent, event } from '../../utils/create-component.js';
import { MdTimePicker } from './md-time-picker.js';

export const TimePicker = createComponent<MdTimePicker>({
  tagName: 'md-time-picker',
  elementClass: MdTimePicker,
  events: {
    onTimePickerChanged: event<CustomEvent>('time-picker-changed'),
    onTimePickerValueChanged: event<CustomEvent>('time-picker-value-changed'),
  },
});
