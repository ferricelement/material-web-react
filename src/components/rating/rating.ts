import { createComponent, event } from '../../utils/create-component.js';
import { MdRating } from './md-rating.js';

export const Rating = createComponent<MdRating>({
  tagName: 'md-rating',
  elementClass: MdRating,
  events: {
    onRatingChanged: event<CustomEvent>('rating-changed'),
  },
});
