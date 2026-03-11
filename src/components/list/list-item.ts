import { createComponent, event } from '../../utils/create-component.js';
import { MdListItem } from '@material/web/list/list-item.js';

export const ListItem = createComponent<MdListItem>({
  tagName: 'md-list-item',
  elementClass: MdListItem,
  events: {
    onClick: event<MouseEvent>('click'),
  },
});
