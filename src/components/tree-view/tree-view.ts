import { createComponent, event } from '../../utils/create-component.js';
import { MdTreeView } from './md-tree-view.js';
import { MdTreeItem } from './md-tree-view.js';

export const TreeView = createComponent<MdTreeView>({
  tagName: 'md-tree-view',
  elementClass: MdTreeView,
  events: {},
});

export const TreeItem = createComponent<MdTreeItem>({
  tagName: 'md-tree-item',
  elementClass: MdTreeItem,
  events: {
    onToggle: event<CustomEvent>('toggle'),
    onSelect: event<CustomEvent>('item-select'),
  },
});
