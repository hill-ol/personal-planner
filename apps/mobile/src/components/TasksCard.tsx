import { ListCard } from './ListCard';
import { TaskItem } from './TaskItem';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/theme';

type Task = {
    id: string;
    name: string;
    isDone: boolean;
};

type TasksCardProps = {
    tasks: Task[];
    onToggleTask: (id: string) => void;
    onAdd: () => void;
};

export function TasksCard({ tasks, onToggleTask, onAdd }: TasksCardProps) {
    return (
        <ListCard title="Tasks" action={{ onPress: onAdd }} gap={16}>
            {tasks.map((task, index) => (
                <View key={task.id} style={index < tasks.length - 1 && styles.divider}>
                    <TaskItem {...task} onToggle={onToggleTask} />
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