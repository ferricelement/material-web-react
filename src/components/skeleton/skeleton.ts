import { createComponent } from '../../utils/create-component.js';
import { MdSkeleton } from './md-skeleton.js';

export const Skeleton = createComponent<MdSkeleton>({
  tagName: 'md-skeleton',
  elementClass: MdSkeleton,
  events: {},
});
