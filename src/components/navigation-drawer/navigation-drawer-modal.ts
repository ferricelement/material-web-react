import { createComponent, event } from '../../utils/create-component.js';
import { MdNavigationDrawerModal } from '@material/web/labs/navigationdrawer/navigation-drawer-modal.js';

export const NavigationDrawerModal = createComponent<MdNavigationDrawerModal>({
  tagName: 'md-navigation-drawer-modal',
  elementClass: MdNavigationDrawerModal,
  events: {
    onNavigationDrawerChanged: event<CustomEvent>('navigation-drawer-changed'),
  },
});
