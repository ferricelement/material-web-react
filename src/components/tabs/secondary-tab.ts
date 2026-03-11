import { createComponent, event } from '../../utils/create-component.js';
import { MdSecondaryTab } from '@material/web/tabs/secondary-tab.js';

export const SecondaryTab = createComponent<MdSecondaryTab>({
  tagName: 'md-secondary-tab',
  elementClass: MdSecondaryTab,
  events: {
    onClick: event<MouseEvent>('click'),
  },
});
