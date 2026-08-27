import { StyleSheet, View } from 'react-native';
import { CourseItem } from './CourseItem';
import { ListCard } from './ListCard';
import { colors } from "@/constants/theme";

type Course = {
    id: string;
    name: string;
};

type CoursesCardProps = {
    courses: Course[];
    onAdd: () => void;
};

export function CoursesCard({ courses, onAdd }: CoursesCardProps) {
    return (
        <ListCard title="Courses" action={{ onPress: onAdd }} gap={16}>
            {courses.map((course, index) => (
                <View key={course.id} style={index < courses.length - 1 && styles.divider}>
                    <CourseItem name={course.name} />
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