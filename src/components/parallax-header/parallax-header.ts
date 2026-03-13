import { createComponent, event } from '../../utils/create-component.js';
import { MdParallaxHeader } from './md-parallax-header.js';

export const ParallaxHeader = createComponent<MdParallaxHeader>({
  tagName: 'md-parallax-header',
  elementClass: MdParallaxHeader,
  events: {
    onScrollProgress: event<CustomEvent<{ progress: number }>>('scroll-progress'),
  },
});
