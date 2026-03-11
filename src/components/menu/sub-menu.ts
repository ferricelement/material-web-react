import { createComponent } from '../../utils/create-component.js';
import { MdSubMenu } from '@material/web/menu/sub-menu.js';

export const SubMenu = createComponent<MdSubMenu>({
  tagName: 'md-sub-menu',
  elementClass: MdSubMenu,
  events: {},
});
