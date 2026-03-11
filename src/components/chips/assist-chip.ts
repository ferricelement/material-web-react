import { createComponent, event } from '../../utils/create-component.js';
import { MdAssistChip } from '@material/web/chips/assist-chip.js';

export const AssistChip = createComponent<MdAssistChip>({
  tagName: 'md-assist-chip',
  elementClass: MdAssistChip,
  events: {
    onClick: event<MouseEvent>('click'),
  },
});
