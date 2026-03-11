import { createComponent, event } from '../../utils/create-component.js';
import { MdNavigationDrawer } from '@material/web/labs/navigationdrawer/navigation-drawer.js';

export const NavigationDrawer = createComponent<MdNavigationDrawer>({
  tagName: 'md-navigation-drawer',
  elementClass: MdNavigationDrawer,
  events: {
    onNavigationDrawerChanged: event<CustomEvent>('navigation-drawer-changed'),
  },
});
