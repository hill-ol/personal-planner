import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography } from '@/constants/theme';

export type CardHeaderProps = {
    title: string;
    action?: {
        onPress: () => void;
    };
};

export function CardHeader({ title, action }: CardHeaderProps) {
    return (
        <View style={styles.row}>
            <Text style={styles.title}>{title}</Text>
            {action && (
                <TouchableOpacity onPress={action.onPress} hitSlop={8}>
                    <Feather name="plus" size={18} style={styles.icon} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        ...typography.cardTitle,
    },
    icon: {
        color: colors.primary,
    }
});