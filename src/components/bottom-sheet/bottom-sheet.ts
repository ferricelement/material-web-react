import { createComponent, event } from '../../utils/create-component.js';
import { MdBottomSheet } from './md-bottom-sheet.js';

export const BottomSheet = createComponent<MdBottomSheet>({
  tagName: 'md-bottom-sheet',
  elementClass: MdBottomSheet,
  events: {
    onBottomSheetChanged: event<CustomEvent>('bottom-sheet-changed'),
  },
});
