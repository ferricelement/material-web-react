import { createComponent, event } from '../../utils/create-component.js';
import { MdCard } from './md-card.js';

export const Card = createComponent<MdCard>({
  tagName: 'md-card',
  elementClass: MdCard,
  events: {
    onClick: event<MouseEvent>('click'),
  },
});
