import { Platform } from "react-native";

export const colors = {
  // Primary Brand Colors
  primary: {
    main: '#0052CC',        // Primary blue (buttons, links, CTAs)
    light: '#E8F0FF',       // Light blue background
    dark: '#003DA5',        // Dark blue (hover states)
    lighter: '#F0F6FF',     // Very light blue background
  },

  // Secondary Colors
  secondary: {
    main: '#6B7280',        // Gray (secondary text, borders)
    light: '#F3F4F6',       // Light gray (backgrounds, dividers)
    lighter: '#FAFBFC',     // Very light gray (surfaces)
    dark: '#374151',        // Dark gray (primary text)
  },

  // Neutral / Grayscale
  neutral: {
    white: '#FFFFFF',       // White (cards, backgrounds)
    black: '#000000',       // Black (dark mode background)
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },

  // Status Colors
  status: {
    success: '#10B981',     // Green (confirmed events, active status)
    warning: '#F59E0B',     // Amber/Orange (pending, caution)
    error: '#EF4444',       // Red (cancelled, errors, danger)
    info: '#0052CC',        // Blue (information, notifications)
  },

  // Accent Colors
  accent: {
    orange: '#FF6B35',      // Orange (highlights, warnings)
    yellow: '#FCD34D',      // Yellow (tags, badges)
    green: '#10B981',       // Green (success, confirmations)
    red: '#DC2626',         // Red (destructive actions)
    purple: '#8B5CF6',      // Purple (premium features)
  },

  // UI Element Colors
  ui: {
    border: '#E5E7EB',      // Border color (light gray)
    borderDark: '#D1D5DB',  // Darker border (hover states)
    background: '#FFFFFF',  // Main background
    backgroundAlt: '#F9FAFB', // Alternative background
    surface: '#FFFFFF',     // Card surfaces
    surfaceHover: '#F3F4F6', // Surface on hover
    divider: '#E5E7EB',     // Divider lines
    overlay: 'rgba(0, 0, 0, 0.5)', // Modal/overlay background
  },

  // Text Colors
  text: {
    primary: '#111827',     // Main text (headings, body)
    secondary: '#6B7280',   // Secondary text (labels, descriptions)
    tertiary: '#9CA3AF',    // Tertiary text (helper text, disabled)
    inverse: '#FFFFFF',     // Text on dark/primary backgrounds
    muted: '#9CA3AF',       // Muted text (placeholders)
  },

  // Button Colors
  button: {
    primary: '#0052CC',     // Primary button background
    primaryHover: '#003DA5', // Primary button hover
    primaryDisabled: '#D1D5DB', // Primary button disabled
    secondary: '#F3F4F6',   // Secondary button background
    secondaryHover: '#E5E7EB', // Secondary button hover
    secondaryDisabled: '#F3F4F6', // Secondary button disabled
    tertiary: '#FFFFFF',    // Tertiary button background
    tertiaryHover: '#F9FAFB', // Tertiary button hover
    tertiaryBorder: '#D1D5DB', // Tertiary button border


  destructive: '#DC2626',          // 🔥 red
  destructiveHover: '#B91C1C',     // darker red
  destructiveDisabled: '#FCA5A5',  // light red
  },

  // Tag/Badge Colors
  tags: {
    workshop: '#E8F0FF',    // Workshop tag background (light blue)
    workshopText: '#0052CC', // Workshop tag text
    club: '#F0E7FF',        // Club tag background (light purple)
    clubText: '#7C3AED',    // Club tag text
    talk: '#FEF3C7',        // Talk tag background (light yellow)
    talkText: '#D97706',    // Talk tag text
    exam: '#FEE2E2',        // Exam tag background (light red)
    examText: '#DC2626',    // Exam tag text
  },

  // Special States
  states: {
    disabled: '#9CA3AF',    // Disabled state color
    disabledBackground: '#F3F4F6', // Disabled background
    active: '#0052CC',      // Active/selected state
    focus: '#0052CC',       // Focus ring color
    hover: '#F3F4F6',       // General hover background
  },

  // Shadows & Effects
  shadows: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)',
  },

  // Dark Mode Variants (if needed)
  dark: {
    background: '#111827',
    surface: '#1F2937',
    border: '#374151',
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
    },
  },
} as const;




export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
