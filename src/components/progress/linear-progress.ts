import { createComponent } from '../../utils/create-component.js';
import { MdLinearProgress } from '@material/web/progress/linear-progress.js';

export const LinearProgress = createComponent<MdLinearProgress>({
  tagName: 'md-linear-progress',
  elementClass: MdLinearProgress,
  events: {},
});
