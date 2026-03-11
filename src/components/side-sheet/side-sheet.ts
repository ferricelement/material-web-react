import { createComponent, event } from '../../utils/create-component.js';
import { MdSideSheet } from './md-side-sheet.js';

export const SideSheet = createComponent<MdSideSheet>({
  tagName: 'md-side-sheet',
  elementClass: MdSideSheet,
  events: {
    onSideSheetChanged: event<CustomEvent>('side-sheet-changed'),
  },
});
