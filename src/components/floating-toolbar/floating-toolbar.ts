import { createComponent, event } from '../../utils/create-component.js';
import {
  MdFloatingToolbar,
  MdFloatingToolbarItem,
  MdFloatingToolbarDivider,
} from './md-floating-toolbar.js';

export const FloatingToolbar = createComponent<MdFloatingToolbar>({
  tagName: 'md-floating-toolbar',
  elementClass: MdFloatingToolbar,
  events: {
    onOpen: event<CustomEvent>('open'),
    onClose: event<CustomEvent>('close'),
  },
});

export const FloatingToolbarItem = createComponent<MdFloatingToolbarItem>({
  tagName: 'md-floating-toolbar-item',
  elementClass: MdFloatingToolbarItem,
  events: {
    onItemClick: event<CustomEvent>('item-click'),
  },
});

export const FloatingToolbarDivider = createComponent<MdFloatingToolbarDivider>(
  {
    tagName: 'md-floating-toolbar-divider',
    elementClass: MdFloatingToolbarDivider,
  },
);
