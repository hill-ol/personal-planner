import { SingleSelectDropdown } from './SingleSelectDropdown';

type CategoryDropdownProps = {
    options: { id: string; label: string }[];
    selectedId: string | null;
    onSelect: (id: string) => void;
};

export function CategoryDropdown({ options, selectedId, onSelect }: CategoryDropdownProps) {
    return (
        <SingleSelectDropdown
            label="Category"
            options={options}
            selectedId={selectedId}
            onSelect={onSelect}
        />
    );
}