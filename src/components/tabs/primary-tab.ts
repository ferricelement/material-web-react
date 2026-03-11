import { createComponent, event } from '../../utils/create-component.js';
import { MdPrimaryTab } from '@material/web/tabs/primary-tab.js';

export const PrimaryTab = createComponent<MdPrimaryTab>({
  tagName: 'md-primary-tab',
  elementClass: MdPrimaryTab,
  events: {
    onClick: event<MouseEvent>('click'),
  },
});
