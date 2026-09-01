import { ListCard } from './ListCard';
import { DeadlineItem } from './DeadlineItem';
import type { DeadlineCategory } from '@/generated/schema-types';

type Deadline = {
    id: string;
    name: string;
    category: DeadlineCategory;
};

type DeadlinesCardProps = {
    deadlines: Deadline[];
    onAdd: () => void;
};

export function DeadlinesCard({ deadlines, onAdd }: DeadlinesCardProps) {
    return (
        <ListCard title="Deadlines" action={{ onPress: onAdd }} gap={16}>
            {deadlines.map((deadline) => (
                <DeadlineItem key={deadline.id} name={deadline.name} category={deadline.category} />
            ))}
        </ListCard>
    );
}