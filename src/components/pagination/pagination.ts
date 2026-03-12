import { createComponent, event } from '../../utils/create-component.js';
import { MdPagination } from './md-pagination.js';

export const Pagination = createComponent<MdPagination>({
  tagName: 'md-pagination',
  elementClass: MdPagination,
  events: {
    onPageChange: event<CustomEvent>('page-change'),
  },
});
