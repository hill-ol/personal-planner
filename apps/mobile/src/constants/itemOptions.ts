import type { AssignmentType, DeadlineCategory, ItemType } from '@/generated/schema-types';

/** Display labels for the server's enums. The enum members themselves come from
 *  the generated schema types, so dropping or renaming one server-side breaks
 *  the build here instead of failing silently at runtime. */
type EnumOption<T extends string> = { id: T; label: string };

export const DEADLINE_CATEGORIES: EnumOption<DeadlineCategory>[] = [
    { id: 'WORK', label: 'Work' },
    { id: 'CLASS', label: 'Class' },
    { id: 'PERSONAL', label: 'Personal' },
    { id: 'OTHER', label: 'Other' },
];

export const ASSIGNMENT_TYPES: EnumOption<AssignmentType>[] = [
    { id: 'HOMEWORK', label: 'Homework' },
    { id: 'QUIZ', label: 'Quiz' },
    { id: 'EXAM', label: 'Exam' },
    { id: 'PROJECT', label: 'Project' },
    { id: 'OTHER', label: 'Other' },
];

export function deadlineCategoryLabel(category: DeadlineCategory): string {
    return DEADLINE_CATEGORIES.find((option) => option.id === category)?.label ?? category;
}

export const ITEM_TYPE_TABS: { label: string; value: ItemType }[] = [
    { label: 'Task', value: 'TASK' },
    { label: 'Event', value: 'SOCIAL_EVENT' },
    { label: 'Work', value: 'ASSIGNMENT' },
    { label: 'Deadline', value: 'DEADLINE' },
];

export function itemTypeLabel(type: ItemType): string {
    return ITEM_TYPE_TABS.find((tab) => tab.value === type)?.label ?? 'Item';
}

export const ITEM_NAME_PLACEHOLDERS: Record<ItemType, string> = {
    TASK: 'What needs to get done?',
    SOCIAL_EVENT: "What's happening?",
    ASSIGNMENT: 'What needs to get done?',
    DEADLINE: "What's due?",
};