import { ScrollView, StyleSheet, Text } from 'react-native';
import {gql, TypedDocumentNode} from '@apollo/client';
import { useMutation, useQuery} from '@apollo/client/react';
import { TodaysFocusCard } from '@/components/TodaysFocusCard';
import { TasksCard } from '@/components/TasksCard';
import { CoursesCard } from '@/components/CoursesCard';
import { DeadlinesCard } from '@/components/DeadlineCard';
import { colors } from '@/constants/theme';

const DASHBOARD_QUERY: TypedDocumentNode<DashboardData> = gql`
    query DashboardData {
        items {
            id
            name
            status
            __typename
            ... on Deadline {
                category
            }
        }
        courses {
            id
            name
        }
    }
`;

type DashboardItem = {
    id: string;
    name: string;
    status: string;
    __typename: string;
    category?: string;
};

type DashboardData = {
    items: DashboardItem[];
    courses: { id: string; name: string }[];
};

const UPDATE_ITEM_STATUS = gql`
    mutation UpdateItemStatus($id: ID!, $status: ItemStatus!) {
        updateItemStatus(id: $id, status: $status) {
            id
            status
        }
    }
`;

export default function Dashboard() {
    const { data, loading, error, refetch } = useQuery(DASHBOARD_QUERY);
    const [updateItemStatus] = useMutation(UPDATE_ITEM_STATUS);

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

        await updateItemStatus({
            variables: { id, status: task.isDone ? 'PENDING' : 'DONE' },
        });
        refetch();
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <TodaysFocusCard
                focus="Complete the Q3 financial review and send the draft to the board. This is the main blocking task for the week."
                onEdit={() => {}}
            />
            <TasksCard tasks={tasks} onToggleTask={handleToggleTask} onAdd={() => {}} />
            <CoursesCard courses={data.courses} onAdd={() => {}} />
            <DeadlinesCard deadlines={deadlines} onAdd={() => {}} />
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
});