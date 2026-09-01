import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography } from '@/constants/theme';

const CHECK_SIZE = 24;

type TaskItemProps = {
    id: string;
    name: string;
    isDone: boolean;
    onToggle: (id: string) => void;
};

export function TaskItem({ id, name, isDone, onToggle }: TaskItemProps) {
    return (
        <TouchableOpacity style={styles.row} onPress={() => onToggle(id)} hitSlop={8}>
            {/* The slot is always rendered so the label sits at the same x
                whether the check is showing. */}
            <View style={styles.checkSlot}>
                {isDone && <Feather name="check" size={CHECK_SIZE} color={colors.primary} />}
            </View>
            <Text style={[styles.text, isDone && styles.textDone]}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    checkSlot: {
        width: CHECK_SIZE,
        alignItems: 'center',
    },
    text: {
        ...typography.cardBody,
    },
    textDone: {
        textDecorationLine: 'line-through',
        color: colors.typographyInactive,
    },
});