export interface MD3Theme {
  // Primary
  colorPrimary?: string;
  colorOnPrimary?: string;
  colorPrimaryContainer?: string;
  colorOnPrimaryContainer?: string;

  // Secondary
  colorSecondary?: string;
  colorOnSecondary?: string;
  colorSecondaryContainer?: string;
  colorOnSecondaryContainer?: string;

  // Tertiary
  colorTertiary?: string;
  colorOnTertiary?: string;
  colorTertiaryContainer?: string;
  colorOnTertiaryContainer?: string;

  // Error
  colorError?: string;
  colorOnError?: string;
  colorErrorContainer?: string;
  colorOnErrorContainer?: string;

  // Surface
  colorSurface?: string;
  colorOnSurface?: string;
  colorSurfaceVariant?: string;
  colorOnSurfaceVariant?: string;
  colorSurfaceContainerLowest?: string;
  colorSurfaceContainerLow?: string;
  colorSurfaceContainer?: string;
  colorSurfaceContainerHigh?: string;
  colorSurfaceContainerHighest?: string;

  // Outline
  colorOutline?: string;
  colorOutlineVariant?: string;

  // Inverse
  colorInverseSurface?: string;
  colorInverseOnSurface?: string;
  colorInversePrimary?: string;

  // Shape
  shapeCornerExtraSmall?: string;
  shapeCornerSmall?: string;
  shapeCornerMedium?: string;
  shapeCornerLarge?: string;
  shapeCornerExtraLarge?: string;
  shapeCornerFull?: string;
}

const TOKEN_MAP: Record<keyof MD3Theme, string> = {
  colorPrimary: '--md-sys-color-primary',
  colorOnPrimary: '--md-sys-color-on-primary',
  colorPrimaryContainer: '--md-sys-color-primary-container',
  colorOnPrimaryContainer: '--md-sys-color-on-primary-container',
  colorSecondary: '--md-sys-color-secondary',
  colorOnSecondary: '--md-sys-color-on-secondary',
  colorSecondaryContainer: '--md-sys-color-secondary-container',
  colorOnSecondaryContainer: '--md-sys-color-on-secondary-container',
  colorTertiary: '--md-sys-color-tertiary',
  colorOnTertiary: '--md-sys-color-on-tertiary',
  colorTertiaryContainer: '--md-sys-color-tertiary-container',
  colorOnTertiaryContainer: '--md-sys-color-on-tertiary-container',
  colorError: '--md-sys-color-error',
  colorOnError: '--md-sys-color-on-error',
  colorErrorContainer: '--md-sys-color-error-container',
  colorOnErrorContainer: '--md-sys-color-on-error-container',
  colorSurface: '--md-sys-color-surface',
  colorOnSurface: '--md-sys-color-on-surface',
  colorSurfaceVariant: '--md-sys-color-surface-variant',
  colorOnSurfaceVariant: '--md-sys-color-on-surface-variant',
  colorSurfaceContainerLowest: '--md-sys-color-surface-container-lowest',
  colorSurfaceContainerLow: '--md-sys-color-surface-container-low',
  colorSurfaceContainer: '--md-sys-color-surface-container',
  colorSurfaceContainerHigh: '--md-sys-color-surface-container-high',
  colorSurfaceContainerHighest: '--md-sys-color-surface-container-highest',
  colorOutline: '--md-sys-color-outline',
  colorOutlineVariant: '--md-sys-color-outline-variant',
  colorInverseSurface: '--md-sys-color-inverse-surface',
  colorInverseOnSurface: '--md-sys-color-inverse-on-surface',
  colorInversePrimary: '--md-sys-color-inverse-primary',
  shapeCornerExtraSmall: '--md-sys-shape-corner-extra-small',
  shapeCornerSmall: '--md-sys-shape-corner-small',
  shapeCornerMedium: '--md-sys-shape-corner-medium',
  shapeCornerLarge: '--md-sys-shape-corner-large',
  shapeCornerExtraLarge: '--md-sys-shape-corner-extra-large',
  shapeCornerFull: '--md-sys-shape-corner-full',
};

export function themeToStyleVars(theme: Partial<MD3Theme>): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme)) {
    const cssVar = TOKEN_MAP[key as keyof MD3Theme];
    if (cssVar && value) {
      vars[cssVar] = value;
    }
  }
  return vars;
}
