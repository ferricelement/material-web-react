import { createComponent } from '../../utils/create-component.js';
import { MdTooltip } from './md-tooltip.js';

export const Tooltip = createComponent<MdTooltip>({
  tagName: 'md-tooltip',
  elementClass: MdTooltip,
});
