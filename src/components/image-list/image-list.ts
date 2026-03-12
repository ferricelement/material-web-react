import { createComponent } from '../../utils/create-component.js';
import { MdImageList } from './md-image-list.js';
import { MdImageListItem } from './md-image-list.js';

export const ImageList = createComponent<MdImageList>({
  tagName: 'md-image-list',
  elementClass: MdImageList,
});

export const ImageListItem = createComponent<MdImageListItem>({
  tagName: 'md-image-list-item',
  elementClass: MdImageListItem,
});
