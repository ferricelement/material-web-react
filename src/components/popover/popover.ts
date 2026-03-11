import { createComponent, event } from '../../utils/create-component.js';
import { MdPopover } from './md-popover.js';

export const Popover = createComponent<MdPopover>({
  tagName: 'md-popover',
  elementClass: MdPopover,
  events: {
    onPopoverChanged: event<CustomEvent>('popover-changed'),
  },
});
