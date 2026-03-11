import { createComponent } from '../../utils/create-component.js';
import { MdTopAppBar } from './md-top-app-bar.js';

export const TopAppBar = createComponent<MdTopAppBar>({
  tagName: 'md-top-app-bar',
  elementClass: MdTopAppBar,
});
