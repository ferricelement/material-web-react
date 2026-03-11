import { createComponent, event } from '../../utils/create-component.js';
import { MdMenuItem } from '@material/web/menu/menu-item.js';

export const MenuItem = createComponent<MdMenuItem>({
  tagName: 'md-menu-item',
  elementClass: MdMenuItem,
  events: {
    onClick: event<MouseEvent>('click'),
  },
});
