import { createComponent, event } from '../../utils/create-component.js';
import { MdAutocomplete } from './md-autocomplete.js';

export const Autocomplete = createComponent<MdAutocomplete>({
  tagName: 'md-autocomplete',
  elementClass: MdAutocomplete,
  events: {
    onAutocompleteSelect: event<CustomEvent>('autocomplete-select'),
  },
});
