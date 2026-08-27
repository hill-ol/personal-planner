import { View, Text, StyleSheet } from 'react-native';
import { typography } from '@/constants/theme';

type CourseItemProps = {
    name: string;
    icon?: string;
};

export function CourseItem({ name }: CourseItemProps) {
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
        paddingLeft: 16,
        gap: 10,
    },
    text: {
        ...typography.cardBody,
    },
});