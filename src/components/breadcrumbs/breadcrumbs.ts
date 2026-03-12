import { createComponent } from '../../utils/create-component.js';
import { MdBreadcrumbs, MdBreadcrumbItem } from './md-breadcrumbs.js';

export const Breadcrumbs = createComponent<MdBreadcrumbs>({
  tagName: 'md-breadcrumbs',
  elementClass: MdBreadcrumbs,
  events: {},
});

export const BreadcrumbItem = createComponent<MdBreadcrumbItem>({
  tagName: 'md-breadcrumb-item',
  elementClass: MdBreadcrumbItem,
  events: {},
});
