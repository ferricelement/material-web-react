import { createComponent, event } from '../../utils/create-component.js';
import { MdColorPicker } from './md-color-picker.js';

export const ColorPicker = createComponent<MdColorPicker>({
  tagName: 'md-color-picker',
  elementClass: MdColorPicker,
  events: {
    onChange: event<CustomEvent>('change'),
  },
});
