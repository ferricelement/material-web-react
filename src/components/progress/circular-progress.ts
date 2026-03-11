import { createComponent } from '../../utils/create-component.js';
import { MdCircularProgress } from '@material/web/progress/circular-progress.js';

export const CircularProgress = createComponent<MdCircularProgress>({
  tagName: 'md-circular-progress',
  elementClass: MdCircularProgress,
  events: {},
});
