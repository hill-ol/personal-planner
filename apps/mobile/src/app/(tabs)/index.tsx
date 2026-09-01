import { ScrollView, StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import { useMutation, useQuery} from '@apollo/client/react';
import { DashboardDataDocument, UpdateItemStatusDocument } from '@/generated/graphql';
import { TodaysFocusCard } from '@/components/TodaysFocusCard';
import { TasksCard } from '@/components/TasksCard';
import { CoursesCard } from '@/components/CoursesCard';
import { DeadlinesCard } from '@/components/DeadlinesCard';
import { colors, typography } from '@/constants/theme';
import { AddItemModal } from "@/components/AddItemModal";

export default function Dashboard() {
    const { data, loading, error, refetch } = useQuery(DashboardDataDocument);
    const [updateItemStatus] = useMutation(UpdateItemStatusDocument);
    const [addItemVisible, setAddItemVisible] = useState(false);
    const [toggleError, setToggleError] = useState<string | null>(null);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Something went wrong: {error.message}</Text>;
    if (!data) return <Text>No data available.</Text>;

    const tasks = data.items
        .filter((item) => item.__typename === 'Task')
        .map((item) => ({ id: item.id, name: item.name, isDone: item.status === 'DONE' }));

    const deadlines = data.items.filter((item) => item.__typename === 'Deadline');

    async function handleToggleTask(id: string) {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        setToggleError(null);
        try {
            await updateItemStatus({
                variables: { id, status: task.isDone ? 'PENDING' : 'DONE' },
            });
            await refetch();
        } catch {
            setToggleError("Couldn't update that task. Pull to retry.");
        }
    }

    function openAddItem() {
        setAddItemVisible(true);
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <AddItemModal visible={addItemVisible} onClose={() => setAddItemVisible(false)} />
            {toggleError && <Text style={styles.errorBanner}>{toggleError}</Text>}
            <TodaysFocusCard
                focus="Complete the Q3 financial review and send the draft to the board. This is the main blocking task for the week."
                onEdit={() => {}}
            />
            <TasksCard tasks={tasks} onToggleTask={handleToggleTask} onAdd={openAddItem} />
            <CoursesCard courses={data.courses} onAdd={openAddItem} />
            <DeadlinesCard deadlines={deadlines} onAdd={openAddItem} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.surfaceLowest,
    },
    content: {
        paddingVertical: 32,
        paddingHorizontal: 16,
        gap: 24,
    },
    errorBanner: {
        ...typography.cardBody,
        fontSize: 14,
        color: colors.formHeaders,
        backgroundColor: colors.textInputShade,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
});