/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

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
  listDivider: '#EEE4DE',
};

export const fonts = {
  serif: 'PlayfairDisplay_600SemiBold',
  serifRegular: 'PlayfairDisplay_400Regular',
  sans: 'Inter_400Regular',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
};

export const typography = {
  cardTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: colors.typographyHeading,
    paddingLeft: 16,
    paddingTop: 16,
  },
  cardBody: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.typographyHeading,
  },
};