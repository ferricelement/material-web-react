import { createComponent, event } from '../../utils/create-component.js';
import { MdNavigationTab } from '@material/web/labs/navigationtab/navigation-tab.js';

export const NavigationTab = createComponent<MdNavigationTab>({
  tagName: 'md-navigation-tab',
  elementClass: MdNavigationTab,
  events: {
    onClick: event<MouseEvent>('click'),
  },
});
