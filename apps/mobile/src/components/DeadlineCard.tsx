import { ListCard } from './ListCard';
import { DeadlineItem } from './DeadlineItem';

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
            {deadlines.map((deadline) => (
                <DeadlineItem key={deadline.id} name={deadline.name} />
            ))}
        </ListCard>
    );
}
