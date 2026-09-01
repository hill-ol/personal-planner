import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';
import type { CreateRecurrenceInput, Weekday } from '@/generated/schema-types';

const WEEKDAYS: { value: Weekday; label: string }[] = [
    { value: 'MONDAY', label: 'M' },
    { value: 'TUESDAY', label: 'T' },
    { value: 'WEDNESDAY', label: 'W' },
    { value: 'THURSDAY', label: 'T' },
    { value: 'FRIDAY', label: 'F' },
    { value: 'SATURDAY', label: 'S' },
    { value: 'SUNDAY', label: 'S' },
];

/**
 * No days selected means the item does not recur, so no recurrence is sent at
 * all -- Item.recurrence is nullable and CreateItemInput.recurrence optional.
 * Selecting days implies a weekly cadence that never ends; the design has no
 * frequency or end-condition control yet.
 */
export function toRecurrenceInput(days: Weekday[]): CreateRecurrenceInput | undefined {
    if (days.length === 0) return undefined;
    return {
        frequency: 'WEEKLY',
        interval: 1,
        daysOfWeek: days,
        endCondition: 'NEVER',
    };
}

type RecurrencePickerProps = {
    value: Weekday[];
    onChange: (days: Weekday[]) => void;
};

export function RecurrencePicker({ value, onChange }: RecurrencePickerProps) {
    function toggleDay(day: Weekday) {
        onChange(value.includes(day) ? value.filter((existing) => existing !== day) : [...value, day]);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>RECURRENCES</Text>
            <View style={styles.pillRow}>
                {WEEKDAYS.map((day) => {
                    const selected = value.includes(day.value);
                    return (
                        <TouchableOpacity
                            key={day.value}
                            style={[styles.pill, selected && styles.pillSelected]}
                            onPress={() => toggleDay(day.value)}
                            accessibilityRole="button"
                            accessibilityLabel={day.value.charAt(0) + day.value.slice(1).toLowerCase()}
                            accessibilityState={{ selected }}
                        >
                            <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                                {day.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 4,
    },
    label: {
        ...typography.fieldLabel,
    },
    pillRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.surfaceBackground,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        borderRadius: 24,
        padding: 12,
    },
    pill: {
        // flex + aspectRatio keeps the pills circular at any container width
        // rather than pinning them to the design's fixed 310pt frame.
        flex: 1,
        aspectRatio: 1,
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surfaceLowest,
    },
    pillSelected: {
        backgroundColor: colors.primary,
    },
    pillText: {
        fontFamily: typography.cardBody.fontFamily,
        fontSize: 15,
        color: colors.primary,
    },
    pillTextSelected: {
        color: colors.surfaceLowest,
    },
});