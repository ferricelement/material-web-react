export const SNIPPETS: Record<string, string> = {
  theme: `import { ThemeProvider } from 'react-material-web';
import 'react-material-web/theme/baseline.css';

const theme = {
  colorPrimary: '#6750A4',
  colorOnPrimary: '#FFFFFF',
  colorPrimaryContainer: '#EADDFF',
};

<ThemeProvider theme={theme} colorScheme="light">
  <App />
</ThemeProvider>`,

  buttons: `import {
  FilledButton, OutlinedButton, TextButton,
  ElevatedButton, TonalButton,
} from 'react-material-web';
import { Icon } from 'react-material-web';

<FilledButton onClick={() => console.log('click')}>Filled</FilledButton>
<OutlinedButton>Outlined</OutlinedButton>
<TextButton>Text</TextButton>
<ElevatedButton>Elevated</ElevatedButton>
<TonalButton>Tonal</TonalButton>

{/* With icon */}
<FilledButton>
  <Icon slot="icon">send</Icon>
  Send
</FilledButton>`,

  dialog: `import { Dialog } from 'react-material-web';
import { FilledButton, TextButton } from 'react-material-web';
import { useRef } from 'react';

const dialogRef = useRef<MdDialog>(null);

<FilledButton onClick={() => dialogRef.current?.show()}>
  Open Dialog
</FilledButton>
<Dialog ref={dialogRef}>
  <div slot="headline">Dialog Title</div>
  <div slot="content">Dialog content goes here.</div>
  <div slot="actions">
    <TextButton onClick={() => dialogRef.current?.close()}>Cancel</TextButton>
    <FilledButton onClick={() => dialogRef.current?.close()}>Confirm</FilledButton>
  </div>
</Dialog>`,

  menu: `import { Menu, MenuItem } from 'react-material-web';
import { FilledButton } from 'react-material-web';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<div style={{ position: 'relative' }}>
  <FilledButton id="menu-anchor" onClick={() => setOpen(!open)}>
    Open Menu
  </FilledButton>
  <Menu open={open} anchor="menu-anchor" onClosed={() => setOpen(false)}>
    <MenuItem>Item 1</MenuItem>
    <MenuItem>Item 2</MenuItem>
    <MenuItem>Item 3</MenuItem>
  </Menu>
</div>`,

  tooltip: `import { Tooltip } from 'react-material-web';
import { IconButton, Icon } from 'react-material-web';

{/* Plain tooltip */}
<span
  style={{ position: 'relative', display: 'inline-flex' }}
  onMouseEnter={(e) => {
    const tip = e.currentTarget.querySelector('md-tooltip');
    if (tip) tip.open = true;
  }}
  onMouseLeave={(e) => {
    const tip = e.currentTarget.querySelector('md-tooltip');
    if (tip) tip.open = false;
  }}
>
  <IconButton><Icon>delete</Icon></IconButton>
  <Tooltip position="bottom">Delete item</Tooltip>
</span>

{/* Rich tooltip */}
<Tooltip variant="rich" position="right">
  <span slot="headline">Feature Info</span>
  Supporting text goes here.
  <TextButton slot="action">Learn more</TextButton>
</Tooltip>`,

  'bottom-sheet': `import { BottomSheet } from 'react-material-web';
import { FilledButton } from 'react-material-web';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<FilledButton onClick={() => setOpen(true)}>Open Bottom Sheet</FilledButton>
<BottomSheet open={open} onClose={() => setOpen(false)}>
  <div style={{ padding: 24 }}>
    <h3>Bottom Sheet Content</h3>
    <p>Add your content here.</p>
  </div>
</BottomSheet>`,

  'date-picker': `import { DatePicker } from 'react-material-web';
import { FilledButton } from 'react-material-web';
import { useState } from 'react';

const [open, setOpen] = useState(false);
const [date, setDate] = useState('');

<FilledButton onClick={() => setOpen(true)}>Pick Date</FilledButton>
<DatePicker
  open={open}
  value={date}
  onDateChanged={(e) => setDate(e.detail.value)}
  onClosed={() => setOpen(false)}
/>`,

  'time-picker': `import { TimePicker } from 'react-material-web';
import { FilledButton } from 'react-material-web';
import { useState } from 'react';

const [open, setOpen] = useState(false);
const [time, setTime] = useState('');

<FilledButton onClick={() => setOpen(true)}>Pick Time</FilledButton>
<TimePicker
  open={open}
  value={time}
  onTimeChanged={(e) => setTime(e.detail.value)}
  onClosed={() => setOpen(false)}
/>`,

  'side-sheet': `import { SideSheet } from 'react-material-web';
import { FilledButton } from 'react-material-web';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<FilledButton onClick={() => setOpen(true)}>Open Side Sheet</FilledButton>
<SideSheet open={open} onClose={() => setOpen(false)}>
  <div style={{ padding: 24 }}>
    <h3>Side Sheet</h3>
    <p>Content goes here.</p>
  </div>
</SideSheet>`,

  popover: `import { Popover } from 'react-material-web';
import { FilledButton } from 'react-material-web';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<FilledButton id="popover-anchor" onClick={() => setOpen(!open)}>
  Toggle Popover
</FilledButton>
<Popover
  open={open}
  anchor="popover-anchor"
  position="bottom"
  onPopoverChanged={(e) => setOpen(e.detail.open)}
>
  <div style={{ padding: 16 }}>Popover content</div>
</Popover>`,

  snackbar: `import { Snackbar } from 'react-material-web';
import { FilledButton, TextButton } from 'react-material-web';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<FilledButton onClick={() => setOpen(true)}>Show Snackbar</FilledButton>
<Snackbar
  open={open}
  message="This is a snackbar notification"
  onClose={() => setOpen(false)}
>
  <TextButton slot="action" onClick={() => setOpen(false)}>
    Dismiss
  </TextButton>
</Snackbar>`,

  chips: `import {
  ChipSet, AssistChip, FilterChip,
  InputChip, SuggestionChip,
} from 'react-material-web';
import { Icon } from 'react-material-web';

<ChipSet>
  <AssistChip label="Assist"><Icon slot="icon">event</Icon></AssistChip>
  <FilterChip label="Filter" />
  <InputChip label="Input" />
  <SuggestionChip label="Suggestion" />
</ChipSet>`,

  fab: `import { Fab, BrandedFab } from 'react-material-web';
import { Icon } from 'react-material-web';

<Fab><Icon slot="icon">add</Icon></Fab>
<Fab size="small"><Icon slot="icon">edit</Icon></Fab>
<Fab size="large"><Icon slot="icon">create</Icon></Fab>
<Fab label="Create" variant="extended">
  <Icon slot="icon">add</Icon>
</Fab>`,

  'speed-dial': `import { SpeedDial, SpeedDialAction } from 'react-material-web';
import { Icon } from 'react-material-web';

<SpeedDial>
  <Icon slot="icon">add</Icon>
  <SpeedDialAction label="Edit"><Icon slot="icon">edit</Icon></SpeedDialAction>
  <SpeedDialAction label="Share"><Icon slot="icon">share</Icon></SpeedDialAction>
  <SpeedDialAction label="Delete"><Icon slot="icon">delete</Icon></SpeedDialAction>
</SpeedDial>`,

  'icon-buttons': `import {
  IconButton, FilledIconButton,
  FilledTonalIconButton, OutlinedIconButton,
} from 'react-material-web';
import { Icon } from 'react-material-web';

<IconButton><Icon>settings</Icon></IconButton>
<FilledIconButton><Icon>edit</Icon></FilledIconButton>
<FilledTonalIconButton><Icon>favorite</Icon></FilledTonalIconButton>
<OutlinedIconButton><Icon>bookmark</Icon></OutlinedIconButton>

{/* Toggle icon button */}
<IconButton toggle selected><Icon>star</Icon></IconButton>`,

  'text-fields': `import { FilledTextField, OutlinedTextField } from 'react-material-web';

<FilledTextField label="Filled" />
<OutlinedTextField label="Outlined" />
<FilledTextField label="With helper" supportingText="Helper text" />
<OutlinedTextField label="Password" type="password" />`,

  'selection-controls': `import { Checkbox } from 'react-material-web';
import { Radio } from 'react-material-web';
import { Switch } from 'react-material-web';

<Checkbox />
<Checkbox checked />
<Radio name="group" value="a" />
<Radio name="group" value="b" />
<Switch />
<Switch selected />`,

  select: `import { FilledSelect, OutlinedSelect, SelectOption } from 'react-material-web';

<FilledSelect label="Choose">
  <SelectOption value="1">Option 1</SelectOption>
  <SelectOption value="2">Option 2</SelectOption>
  <SelectOption value="3">Option 3</SelectOption>
</FilledSelect>

<OutlinedSelect label="Choose">
  <SelectOption value="a">Choice A</SelectOption>
  <SelectOption value="b">Choice B</SelectOption>
</OutlinedSelect>`,

  icons: `import { Icon } from 'react-material-web';

<Icon>home</Icon>
<Icon>favorite</Icon>
<Icon>settings</Icon>
<Icon>search</Icon>`,

  cards: `import { Card } from 'react-material-web';

<Card variant="elevated" style={{ padding: 24, maxWidth: 300 }}>
  <h3>Elevated Card</h3>
  <p>Card content goes here.</p>
</Card>

<Card variant="filled">...</Card>
<Card variant="outlined">...</Card>`,

  divider: `import { Divider } from 'react-material-web';

<Divider />
<Divider inset />
<Divider insetStart />
<Divider insetEnd />`,

  'top-app-bar': `import { TopAppBar } from 'react-material-web';
import { IconButton, Icon } from 'react-material-web';

<TopAppBar variant="small">
  <IconButton slot="leading"><Icon>menu</Icon></IconButton>
  <span slot="title">Page Title</span>
  <IconButton slot="trailing"><Icon>search</Icon></IconButton>
  <IconButton slot="trailing"><Icon>more_vert</Icon></IconButton>
</TopAppBar>`,

  'bottom-app-bar': `import { BottomAppBar } from 'react-material-web';
import { IconButton, Fab, Icon } from 'react-material-web';

<BottomAppBar>
  <IconButton slot="icons"><Icon>search</Icon></IconButton>
  <IconButton slot="icons"><Icon>delete</Icon></IconButton>
  <IconButton slot="icons"><Icon>archive</Icon></IconButton>
  <Fab slot="fab"><Icon slot="icon">add</Icon></Fab>
</BottomAppBar>`,

  'navigation-rail': `import { NavigationRail, NavigationRailItem } from 'react-material-web';
import { Icon } from 'react-material-web';

<NavigationRail>
  <NavigationRailItem label="Home" selected>
    <Icon slot="icon">home</Icon>
  </NavigationRailItem>
  <NavigationRailItem label="Search">
    <Icon slot="icon">search</Icon>
  </NavigationRailItem>
  <NavigationRailItem label="Settings">
    <Icon slot="icon">settings</Icon>
  </NavigationRailItem>
</NavigationRail>`,

  'navigation-drawer': `import { NavigationDrawer } from 'react-material-web';
import { List, ListItem, Icon } from 'react-material-web';
import { useState } from 'react';

const [open, setOpen] = useState(false);

<NavigationDrawer opened={open}>
  <span slot="headline">Navigation</span>
  <List>
    <ListItem type="button"><Icon slot="start">home</Icon>Home</ListItem>
    <ListItem type="button"><Icon slot="start">inbox</Icon>Inbox</ListItem>
    <ListItem type="button"><Icon slot="start">settings</Icon>Settings</ListItem>
  </List>
</NavigationDrawer>`,

  'search-bar': `import { SearchBar } from 'react-material-web';
import { IconButton, Icon } from 'react-material-web';

{/* Basic */}
<SearchBar placeholder="Search...">
  <IconButton slot="leading"><Icon>search</Icon></IconButton>
</SearchBar>

{/* With autocomplete options */}
<SearchBar
  placeholder="Search fruits..."
  options={['Apple', 'Banana', 'Cherry', 'Date']}
/>`,

  slider: `import { Slider } from 'react-material-web';

<Slider />
<Slider value={50} />
<Slider labeled />
<Slider range valueStart={25} valueEnd={75} />`,

  list: `import { List, ListItem } from 'react-material-web';
import { Icon } from 'react-material-web';

<List>
  <ListItem>Simple item</ListItem>
  <ListItem type="button">
    <Icon slot="start">inbox</Icon>
    Clickable item
  </ListItem>
  <ListItem supportingText="Supporting text">
    <Icon slot="start">person</Icon>
    With description
  </ListItem>
</List>`,

  progress: `import { CircularProgress, LinearProgress } from 'react-material-web';

<CircularProgress indeterminate />
<CircularProgress value={0.7} />
<LinearProgress indeterminate />
<LinearProgress value={0.5} />`,

  tabs: `import { Tabs, PrimaryTab, SecondaryTab } from 'react-material-web';
import { Icon } from 'react-material-web';

<Tabs>
  <PrimaryTab>
    <Icon slot="icon">home</Icon>
    Home
  </PrimaryTab>
  <PrimaryTab>
    <Icon slot="icon">star</Icon>
    Favorites
  </PrimaryTab>
  <PrimaryTab>
    <Icon slot="icon">settings</Icon>
    Settings
  </PrimaryTab>
</Tabs>`,

  badge: `import { Badge } from 'react-material-web';

<Badge value={3} />
<Badge value={99} />
<Badge /> {/* dot badge */}`,

  'segmented-button': `import {
  OutlinedSegmentedButtonSet,
  OutlinedSegmentedButton,
} from 'react-material-web';
import { Icon } from 'react-material-web';

<OutlinedSegmentedButtonSet>
  <OutlinedSegmentedButton selected label="Day">
    <Icon slot="icon">calendar_view_day</Icon>
  </OutlinedSegmentedButton>
  <OutlinedSegmentedButton label="Week">
    <Icon slot="icon">calendar_view_week</Icon>
  </OutlinedSegmentedButton>
  <OutlinedSegmentedButton label="Month">
    <Icon slot="icon">calendar_view_month</Icon>
  </OutlinedSegmentedButton>
</OutlinedSegmentedButtonSet>`,

  'navigation-bar': `import { NavigationBar, NavigationTab } from 'react-material-web';
import { Icon } from 'react-material-web';

<NavigationBar>
  <NavigationTab label="Home">
    <Icon slot="active-icon">home</Icon>
    <Icon slot="inactive-icon">home</Icon>
  </NavigationTab>
  <NavigationTab label="Explore">
    <Icon slot="active-icon">explore</Icon>
    <Icon slot="inactive-icon">explore</Icon>
  </NavigationTab>
  <NavigationTab label="Profile">
    <Icon slot="active-icon">person</Icon>
    <Icon slot="inactive-icon">person</Icon>
  </NavigationTab>
</NavigationBar>`,

  carousel: `import { Carousel } from 'react-material-web';

<Carousel>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</Carousel>`,

  accordion: `import { Accordion, AccordionItem } from 'react-material-web';

<Accordion>
  <AccordionItem header="Getting Started">
    Content for the first section.
  </AccordionItem>
  <AccordionItem header="Configuration">
    Content for the second section.
  </AccordionItem>
  <AccordionItem header="Advanced Usage">
    Content for the third section.
  </AccordionItem>
</Accordion>`,

  'data-table': `import { DataTable } from 'react-material-web';

<DataTable>
  <table>
    <thead>
      <tr><th>Name</th><th>Role</th><th>Status</th></tr>
    </thead>
    <tbody>
      <tr><td>Alice</td><td>Engineer</td><td>Active</td></tr>
      <tr><td>Bob</td><td>Designer</td><td>Away</td></tr>
    </tbody>
  </table>
</DataTable>`,

  autocomplete: `import { Autocomplete } from 'react-material-web';

<Autocomplete
  label="Country"
  options={['Australia', 'Austria', 'Brazil', 'Canada']}
/>`,

  stepper: `import { Stepper, StepperStep } from 'react-material-web';

<Stepper activeStep={1}>
  <StepperStep label="Account" />
  <StepperStep label="Details" />
  <StepperStep label="Confirm" />
</Stepper>`,

  skeleton: `import { Skeleton } from 'react-material-web';

<Skeleton variant="text" width={200} />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={300} height={140} />`,

  rating: `import { Rating } from 'react-material-web';
import { useState } from 'react';

const [value, setValue] = useState(3);

<Rating
  value={value}
  onRatingChanged={(e) => setValue(e.detail.value)}
/>
<Rating value={4} readOnly />`,

  timeline: `import { Timeline, TimelineItem } from 'react-material-web';
import { Icon } from 'react-material-web';

<Timeline>
  <TimelineItem headline="Order placed">
    <Icon slot="icon">shopping_cart</Icon>
    Your order has been placed.
  </TimelineItem>
  <TimelineItem headline="Shipped">
    <Icon slot="icon">local_shipping</Icon>
    Package is on its way.
  </TimelineItem>
  <TimelineItem headline="Delivered">
    <Icon slot="icon">check_circle</Icon>
    Package delivered.
  </TimelineItem>
</Timeline>`,

  avatar: `import { Avatar } from 'react-material-web';

<Avatar label="A" />
<Avatar src="https://i.pravatar.cc/40" />
<Avatar label="JD" size={48} />`,

  breadcrumbs: `import { Breadcrumbs, BreadcrumbItem } from 'react-material-web';

<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem>Current Page</BreadcrumbItem>
</Breadcrumbs>`,

  'alert-banner': `import { Alert, Banner } from 'react-material-web';
import { Icon } from 'react-material-web';

<Alert severity="info">
  <Icon slot="icon">info</Icon>
  This is an informational alert.
</Alert>
<Alert severity="success">Operation completed!</Alert>
<Alert severity="warning">Proceed with caution.</Alert>
<Alert severity="error">Something went wrong.</Alert>

<Banner open message="This is a banner notification" />`,

  'file-upload': `import { FileUpload } from 'react-material-web';

<FileUpload
  accept="image/*"
  onFilesChanged={(e) => console.log(e.detail.files)}
/>
<FileUpload multiple accept=".pdf,.doc" />`,

  pagination: `import { Pagination } from 'react-material-web';
import { useState } from 'react';

const [page, setPage] = useState(1);

<Pagination
  page={page}
  totalPages={10}
  onPageChanged={(e) => setPage(e.detail.page)}
/>`,

  'chip-input': `import { ChipInput } from 'react-material-web';
import { useState } from 'react';

const [chips, setChips] = useState(['Apple', 'Banana']);

<ChipInput
  label="Fruits"
  chips={chips}
  onChipsChanged={(e) => setChips(e.detail.chips)}
/>`,

  'swipe-actions': `import { SwipeActions, SwipeAction } from 'react-material-web';
import { Icon } from 'react-material-web';

<SwipeActions>
  <SwipeAction slot="start" color="#4CAF50">
    <Icon>check</Icon>
  </SwipeAction>
  <div>Swipeable content</div>
  <SwipeAction slot="end" color="#F44336">
    <Icon>delete</Icon>
  </SwipeAction>
</SwipeActions>`,

  'pull-to-refresh': `import { PullToRefresh } from 'react-material-web';

<PullToRefresh onRefresh={async () => {
  await fetchData();
}}>
  <div>Pull down to refresh this content.</div>
</PullToRefresh>`,

  'tree-view': `import { TreeView, TreeItem } from 'react-material-web';
import { Icon } from 'react-material-web';

<TreeView>
  <TreeItem label="Documents">
    <Icon slot="icon">folder</Icon>
    <TreeItem label="Resume.pdf">
      <Icon slot="icon">description</Icon>
    </TreeItem>
    <TreeItem label="Cover Letter.pdf">
      <Icon slot="icon">description</Icon>
    </TreeItem>
  </TreeItem>
  <TreeItem label="Photos">
    <Icon slot="icon">folder</Icon>
  </TreeItem>
</TreeView>`,

  'image-list': `import { ImageList, ImageListItem } from 'react-material-web';

<ImageList columns={3} gap={8}>
  <ImageListItem src="photo1.jpg" label="Photo 1" />
  <ImageListItem src="photo2.jpg" label="Photo 2" />
  <ImageListItem src="photo3.jpg" label="Photo 3" />
</ImageList>`,

  'virtual-list': `import { VirtualList } from 'react-material-web';

const items = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  label: \`Item \${i + 1}\`,
}));

<VirtualList
  items={items}
  itemHeight={48}
  renderItem={(item) => <div>{item.label}</div>}
/>`,

  'color-picker': `import { ColorPicker } from 'react-material-web';
import { useState } from 'react';

const [color, setColor] = useState('#6750A4');

<ColorPicker
  value={color}
  onColorChanged={(e) => setColor(e.detail.value)}
/>`,

  'date-range-picker': `import { DateRangePicker } from 'react-material-web';
import { useState } from 'react';

const [start, setStart] = useState('');
const [end, setEnd] = useState('');

<DateRangePicker
  startDate={start}
  endDate={end}
  onRangeChanged={(e) => {
    setStart(e.detail.startDate);
    setEnd(e.detail.endDate);
  }}
/>`,

  'multi-select': `import { MultiSelect } from 'react-material-web';

<MultiSelect
  label="Select tags"
  options={['React', 'TypeScript', 'Material Design', 'Lit']}
/>`,

  'parallax-header': `import { ParallaxHeader } from 'react-material-web';

<ParallaxHeader
  src="hero-image.jpg"
  height={300}
  parallaxAmount={0.5}
>
  <h1>Hero Title</h1>
</ParallaxHeader>`,

  'button-group': `import { ButtonGroup } from 'react-material-web';
import { OutlinedButton } from 'react-material-web';

<ButtonGroup>
  <OutlinedButton>Left</OutlinedButton>
  <OutlinedButton>Center</OutlinedButton>
  <OutlinedButton>Right</OutlinedButton>
</ButtonGroup>`,

  'split-button': `import { SplitButton } from 'react-material-web';
import { Icon } from 'react-material-web';

<SplitButton label="Save" onAction={() => save()}>
  <Icon slot="icon">save</Icon>
</SplitButton>`,

  'floating-toolbar': `import {
  FloatingToolbar, FloatingToolbarItem,
  FloatingToolbarDivider,
} from 'react-material-web';
import { Icon } from 'react-material-web';

<FloatingToolbar>
  <FloatingToolbarItem><Icon>format_bold</Icon></FloatingToolbarItem>
  <FloatingToolbarItem><Icon>format_italic</Icon></FloatingToolbarItem>
  <FloatingToolbarDivider />
  <FloatingToolbarItem><Icon>format_list_bulleted</Icon></FloatingToolbarItem>
</FloatingToolbar>`,

  'loading-indicator': `import { LoadingIndicator } from 'react-material-web';

<LoadingIndicator />
<LoadingIndicator size="small" />
<LoadingIndicator size="large" />`,
};
