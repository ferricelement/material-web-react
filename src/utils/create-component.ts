import React from 'react';
import { createComponent as litCreateComponent } from '@lit/react';
import type { EventName } from '@lit/react';

export type { EventName };

type CreateComponentOptions<E extends HTMLElement> = Omit<
  Parameters<typeof litCreateComponent<E>>[0],
  'react'
>;

export function createComponent<E extends HTMLElement>(
  options: CreateComponentOptions<E>,
) {
  return litCreateComponent({
    ...options,
    react: React,
  });
}

/**
 * Helper to type event names for createComponent's events map.
 * Usage: `events: { onClick: event<MouseEvent>('click') }`
 */
export function event<T extends Event>(name: string): EventName<T> {
  return name as EventName<T>;
}
