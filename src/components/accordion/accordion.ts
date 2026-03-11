import { createComponent, event } from '../../utils/create-component.js';
import { MdAccordion, MdAccordionItem } from './md-accordion.js';

export const Accordion = createComponent<MdAccordion>({
  tagName: 'md-accordion',
  elementClass: MdAccordion,
  events: {},
});

export const AccordionItem = createComponent<MdAccordionItem>({
  tagName: 'md-accordion-item',
  elementClass: MdAccordionItem,
  events: {
    onAccordionItemToggle: event<CustomEvent>('accordion-item-toggle'),
  },
});
