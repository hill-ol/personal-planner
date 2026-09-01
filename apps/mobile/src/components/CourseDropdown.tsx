import { useQuery } from '@apollo/client/react';
import { CoursesDocument } from '@/generated/graphql';
import { SingleSelectDropdown } from './SingleSelectDropdown';

type CourseDropdownProps = {
    selectedId: string | null;
    onSelect: (id: string) => void;
    onAddNew: () => void;
};

export function CourseDropdown({ selectedId, onSelect, onAddNew }: CourseDropdownProps) {
    const { data, loading, error, refetch } = useQuery(CoursesDocument);

    const options = data?.courses.map((course) => ({ id: course.id, label: course.name })) ?? [];

    return (
        <SingleSelectDropdown
            label="Course"
            options={options}
            selectedId={selectedId}
            onSelect={onSelect}
            addNewLabel="Add a course"
            onAddNew={onAddNew}
            loading={loading}
            errorMessage={error ? "Couldn't load courses." : undefined}
            emptyMessage="No courses yet."
            onRetry={() => {
                void refetch();
            }}
        />
    );
}