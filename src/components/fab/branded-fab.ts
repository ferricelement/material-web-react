import { createComponent, event } from '../../utils/create-component.js';
import { MdBrandedFab } from '@material/web/fab/branded-fab.js';

export const BrandedFab = createComponent<MdBrandedFab>({
  tagName: 'md-branded-fab',
  elementClass: MdBrandedFab,
  events: {
    onClick: event<MouseEvent>('click'),
    onFocus: event<FocusEvent>('focus'),
    onBlur: event<FocusEvent>('blur'),
  },
});
