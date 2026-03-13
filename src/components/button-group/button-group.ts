import { createComponent, event } from '../../utils/create-component.js';
import { MdButtonGroup } from './md-button-group.js';

export const ButtonGroup = createComponent<MdButtonGroup>({
  tagName: 'md-button-group',
  elementClass: MdButtonGroup,
  events: {
    onSlotChange: event<CustomEvent>('slot-change'),
  },
});
