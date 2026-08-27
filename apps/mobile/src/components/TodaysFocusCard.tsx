import { Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { CardHeader } from './CardHeader';
import { typography } from '@/constants/theme';

type TodaysFocusCardProps = {
    focus: string;
    onEdit: () => void;
};

export function TodaysFocusCard({ focus, onEdit }: TodaysFocusCardProps) {
    return (
        <Card>
            <CardHeader title="Today's Focus" />
            <Text style={styles.body}>{focus}</Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    body: {
        ...typography.cardBody,
    },
});