import { createComponent, event } from '../../utils/create-component.js';
import { MdTabs } from '@material/web/tabs/tabs.js';

export const Tabs = createComponent<MdTabs>({
  tagName: 'md-tabs',
  elementClass: MdTabs,
  events: {
    onChange: event<Event>('change'),
  },
});
