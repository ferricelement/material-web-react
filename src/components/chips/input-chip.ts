import { createComponent, event } from '../../utils/create-component.js';
import { MdInputChip } from '@material/web/chips/input-chip.js';

export const InputChip = createComponent<MdInputChip>({
  tagName: 'md-input-chip',
  elementClass: MdInputChip,
  events: {
    onClick: event<MouseEvent>('click'),
    onRemove: event<Event>('remove'),
  },
});
