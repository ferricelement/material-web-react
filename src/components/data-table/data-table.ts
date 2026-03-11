import { createComponent, event } from '../../utils/create-component.js';
import { MdDataTable } from './md-data-table.js';

export const DataTable = createComponent<MdDataTable>({
  tagName: 'md-data-table',
  elementClass: MdDataTable,
  events: {
    onDataTableSort: event<CustomEvent>('data-table-sort'),
    onDataTablePage: event<CustomEvent>('data-table-page'),
  },
});
