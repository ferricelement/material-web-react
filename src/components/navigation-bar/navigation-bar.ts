import { createComponent, event } from '../../utils/create-component.js';
import { MdNavigationBar } from '@material/web/labs/navigationbar/navigation-bar.js';

export const NavigationBar = createComponent<MdNavigationBar>({
  tagName: 'md-navigation-bar',
  elementClass: MdNavigationBar,
  events: {
    onNavigationBarActivated: event<CustomEvent>('navigation-bar-activated'),
  },
});
