import { createComponent, event } from '../../utils/create-component.js';
import { MdSwipeActions, MdSwipeAction } from './md-swipe-actions.js';

export const SwipeActions = createComponent<MdSwipeActions>({
  tagName: 'md-swipe-actions',
  elementClass: MdSwipeActions,
  events: {
    onSwipeStart: event<CustomEvent>('swipe-start'),
    onSwipeEnd: event<CustomEvent>('swipe-end'),
  },
});

export const SwipeAction = createComponent<MdSwipeAction>({
  tagName: 'md-swipe-action',
  elementClass: MdSwipeAction,
  events: {
    onActionClick: event<CustomEvent>('action-click'),
  },
});
