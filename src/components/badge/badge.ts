import { createComponent } from '../../utils/create-component.js';
import { MdBadge } from '@material/web/labs/badge/badge.js';

export const Badge = createComponent<MdBadge>({
  tagName: 'md-badge',
  elementClass: MdBadge,
});
