import { createComponent, event } from '../../utils/create-component.js';
import { MdChipInput } from './md-chip-input.js';

export const ChipInput = createComponent<MdChipInput>({
  tagName: 'md-chip-input',
  elementClass: MdChipInput,
  events: {
    onValuesChange: event<CustomEvent>('values-change'),
    onChipRemove: event<CustomEvent>('chip-remove'),
  },
});
