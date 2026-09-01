import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography } from '@/constants/theme';

export type TimeValue = {
    hour: number;
    minute: number;
    period: 'AM' | 'PM';
};

type TimePickerProps = {
    hasTime: boolean;
    onToggle: (hasTime: boolean) => void;
    value: TimeValue;
    onChange: (value: TimeValue) => void;
};

export function TimePicker({ hasTime, onToggle, value, onChange }: TimePickerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>START TIME</Text>
                <Switch value={hasTime} onValueChange={onToggle} trackColor={{ true: colors.primary }} />
            </View>
            {hasTime && (
                <View style={styles.row}>
                    <Feather name="clock" size={20} color={colors.formHeaders} />
                    <TextInput
                        style={styles.numberInput}
                        keyboardType="number-pad"
                        maxLength={2}
                        value={String(value.hour).padStart(2, '0')}
                        onChangeText={(text) => onChange({ ...value, hour: clamp(Number(text), 1, 12) })}
                    />
                    <Text style={styles.colon}>:</Text>
                    <TextInput
                        style={styles.numberInput}
                        keyboardType="number-pad"
                        maxLength={2}
                        value={String(value.minute).padStart(2, '0')}
                        onChangeText={(text) => onChange({ ...value, minute: clamp(Number(text), 0, 59) })}
                    />
                    <View style={styles.periodToggle}>
                        <TouchableOpacity
                            style={[styles.periodOption, value.period === 'AM' && styles.periodActive]}
                            onPress={() => onChange({ ...value, period: 'AM' })}
                        >
                            <Text style={[styles.periodText, value.period === 'AM' && styles.periodTextActive]}>AM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.periodOption, value.period === 'PM' && styles.periodActive]}
                            onPress={() => onChange({ ...value, period: 'PM' })}
                        >
                            <Text style={[styles.periodText, value.period === 'PM' && styles.periodTextActive]}>PM</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

function clamp(num: number, min: number, max: number) {
    if (isNaN(num)) return min;
    return Math.min(Math.max(num, min), max);
}

const styles = StyleSheet.create({
    container: {
        gap: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        ...typography.fieldLabel,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: colors.surfaceBackground,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    numberInput: {
        fontFamily: typography.cardBody.fontFamily,
        fontSize: typography.cardBody.fontSize,
        color: typography.cardBody.color,
        textAlign: 'center',
        borderWidth: 2,
        padding: 4,
        borderRadius: 12,
        backgroundColor: colors.surfaceLowest,
        borderColor: colors.surfaceBorder,
    },
    colon: {
        ...typography.cardBody,
    },
    periodToggle: {
        flexDirection: 'row',
        marginLeft: 'auto',
        backgroundColor: colors.surfaceLowest,
        borderWidth: 2,
        borderColor: colors.surfaceBorder,
        borderRadius: 20,
        padding: 2,
    },
    periodOption: {
        paddingHorizontal: 14,
        paddingVertical: 2,
        borderRadius: 18,
    },
    periodActive: {
        backgroundColor: colors.primary,
    },
    periodText: {
        ...typography.cardBody,
        fontSize: 13,
        color: colors.typographyHeading,
    },
    periodTextActive: {
        color: colors.surfaceLowest,
    },
});