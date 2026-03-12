import { createComponent, event } from '../../utils/create-component.js';
import { MdFileUpload } from './md-file-upload.js';

export const FileUpload = createComponent<MdFileUpload>({
  tagName: 'md-file-upload',
  elementClass: MdFileUpload,
  events: {
    onFilesSelected: event<CustomEvent>('files-selected'),
    onFilesRejected: event<CustomEvent>('files-rejected'),
  },
});
