import { ListCard } from './ListCard';
import { TaskItem } from './TaskItem';

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
            {tasks.map((task) => (
                <TaskItem key={task.id} {...task} onToggle={onToggleTask} />
            ))}
        </ListCard>
    );
}
