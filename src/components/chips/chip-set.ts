import { createComponent } from '../../utils/create-component.js';
import { MdChipSet } from '@material/web/chips/chip-set.js';

export const ChipSet = createComponent<MdChipSet>({
  tagName: 'md-chip-set',
  elementClass: MdChipSet,
});
