import React, { useState, useRef } from 'react';

import { ThemeProvider } from '../src/theme/index.js';
import '../src/theme/baseline.css';

import {
  FilledButton,
  OutlinedButton,
  TextButton,
  ElevatedButton,
  TonalButton,
} from '../src/components/button/index.js';
import {
  FilledTextField,
  OutlinedTextField,
} from '../src/components/text-field/index.js';
import { Checkbox } from '../src/components/checkbox/index.js';
import { Radio } from '../src/components/radio/index.js';
import { Switch } from '../src/components/switch/index.js';
import {
  FilledSelect,
  OutlinedSelect,
  SelectOption,
} from '../src/components/select/index.js';
import { Dialog } from '../src/components/dialog/index.js';
import { Icon } from '../src/components/icon/index.js';
import {
  ChipSet,
  AssistChip,
  FilterChip,
  InputChip,
  SuggestionChip,
} from '../src/components/chips/index.js';
import { Fab, BrandedFab } from '../src/components/fab/index.js';
import {
  IconButton,
  FilledIconButton,
  FilledTonalIconButton,
  OutlinedIconButton,
} from '../src/components/icon-button/index.js';
import { Card } from '../src/components/card/index.js';
import { Snackbar } from '../src/components/snackbar/index.js';
import { Menu, MenuItem } from '../src/components/menu/index.js';
import { Tabs, PrimaryTab, SecondaryTab } from '../src/components/tabs/index.js';
import { CircularProgress, LinearProgress } from '../src/components/progress/index.js';
import { List, ListItem } from '../src/components/list/index.js';
import { Slider } from '../src/components/slider/index.js';
import { Divider } from '../src/components/divider/index.js';
import { Badge } from '../src/components/badge/index.js';
import { OutlinedSegmentedButton, OutlinedSegmentedButtonSet } from '../src/components/segmented-button/index.js';

import type { MdDialog } from '@material/web/dialog/dialog.js';

const styles = {
  page: {
    fontFamily: "'Roboto', sans-serif",
    maxWidth: 960,
    margin: '0 auto',
    padding: '32px 24px',
    color: 'var(--md-sys-color-on-surface)',
    background: 'var(--md-sys-color-surface)',
    minHeight: '100vh',
  } as React.CSSProperties,
  header: {
    marginBottom: 48,
  } as React.CSSProperties,
  title: {
    fontSize: 32,
    fontWeight: 500,
    marginBottom: 8,
  } as React.CSSProperties,
  subtitle: {
    fontSize: 16,
    color: 'var(--md-sys-color-on-surface-variant)',
  } as React.CSSProperties,
  section: {
    marginBottom: 48,
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 22,
    fontWeight: 500,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: '1px solid var(--md-sys-color-outline-variant)',
  } as React.CSSProperties,
  row: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 12,
    alignItems: 'center',
    marginBottom: 16,
  } as React.CSSProperties,
  label: {
    fontSize: 14,
    color: 'var(--md-sys-color-on-surface-variant)',
    marginBottom: 8,
    display: 'block',
  } as React.CSSProperties,
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16,
  } as React.CSSProperties,
  themeControls: {
    display: 'flex',
    gap: 8,
    marginBottom: 32,
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
};

const THEME_PRESETS = {
  purple: {
    label: 'Purple (Default)',
    theme: {},
  },
  teal: {
    label: 'Teal',
    theme: {
      colorPrimary: '#006A6A',
      colorOnPrimary: '#FFFFFF',
      colorPrimaryContainer: '#9CF1F0',
      colorOnPrimaryContainer: '#002020',
      colorSecondary: '#4A6363',
      colorOnSecondary: '#FFFFFF',
    },
  },
  rose: {
    label: 'Rose',
    theme: {
      colorPrimary: '#9A4057',
      colorOnPrimary: '#FFFFFF',
      colorPrimaryContainer: '#FFD9E0',
      colorOnPrimaryContainer: '#3F0017',
      colorSecondary: '#75565C',
      colorOnSecondary: '#FFFFFF',
    },
  },
  blue: {
    label: 'Blue',
    theme: {
      colorPrimary: '#005AC1',
      colorOnPrimary: '#FFFFFF',
      colorPrimaryContainer: '#D8E2FF',
      colorOnPrimaryContainer: '#001A41',
      colorSecondary: '#575E71',
      colorOnSecondary: '#FFFFFF',
    },
  },
};

