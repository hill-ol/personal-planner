import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';
import { deadlineCategoryLabel } from '@/constants/itemOptions';
import type { DeadlineCategory } from '@/generated/schema-types';

type DeadlineItemProps = {
    name: string;
    category: DeadlineCategory;
};

export function DeadlineItem({ name, category }: DeadlineItemProps) {
    return (
        <View style={styles.row}>
            <Text style={styles.text}>{name}</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{deadlineCategoryLabel(category)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    text: {
        ...typography.cardBody,
        flex: 1,
    },
    badge: {
        backgroundColor: colors.textInputShade,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    badgeText: {
        fontFamily: typography.cardBody.fontFamily,
        fontSize: 12,
        letterSpacing: 0.4,
        color: colors.formHeaders,
    },
});
