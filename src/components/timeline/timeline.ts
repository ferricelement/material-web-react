import { createComponent } from '../../utils/create-component.js';
import { MdTimeline, MdTimelineItem } from './md-timeline.js';

export const Timeline = createComponent<MdTimeline>({
  tagName: 'md-timeline',
  elementClass: MdTimeline,
  events: {},
});

export const TimelineItem = createComponent<MdTimelineItem>({
  tagName: 'md-timeline-item',
  elementClass: MdTimelineItem,
  events: {},
});
