import { createComponent, event } from '../../utils/create-component.js';
import { MdSlider } from '@material/web/slider/slider.js';

export const Slider = createComponent<MdSlider>({
  tagName: 'md-slider',
  elementClass: MdSlider,
  events: {
    onChange: event<Event>('change'),
    onInput: event<Event>('input'),
  },
});
