import { createComponent, event } from '../../utils/create-component.js';
import { MdFilterChip } from '@material/web/chips/filter-chip.js';

export const FilterChip = createComponent<MdFilterChip>({
  tagName: 'md-filter-chip',
  elementClass: MdFilterChip,
  events: {
    onClick: event<MouseEvent>('click'),
    onRemove: event<Event>('remove'),
  },
});
