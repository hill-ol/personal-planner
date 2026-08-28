import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors, fonts } from '@/constants/theme';

type DatePickerProps = {
    value: string | null;
    onChange: (date: string) => void;
};

export function DatePicker({ value, onChange }: DatePickerProps) {
    return (
        <View style={styles.container}>
            <Calendar
                current={value ?? undefined}
                onDayPress={(day) => onChange(day.dateString)}
                markedDates={value ? { [value]: { selected: true, selectedColor: colors.primary } } : {}}
                theme={{
                    textSectionTitleColor: colors.typographyInactive,
                    selectedDayBackgroundColor: colors.primary,
                    selectedDayTextColor: colors.surfaceLowest,
                    todayTextColor: colors.primary,
                    dayTextColor: colors.typographyHeading,
                    textDisabledColor: colors.surfaceBorder,
                    monthTextColor: colors.typographyHeading,
                    textMonthFontFamily: fonts.sans,
                    textDayFontFamily: fonts.sans,
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        paddingVertical: 16,
        backgroundColor: colors.surfaceBackground,
    },
});