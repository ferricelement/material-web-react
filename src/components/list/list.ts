import { createComponent } from '../../utils/create-component.js';
import { MdList } from '@material/web/list/list.js';

export const List = createComponent<MdList>({
  tagName: 'md-list',
  elementClass: MdList,
  events: {},
});
