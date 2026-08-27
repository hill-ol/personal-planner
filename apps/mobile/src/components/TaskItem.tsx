import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography } from '@/constants/theme';

type TaskItemProps = {
    id: string;
    name: string;
    isDone: boolean;
    onToggle: (id: string) => void;
};

export function TaskItem({ id, name, isDone, onToggle }: TaskItemProps) {
    return (
        <TouchableOpacity style={styles.row} onPress={() => onToggle(id)} hitSlop={8}>
            {isDone && <Feather name="check" size={24} color={colors.primary} />}
            <Text style={[styles.text, isDone && styles.textDone]}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        paddingLeft: 40,
        ...typography.cardBody,
    },
    textDone: {
        paddingLeft: 16,
        textDecorationLine: 'line-through',
        color: colors.typographyInactive,
    },
});