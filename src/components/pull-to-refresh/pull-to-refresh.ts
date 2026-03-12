import { createComponent, event } from '../../utils/create-component.js';
import { MdPullToRefresh } from './md-pull-to-refresh.js';

export const PullToRefresh = createComponent<MdPullToRefresh>({
  tagName: 'md-pull-to-refresh',
  elementClass: MdPullToRefresh,
  events: {
    onRefresh: event<CustomEvent>('refresh'),
  },
});
