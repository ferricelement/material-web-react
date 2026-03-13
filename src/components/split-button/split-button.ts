import { createComponent, event } from '../../utils/create-component.js';
import { MdSplitButton } from './md-split-button.js';

export const SplitButton = createComponent<MdSplitButton>({
  tagName: 'md-split-button',
  elementClass: MdSplitButton,
  events: {
    onActionClick: event<CustomEvent>('action-click'),
    onTrailingClick: event<CustomEvent>('trailing-click'),
    onToggleChange: event<CustomEvent<{ checked: boolean }>>('toggle-change'),
  },
});
