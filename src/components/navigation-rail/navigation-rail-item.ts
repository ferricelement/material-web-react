import { createComponent, event } from '../../utils/create-component.js';
import { MdNavigationRailItem } from './md-navigation-rail-item.js';

export const NavigationRailItem = createComponent<MdNavigationRailItem>({
  tagName: 'md-navigation-rail-item',
  elementClass: MdNavigationRailItem,
  events: {
    onClick: event<MouseEvent>('click'),
    onNavigationRailItemInteraction: event<CustomEvent>('navigation-rail-item-interaction'),
  },
});
