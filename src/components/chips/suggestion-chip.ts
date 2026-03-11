import { createComponent, event } from '../../utils/create-component.js';
import { MdSuggestionChip } from '@material/web/chips/suggestion-chip.js';

export const SuggestionChip = createComponent<MdSuggestionChip>({
  tagName: 'md-suggestion-chip',
  elementClass: MdSuggestionChip,
  events: {
    onClick: event<MouseEvent>('click'),
  },
});
