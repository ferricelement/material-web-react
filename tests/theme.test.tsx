import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../src/theme/index.js';
import { themeToStyleVars } from '../src/theme/tokens.js';

describe('themeToStyleVars', () => {
  it('maps theme keys to CSS custom properties', () => {
    const vars = themeToStyleVars({
      colorPrimary: '#006A6A',
      colorSecondary: '#4A6363',
    });

    expect(vars['--md-sys-color-primary']).toBe('#006A6A');
    expect(vars['--md-sys-color-secondary']).toBe('#4A6363');
  });

  it('skips undefined values', () => {
    const vars = themeToStyleVars({ colorPrimary: '#006A6A' });
    expect(Object.keys(vars)).toHaveLength(1);
  });
});

describe('ThemeProvider', () => {
  it('renders children', () => {
    render(
      <ThemeProvider theme={{ colorPrimary: '#006A6A' }}>
        <span>Hello</span>
      </ThemeProvider>,
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('applies CSS custom properties as inline styles', () => {
    const { container } = render(
      <ThemeProvider theme={{ colorPrimary: '#006A6A' }}>
        <span>Styled</span>
      </ThemeProvider>,
    );

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.getPropertyValue('--md-sys-color-primary')).toBe('#006A6A');
  });
});
