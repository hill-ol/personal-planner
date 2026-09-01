import { CourseItem } from './CourseItem';
import { ListCard } from './ListCard';

type Course = {
    id: string;
    name: string;
    icon: string;
};

type CoursesCardProps = {
    courses: Course[];
    onAdd: () => void;
};

export function CoursesCard({ courses, onAdd }: CoursesCardProps) {
    return (
        <ListCard title="Courses" action={{ onPress: onAdd }} gap={16}>
            {courses.map((course) => (
                <CourseItem key={course.id} name={course.name} icon={course.icon} />
            ))}
        </ListCard>
    );
}
