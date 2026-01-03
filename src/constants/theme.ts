/**
 * Color constants for the app
 * Clean, minimal, modern - no gradients, smooth neutral colors
 */

export const Colors = {
  // Backgrounds
  background: '#F7F7F7',
  cardBackground: '#FFFFFF',
  panelBackground: '#FAFAFA',
  
  // Text
  textPrimary: '#2C2C2C',
  textSecondary: '#6B6B6B',
  textMuted: '#9E9E9E',
  
  // Accent (muted teal)
  accent: '#4A9B9B',
  accentLight: '#E8F4F4',
  
  // Interactive
  buttonPositive: '#5A9F5A',
  buttonNegative: '#C75A5A',
  buttonNeutral: '#E0E0E0',
  buttonText: '#FFFFFF',
  
  // Borders and dividers
  border: '#E8E8E8',
  divider: '#ECECEC',
  
  // Dealer indicator
  dealerBadge: '#F5A623',
  dealerBadgeText: '#FFFFFF',
  
  // Rank colors (subtle)
  rankFirst: '#4A9B9B',
  rankOther: '#9E9E9E',
  
  // Shadows (for iOS)
  shadow: '#000000',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
} as const;

// Minimum touch target size (48dp per Material Design guidelines)
export const TouchTarget = {
  minimum: 48,
} as const;
