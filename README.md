# react-material-web

React components wrapping Google's [Material Design 3](https://m3.material.io/) web components (`@material/web`) with additional custom components built on [Lit](https://lit.dev/).

## Installation

```bash
npm install react-material-web
```

## Quick Start

```tsx
import { FilledButton, Icon } from 'react-material-web';
import 'react-material-web/theme/baseline.css';

function App() {
  return (
    <FilledButton onClick={() => console.log('clicked')}>
      <Icon slot="icon">send</Icon>
      Send
    </FilledButton>
  );
}
```

## Theming

Apply a custom MD3 theme using `ThemeProvider`:

```tsx
import { ThemeProvider } from 'react-material-web';
import 'react-material-web/theme/baseline.css';

const theme = {
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  // ...MD3 color tokens
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* your app */}
    </ThemeProvider>
  );
}
```

## Components

### Core (wrapping @material/web)

| Component | Import |
|---|---|
| Button (Filled, Outlined, Text, Elevated, Tonal) | `react-material-web/button` |
| FAB / Branded FAB | `react-material-web/fab` |
| Icon Button (Standard, Filled, Tonal, Outlined) | `react-material-web/icon-button` |
| Icon | `react-material-web/icon` |
| Checkbox | `react-material-web/checkbox` |
| Radio | `react-material-web/radio` |
| Switch | `react-material-web/switch` |
| Slider | `react-material-web/slider` |
| Text Field (Filled, Outlined) | `react-material-web/text-field` |
| Select (Filled, Outlined) | `react-material-web/select` |
| Chips (Assist, Filter, Input, Suggestion) | `react-material-web/chips` |
| Dialog | `react-material-web/dialog` |
| Menu / MenuItem / SubMenu | `react-material-web/menu` |
| Tabs (Primary, Secondary) | `react-material-web/tabs` |
| List / ListItem | `react-material-web/list` |
| Progress (Circular, Linear) | `react-material-web/progress` |
| Divider | `react-material-web/divider` |
| Badge | `react-material-web/badge` |
| Ripple | `react-material-web/ripple` |
| Elevation | `react-material-web/elevation` |
| Focus Ring | `react-material-web/focus-ring` |
| Segmented Button | `react-material-web/segmented-button` |

### Navigation & Layout

| Component | Import |
|---|---|
| Top App Bar | `react-material-web/top-app-bar` |
| Bottom App Bar | `react-material-web/bottom-app-bar` |
| Navigation Bar | `react-material-web/navigation-bar` |
| Navigation Rail | `react-material-web/navigation-rail` |
| Navigation Drawer | `react-material-web/navigation-drawer` |
| Bottom Sheet | `react-material-web/bottom-sheet` |
| Side Sheet | `react-material-web/side-sheet` |
| Carousel | `react-material-web/carousel` |

### Data & Input

| Component | Import |
|---|---|
| Data Table | `react-material-web/data-table` |
| Autocomplete | `react-material-web/autocomplete` |
| Search Bar | `react-material-web/search-bar` |
| Date Picker | `react-material-web/date-picker` |
| Date Range Picker | `react-material-web/date-range-picker` |
| Time Picker | `react-material-web/time-picker` |
| Color Picker | `react-material-web/color-picker` |
| Multi Select | `react-material-web/multi-select` |
| Chip Input | `react-material-web/chip-input` |
| File Upload | `react-material-web/file-upload` |
| Rating | `react-material-web/rating` |

### Feedback & Status

| Component | Import |
|---|---|
| Snackbar | `react-material-web/snackbar` |
| Tooltip | `react-material-web/tooltip` |
| Alert / Banner | `react-material-web/alert` |
| Skeleton | `react-material-web/skeleton` |
| Loading Indicator | `react-material-web/loading-indicator` |
| Popover | `react-material-web/popover` |

### Composite & Advanced

| Component | Import |
|---|---|
| Accordion | `react-material-web/accordion` |
| Stepper | `react-material-web/stepper` |
| Timeline | `react-material-web/timeline` |
| Breadcrumbs | `react-material-web/breadcrumbs` |
| Pagination | `react-material-web/pagination` |
| Avatar | `react-material-web/avatar` |
| Card | `react-material-web/card` |
| Image List | `react-material-web/image-list` |
| Tree View | `react-material-web/tree-view` |
| Virtual List | `react-material-web/virtual-list` |
| Speed Dial | `react-material-web/speed-dial` |
| Button Group | `react-material-web/button-group` |
| Split Button | `react-material-web/split-button` |
| Floating Toolbar | `react-material-web/floating-toolbar` |
| Swipe Actions | `react-material-web/swipe-actions` |
| Pull to Refresh | `react-material-web/pull-to-refresh` |
| Parallax Header | `react-material-web/parallax-header` |

## Tree-Shakeable

Import only what you need. Each component is a separate entry point:

```tsx
// Only bundles the button code
import { FilledButton } from 'react-material-web/button';
```

## Requirements

- React 18+
- Modern browser with Web Components support

## License

MIT
