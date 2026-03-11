import { createComponent, event } from '../../utils/create-component.js';
import { MdOutlinedSegmentedButtonSet } from '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';

export const OutlinedSegmentedButtonSet = createComponent<MdOutlinedSegmentedButtonSet>({
  tagName: 'md-outlined-segmented-button-set',
  elementClass: MdOutlinedSegmentedButtonSet,
  events: {
    onSelectionChange: event<CustomEvent>('segmented-button-set-selection'),
  },
});
