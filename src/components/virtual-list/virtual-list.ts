import { createComponent, event } from '../../utils/create-component.js';
import { MdVirtualList } from './md-virtual-list.js';

export const VirtualList = createComponent<MdVirtualList>({
  tagName: 'md-virtual-list',
  elementClass: MdVirtualList,
  events: {
    onRangeChange: event<CustomEvent>('range-change'),
  },
});
