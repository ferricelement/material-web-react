import { createComponent } from '../../utils/create-component.js';
import { MdRipple } from '@material/web/ripple/ripple.js';

export const Ripple = createComponent<MdRipple>({
  tagName: 'md-ripple',
  elementClass: MdRipple,
  events: {},
});
