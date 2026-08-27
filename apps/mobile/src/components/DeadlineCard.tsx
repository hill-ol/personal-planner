import { ListCard } from './ListCard';
import { DeadlineItem } from './DeadlineItem';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/theme';

type Deadline = {
    id: string;
    name: string;
};

type DeadlinesCardProps = {
    deadlines: Deadline[];
    onAdd: () => void;
};

export function DeadlinesCard({ deadlines, onAdd }: DeadlinesCardProps) {
    return (
        <ListCard title="Deadlines" action={{ onPress: onAdd }} gap={16}>
            {deadlines.map((deadline, index) => (
                <View
                    key={deadline.id}
                    style={index < deadlines.length - 1 && styles.divider}
                >
                    <DeadlineItem name={deadline.name} />
                </View>
            ))}
        </ListCard>
    );
}

const styles = StyleSheet.create({
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.listDivider,
        paddingBottom: 8,
    },
});