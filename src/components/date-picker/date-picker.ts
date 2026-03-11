import { createComponent, event } from '../../utils/create-component.js';
import { MdDatePicker } from './md-date-picker.js';

export const DatePicker = createComponent<MdDatePicker>({
  tagName: 'md-date-picker',
  elementClass: MdDatePicker,
  events: {
    onDatePickerChanged: event<CustomEvent>('date-picker-changed'),
    onDatePickerValueChanged: event<CustomEvent>('date-picker-value-changed'),
  },
});
