import { createComponent, event } from '../../utils/create-component.js';
import { MdSelectOption } from '@material/web/select/select-option.js';

export const SelectOption = createComponent<MdSelectOption>({
  tagName: 'md-select-option',
  elementClass: MdSelectOption,
  events: {
    onClick: event<MouseEvent>('click'),
  },
});