export function App() {
  const [themeKey, setThemeKey] = useState<keyof typeof THEME_PRESETS>('purple');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [textValue, setTextValue] = useState('');
  const dialogRef = useRef<MdDialog>(null);

  const activeTheme = THEME_PRESETS[themeKey].theme;

  return (
    <ThemeProvider theme={activeTheme}>
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.title}>React Material Web</div>
          <div style={styles.subtitle}>
            Material Design 3 component library for React — wrapping @material/web
          </div>
        </div>

        {/* Theme Switcher */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Theme</div>
          <div style={styles.themeControls}>
            {Object.entries(THEME_PRESETS).map(([key, preset]) => (
              <FilledButton
                key={key}
                onClick={() => setThemeKey(key as keyof typeof THEME_PRESETS)}
                disabled={themeKey === key}
              >
                {preset.label}
              </FilledButton>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Buttons</div>
          <span style={styles.label}>Variants</span>
          <div style={styles.row}>
            <FilledButton onClick={() => console.log('Filled clicked')}>Filled</FilledButton>
            <OutlinedButton>Outlined</OutlinedButton>
            <TextButton>Text</TextButton>
            <ElevatedButton>Elevated</ElevatedButton>
            <TonalButton>Tonal</TonalButton>
          </div>
          <span style={styles.label}>With Icons</span>
          <div style={styles.row}>
            <FilledButton>
              <Icon slot="icon">send</Icon>
              Send
            </FilledButton>
            <OutlinedButton>
              <Icon slot="icon">add</Icon>
              Add
            </OutlinedButton>
            <TonalButton>
              <Icon slot="icon">favorite</Icon>
              Favorite
            </TonalButton>
          </div>
          <span style={styles.label}>Disabled</span>
          <div style={styles.row}>
            <FilledButton disabled>Disabled</FilledButton>
            <OutlinedButton disabled>Disabled</OutlinedButton>
          </div>
        </div>

        {/* Chips */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Chips</div>
          <span style={styles.label}>Assist</span>
          <ChipSet>
            <AssistChip label="Assist"><Icon slot="icon">event</Icon></AssistChip>
            <AssistChip label="Directions"><Icon slot="icon">directions</Icon></AssistChip>
          </ChipSet>
          <span style={styles.label}>Filter</span>
          <ChipSet>
            <FilterChip label="Extra soft" elevated />
            <FilterChip label="Soft" selected />
            <FilterChip label="Medium" />
            <FilterChip label="Hard" />
          </ChipSet>
          <span style={styles.label}>Input</span>
          <ChipSet>
            <InputChip label="Apple" />
            <InputChip label="Banana" />
            <InputChip label="Cherry" removable />
          </ChipSet>
          <span style={styles.label}>Suggestion</span>
          <ChipSet>
            <SuggestionChip label="Price: Low to High" />
            <SuggestionChip label="Most Recent" />
            <SuggestionChip label="Top Rated" />
          </ChipSet>
        </div>

        {/* FAB */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Floating Action Button</div>
          <div style={styles.row}>
            <Fab label="Create"><Icon slot="icon">add</Icon></Fab>
            <Fab><Icon slot="icon">edit</Icon></Fab>
            <Fab size="small"><Icon slot="icon">add</Icon></Fab>
            <Fab size="large"><Icon slot="icon">add</Icon></Fab>
          </div>
        </div>

        {/* Icon Buttons */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Icon Buttons</div>
          <span style={styles.label}>Variants</span>
          <div style={styles.row}>
            <IconButton><Icon>settings</Icon></IconButton>
            <FilledIconButton><Icon>edit</Icon></FilledIconButton>
            <FilledTonalIconButton><Icon>favorite</Icon></FilledTonalIconButton>
            <OutlinedIconButton><Icon>bookmark</Icon></OutlinedIconButton>
          </div>
          <span style={styles.label}>Toggle (selected)</span>
          <div style={styles.row}>
            <IconButton toggle selected><Icon>star</Icon></IconButton>
            <FilledIconButton toggle selected><Icon>favorite</Icon></FilledIconButton>
            <FilledTonalIconButton toggle selected><Icon>bookmark</Icon></FilledTonalIconButton>
            <OutlinedIconButton toggle selected><Icon>thumb_up</Icon></OutlinedIconButton>
          </div>
          <span style={styles.label}>Disabled</span>
          <div style={styles.row}>
            <IconButton disabled><Icon>delete</Icon></IconButton>
            <FilledIconButton disabled><Icon>delete</Icon></FilledIconButton>
          </div>
        </div>

        {/* Text Fields */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Text Fields</div>
          <div style={styles.row}>
            <FilledTextField
              label="Filled Text Field"
              value={textValue}
              onInput={(e: any) => setTextValue(e.target.value)}
            />
            <OutlinedTextField label="Outlined Text Field" placeholder="Type here..." />
          </div>
          <div style={styles.row}>
            <FilledTextField label="With supporting text" supportingText="Helper text goes here" />
            <OutlinedTextField label="Error state" error errorText="This field is required" />
          </div>
          <div style={styles.row}>
            <OutlinedTextField label="Disabled" disabled value="Cannot edit" />
            <FilledTextField label="Password" type="password" />
          </div>
        </div>

        {/* Checkbox, Radio, Switch */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Selection Controls</div>

          <span style={styles.label}>Checkbox</span>
          <div style={styles.row}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox
                checked={checkboxChecked}
                onChange={() => setCheckboxChecked(!checkboxChecked)}
              />
              Accept terms
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox checked indeterminate />
              Indeterminate
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Checkbox disabled />
              Disabled
            </label>
          </div>

          <span style={styles.label}>Radio</span>
          <div style={styles.row}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio name="group1" value="a" checked />
              Option A
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio name="group1" value="b" />
              Option B
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio name="group1" value="c" />
              Option C
            </label>
          </div>

          <span style={styles.label}>Switch</span>
          <div style={styles.row}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Switch
                selected={switchChecked}
                onChange={() => setSwitchChecked(!switchChecked)}
              />
              {switchChecked ? 'On' : 'Off'}
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Switch disabled />
              Disabled
            </label>
          </div>
        </div>

        {/* Select */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Select</div>
          <div style={styles.row}>
            <FilledSelect label="Filled Select">
              <SelectOption value="1">Option 1</SelectOption>
              <SelectOption value="2">Option 2</SelectOption>
              <SelectOption value="3">Option 3</SelectOption>
            </FilledSelect>
            <OutlinedSelect label="Outlined Select">
              <SelectOption value="a">Alpha</SelectOption>
              <SelectOption value="b">Beta</SelectOption>
              <SelectOption value="c">Gamma</SelectOption>
            </OutlinedSelect>
          </div>
        </div>

        {/* Icon */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Icons</div>
          <div style={styles.row}>
            <Icon>home</Icon>
            <Icon>settings</Icon>
            <Icon>search</Icon>
            <Icon>favorite</Icon>
            <Icon>delete</Icon>
            <Icon>edit</Icon>
            <Icon>share</Icon>
            <Icon>cloud</Icon>
            <Icon>star</Icon>
            <Icon>check_circle</Icon>
          </div>
        </div>

        {/* Card */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Cards</div>
          <div style={styles.cardGrid}>
            <Card variant="elevated">
              <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Elevated Card</div>
              <div style={{ fontSize: 14, color: 'var(--md-sys-color-on-surface-variant)' }}>
                This card uses elevation for depth and visual hierarchy.
              </div>
            </Card>
            <Card variant="filled">
              <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Filled Card</div>
              <div style={{ fontSize: 14, color: 'var(--md-sys-color-on-surface-variant)' }}>
                A filled card with a subtle background color from the surface container.
              </div>
            </Card>
            <Card variant="outlined">
              <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Outlined Card</div>
              <div style={{ fontSize: 14, color: 'var(--md-sys-color-on-surface-variant)' }}>
                An outlined card with a visible border and flat appearance.
              </div>
            </Card>
          </div>
        </div>

        {/* Dialog */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Dialog</div>
          <div style={styles.row}>
            <FilledButton onClick={() => {
              setDialogOpen(true);
              dialogRef.current?.show();
            }}>
              Open Dialog
            </FilledButton>
          </div>
          <Dialog
            ref={dialogRef}
            onClose={() => setDialogOpen(false)}
          >
            <div slot="headline">Dialog Title</div>
            <div slot="content">
              This is a Material Design 3 dialog. It supports headlines, content,
              and action buttons via slots.
            </div>
            <div slot="actions">
              <TextButton onClick={() => dialogRef.current?.close()}>
                Cancel
              </TextButton>
              <FilledButton onClick={() => dialogRef.current?.close()}>
                Confirm
              </FilledButton>
            </div>
          </Dialog>
        </div>

        {/* Divider */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Divider</div>
          <p style={{ margin: '8px 0' }}>Content above the divider</p>
          <Divider />
          <p style={{ margin: '8px 0' }}>Content below the divider</p>
        </div>

        {/* Slider */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Slider</div>
          <span style={styles.label}>Basic Slider</span>
          <Slider value={50} onChange={(e: any) => console.log('Slider changed', e.target.value)} />
          <span style={styles.label}>Range Slider</span>
          <Slider range valueStart={25} valueEnd={75} />
        </div>

        {/* List */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>List</div>
          <List style={{ maxWidth: 360, border: '1px solid var(--md-sys-color-outline-variant)', borderRadius: 12 }}>
            <ListItem>
              <Icon slot="start">inbox</Icon>
              <div slot="headline">Inbox</div>
              <div slot="supporting-text">5 new messages</div>
            </ListItem>
            <ListItem>
              <Icon slot="start">send</Icon>
              <div slot="headline">Sent</div>
            </ListItem>
            <ListItem>
              <Icon slot="start">drafts</Icon>
              <div slot="headline">Drafts</div>
              <div slot="supporting-text">2 unsaved drafts</div>
            </ListItem>
            <ListItem>
              <Icon slot="start">delete</Icon>
              <div slot="headline">Trash</div>
            </ListItem>
          </List>
        </div>

        {/* Progress */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Progress</div>
          <span style={styles.label}>Circular</span>
          <div style={styles.row}>
            <CircularProgress indeterminate />
            <CircularProgress value={0.7} />
          </div>
          <span style={styles.label}>Linear</span>
          <div style={styles.row}>
            <LinearProgress indeterminate style={{ width: '100%' }} />
          </div>
          <div style={styles.row}>
            <LinearProgress value={0.7} style={{ width: '100%' }} />
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Tabs</div>
          <span style={styles.label}>Primary Tabs</span>
          <Tabs onChange={(e: any) => console.log('Tab changed', e)}>
            <PrimaryTab>
              <Icon slot="icon">flight</Icon>
              Flights
            </PrimaryTab>
            <PrimaryTab>
              <Icon slot="icon">hotel</Icon>
              Hotels
            </PrimaryTab>
            <PrimaryTab>
              <Icon slot="icon">explore</Icon>
              Explore
            </PrimaryTab>
          </Tabs>
          <span style={{ ...styles.label, marginTop: 16 }}>Secondary Tabs</span>
          <Tabs>
            <SecondaryTab>Overview</SecondaryTab>
            <SecondaryTab>Details</SecondaryTab>
            <SecondaryTab>Reviews</SecondaryTab>
          </Tabs>
        </div>

        {/* Menu */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Menu</div>
          <div style={{ ...styles.row, position: 'relative' }}>
            <FilledButton id="menu-anchor" onClick={() => setMenuOpen(!menuOpen)}>
              Open Menu
            </FilledButton>
            <Menu anchor="menu-anchor" open={menuOpen} onClosed={() => setMenuOpen(false)}>
              <MenuItem onClick={() => console.log('Cut')}>
                <div slot="headline">Cut</div>
              </MenuItem>
              <MenuItem onClick={() => console.log('Copy')}>
                <div slot="headline">Copy</div>
              </MenuItem>
              <MenuItem onClick={() => console.log('Paste')}>
                <div slot="headline">Paste</div>
              </MenuItem>
            </Menu>
          </div>
        </div>

        {/* Badge */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Badge</div>
          <div style={styles.row}>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon style={{ fontSize: 32 }}>notifications</Icon>
              <Badge value="3" style={{ position: 'absolute', top: -4, right: -4 }} />
            </span>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon style={{ fontSize: 32 }}>mail</Icon>
              <Badge value="99+" style={{ position: 'absolute', top: -4, right: -4 }} />
            </span>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <Icon style={{ fontSize: 32 }}>chat</Icon>
              <Badge style={{ position: 'absolute', top: -4, right: -4 }} />
            </span>
          </div>
        </div>

        {/* Segmented Button */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Segmented Button</div>
          <span style={styles.label}>Single Select</span>
          <OutlinedSegmentedButtonSet onSelectionChange={(e: any) => console.log('Selection:', e.detail)}>
            <OutlinedSegmentedButton label="Day" selected />
            <OutlinedSegmentedButton label="Week" />
            <OutlinedSegmentedButton label="Month" />
            <OutlinedSegmentedButton label="Year" />
          </OutlinedSegmentedButtonSet>
          <span style={{ ...styles.label, marginTop: 16 }}>Multi Select</span>
          <OutlinedSegmentedButtonSet multiselect>
            <OutlinedSegmentedButton label="Bold">
              <Icon slot="icon">format_bold</Icon>
            </OutlinedSegmentedButton>
            <OutlinedSegmentedButton label="Italic">
              <Icon slot="icon">format_italic</Icon>
            </OutlinedSegmentedButton>
            <OutlinedSegmentedButton label="Underline">
              <Icon slot="icon">format_underlined</Icon>
            </OutlinedSegmentedButton>
          </OutlinedSegmentedButtonSet>
        </div>

        {/* Snackbar */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Snackbar</div>
          <div style={styles.row}>
            <FilledButton onClick={() => setSnackbarOpen(true)}>
              Show Snackbar
            </FilledButton>
          </div>
          <Snackbar
            open={snackbarOpen}
            message="This is a snackbar notification"
            onClose={() => setSnackbarOpen(false)}
          >
            <TextButton slot="action" onClick={() => setSnackbarOpen(false)}>
              Dismiss
            </TextButton>
          </Snackbar>
        </div>
      </div>
    </ThemeProvider>
  );
}
