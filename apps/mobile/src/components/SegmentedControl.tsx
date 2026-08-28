import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

type SegmentedControlProps<T extends string> = {
    options: { label: string; value: T }[];
    value: T;
    onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
    return (
        <View style={styles.row}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[styles.segment, value === option.value && styles.segmentActive]}
                    onPress={() => onChange(option.value)}
                >
                    <Text style={[styles.label, value === option.value && styles.labelActive]}>
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        backgroundColor: colors.textInputShade,
        borderRadius: 12,
        padding: 4,
    },
    segment: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    segmentActive: {
        backgroundColor: colors.surfaceLowest,
    },
    label: {
        ...typography.cardBody,
        fontSize: 14,
        color: colors.typographyInactive,
    },
    labelActive: {
        color: colors.typographyHeading,
    },
});