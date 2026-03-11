import { createComponent } from '../../utils/create-component.js';
import { MdFocusRing } from '@material/web/focus/md-focus-ring.js';

export const FocusRing = createComponent<MdFocusRing>({
  tagName: 'md-focus-ring',
  elementClass: MdFocusRing,
  events: {},
});
