import { createComponent, event } from '../../utils/create-component.js';
import { MdNavigationDrawerModalWrapper } from './md-navigation-drawer-modal-wrapper.js';

export const NavigationDrawerModal = createComponent<MdNavigationDrawerModalWrapper>({
  tagName: 'md-navigation-drawer-modal-wrapper',
  elementClass: MdNavigationDrawerModalWrapper,
  events: {
    onNavigationDrawerChanged: event<CustomEvent>('navigation-drawer-changed'),
  },
});
