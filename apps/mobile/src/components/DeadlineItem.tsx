import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

type DeadlineItemProps = {
    name: string;
};

export function DeadlineItem({ name }: DeadlineItemProps) {
    return (
        <View style={styles.row}>
            <Text style={styles.text}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        ...typography.cardBody,
    },
});