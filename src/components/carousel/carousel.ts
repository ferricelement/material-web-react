import { createComponent, event } from '../../utils/create-component.js';
import { MdCarousel } from './md-carousel.js';

export const Carousel = createComponent<MdCarousel>({
  tagName: 'md-carousel',
  elementClass: MdCarousel,
  events: {
    onCarouselScroll: event<CustomEvent>('carousel-scroll'),
  },
});
