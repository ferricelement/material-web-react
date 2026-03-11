import { createComponent, event } from '../../utils/create-component.js';
import { MdSearchBar } from './md-search-bar.js';

export const SearchBar = createComponent<MdSearchBar>({
  tagName: 'md-search-bar',
  elementClass: MdSearchBar,
  events: {
    onSearchInput: event<CustomEvent>('search-input'),
    onSearchFocus: event<Event>('search-focus'),
    onSearchBlur: event<Event>('search-blur'),
  },
});
