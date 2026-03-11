import { createComponent } from '../../utils/create-component.js';
import { MdIcon } from '@material/web/icon/icon.js';

export const Icon = createComponent<MdIcon>({
  tagName: 'md-icon',
  elementClass: MdIcon,
});
