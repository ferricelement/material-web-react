import { createComponent, event } from '../../utils/create-component.js';
import { MdMenu } from '@material/web/menu/menu.js';

export const Menu = createComponent<MdMenu>({
  tagName: 'md-menu',
  elementClass: MdMenu,
  events: {
    onOpening: event<Event>('opening'),
    onOpened: event<Event>('opened'),
    onClosing: event<Event>('closing'),
    onClosed: event<Event>('closed'),
  },
});
