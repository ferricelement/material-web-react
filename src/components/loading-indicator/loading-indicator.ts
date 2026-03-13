import { createComponent } from '../../utils/create-component.js';
import { MdLoadingIndicator } from './md-loading-indicator.js';

export const LoadingIndicator = createComponent<MdLoadingIndicator>({
  tagName: 'md-loading-indicator',
  elementClass: MdLoadingIndicator,
});
