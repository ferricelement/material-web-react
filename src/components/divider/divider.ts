import { createComponent } from '../../utils/create-component.js';
import { MdDivider } from '@material/web/divider/divider.js';

export const Divider = createComponent<MdDivider>({
  tagName: 'md-divider',
  elementClass: MdDivider,
  events: {},
});
