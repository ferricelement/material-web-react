import { createComponent, event } from '../../utils/create-component.js';
import { MdSpeedDial, MdSpeedDialAction } from './md-speed-dial.js';

export const SpeedDial = createComponent<MdSpeedDial>({
  tagName: 'md-speed-dial',
  elementClass: MdSpeedDial,
  events: {
    onOpen: event<CustomEvent>('open'),
    onClose: event<CustomEvent>('close'),
  },
});

export const SpeedDialAction = createComponent<MdSpeedDialAction>({
  tagName: 'md-speed-dial-action',
  elementClass: MdSpeedDialAction,
  events: {
    onActionClick: event<CustomEvent>('action-click'),
  },
});
