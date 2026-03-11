import { createComponent, event } from '../../utils/create-component.js';
import { MdOutlinedSegmentedButton } from '@material/web/labs/segmentedbutton/outlined-segmented-button.js';

export const OutlinedSegmentedButton = createComponent<MdOutlinedSegmentedButton>({
  tagName: 'md-outlined-segmented-button',
  elementClass: MdOutlinedSegmentedButton,
  events: {
    onClick: event<MouseEvent>('click'),
  },
});
