import { StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

const bodyText = {
    fontFamily: typography.cardBody.fontFamily,
    fontSize: typography.cardBody.fontSize,
};

export const dropdownStyles = StyleSheet.create({
    container: {
        gap: 4,
    },
    label: {
        ...typography.fieldLabel,
    },
    card: {
        backgroundColor: colors.surfaceBackground,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    headerText: {
        ...bodyText,
        color: colors.typographyHeading,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.surfaceBorder,
    },
    rowSelected: {
        backgroundColor: colors.textInputShade,
    },
    rowText: {
        ...bodyText,
        color: colors.typographyHeading,
    },
    accentText: {
        ...bodyText,
        color: colors.primary,
    },
    mutedText: {
        ...bodyText,
        color: colors.typographyInactive,
    },
    errorText: {
        ...bodyText,
        flex: 1,
        color: colors.formHeaders,
    },
});