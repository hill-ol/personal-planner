import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography } from '@/constants/theme';

const ICON_SIZE = 18;

type FeatherName = keyof typeof Feather.glyphMap;

function isFeatherName(icon: string): icon is FeatherName {
    return icon in Feather.glyphMap;
}

type CourseItemProps = {
    name: string;
    icon: string;
};

export function CourseItem({ name, icon }: CourseItemProps) {
    return (
        <View style={styles.row}>
            <View style={styles.iconSlot}>
                {isFeatherName(icon) ? (
                    <Feather name={icon} size={ICON_SIZE} color={colors.primary} />
                ) : (
                    // Course.icon stores a plain string, so anything that is not a
                    // Feather glyph name renders as-is -- which covers emoji.
                    <Text style={styles.iconText}>{icon}</Text>
                )}
            </View>
            <Text style={styles.text}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconSlot: {
        width: ICON_SIZE,
        alignItems: 'center',
    },
    iconText: {
        fontSize: ICON_SIZE,
        lineHeight: ICON_SIZE + 4,
    },
    text: {
        ...typography.cardBody,
    },
});
