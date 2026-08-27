import { ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import { TodaysFocusCard } from '@/components/TodaysFocusCard';
import { TasksCard } from '@/components/TasksCard';
import { CoursesCard } from '@/components/CoursesCard';
import { DeadlinesCard } from '@/components/DeadlineCard';
import { colors } from '@/constants/theme';

export default function Dashboard() {
    const [tasks, setTasks] = useState([
        { id: '1', name: 'Morning sync with design team', isDone: true },
        { id: '2', name: 'Review new brand guidelines', isDone: false },
        { id: '3', name: 'Draft weekly update email', isDone: false },
        { id: '4', name: 'Call vendor regarding new supplies', isDone: false },
    ]);

    const courses = [
        { id: '1', name: 'CS 1120 Computer Science' },
        { id: '2', name: 'CS 1120 Computer Science' },
        { id: '3', name: 'CS 1120 Computer Science' },
    ];

    const deadlines = [
        { id: '1', name: 'CS 1120 Computer Science' },
        { id: '2', name: 'CS 1120 Computer Science' },
        { id: '3', name: 'CS 1120 Computer Science' },
    ];

    function handleToggleTask(id: string) {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, isDone: !task.isDone } : task))
        );
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <TodaysFocusCard
                focus="Complete the Q3 financial review and send the draft to the board. This is the main blocking task for the week."
                onEdit={() => {}}
            />
            <TasksCard tasks={tasks} onToggleTask={handleToggleTask} onAdd={() => {}} />
            <CoursesCard courses={courses} onAdd={() => {}} />
            <DeadlinesCard deadlines={deadlines} onAdd={() => {}} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.surfaceBackground,
    },
    content: {
        padding: 16,
    },
});