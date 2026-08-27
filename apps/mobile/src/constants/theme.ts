/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const colors = {
  primary: '#B40065',
  primaryContainer: '#E10080',
  secondary: '#4D644E',
  secondaryContainer: '#CFEACD',
  tertiary: '#386176',
  tertiaryContainer: '#527990',
  surfaceBackground: '#FFF8F3',
  surfaceLowest: '#FFFFFF',
  surfaceBorder: '#E8E1DC',
  typographyHeading: '#1D1B18',
  typographyInactive: '#6B7280',
  typographyForm: '#8F6E78',
  formHeaders: '#5B3F48',
  textInputShade: '#F5EFED',
};

export const fonts = {
  serif: 'PlayfairDisplay_600SemiBold',
  serifRegular: 'PlayfairDisplay_400Regular',
  sans: 'Inter_400Regular',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
};

export const typography = {
  displayLarge: { fontFamily: fonts.serif, fontSize: 48 },
  displayLargeMobile: { fontFamily: fonts.serif, fontSize: 32 },
  headlineMedium: { fontFamily: fonts.sansSemiBold, fontSize: 24 },
  titleLarge: { fontFamily: fonts.sansSemiBold, fontSize: 20 },
  bodySmall: { fontFamily: fonts.sans, fontSize: 14 },
  labelCaps: { fontFamily: fonts.sansBold, fontSize: 12, textTransform: 'uppercase' },
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
