import { createComponent, event } from '../../utils/create-component.js';
import { MdParallaxHeader } from './md-parallax-header.js';
import { MdHeroTransition } from './md-parallax-header.js';

export const ParallaxHeader = createComponent<MdParallaxHeader>({
  tagName: 'md-parallax-header',
  elementClass: MdParallaxHeader,
  events: {
    onScrollProgress: event<CustomEvent<{ progress: number }>>('scroll-progress'),
  },
});

export const HeroTransition = createComponent<MdHeroTransition>({
  tagName: 'md-hero-transition',
  elementClass: MdHeroTransition,
  events: {
    onScrollProgress: event<CustomEvent<{ progress: number }>>('scroll-progress'),
  },
});
