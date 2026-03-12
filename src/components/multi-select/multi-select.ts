import { createComponent, event } from '../../utils/create-component.js';
import { MdMultiSelect } from './md-multi-select.js';

export const MultiSelect = createComponent<MdMultiSelect>({
  tagName: 'md-multi-select',
  elementClass: MdMultiSelect,
  events: {
    onChange: event<CustomEvent>('change'),
  },
});
