import { createComponent } from '../../utils/create-component.js';
import { MdAvatar } from './md-avatar.js';

export const Avatar = createComponent<MdAvatar>({
  tagName: 'md-avatar',
  elementClass: MdAvatar,
  events: {},
});
