import { createComponent, event } from '../../utils/create-component.js';
import { MdDateRangePicker } from './md-date-range-picker.js';

export const DateRangePicker = createComponent<MdDateRangePicker>({
  tagName: 'md-date-range-picker',
  elementClass: MdDateRangePicker,
  events: {
    onChange: event<CustomEvent>('change'),
  },
});
