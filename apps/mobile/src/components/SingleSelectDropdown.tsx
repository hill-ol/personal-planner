import { View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { DropdownStatus } from './DropdownStatus';
import { dropdownStyles } from './dropdownStyles';

export type Option = { id: string; label: string };

type SingleSelectDropdownProps = {
    label: string;
    options: Option[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    addNewLabel?: string;
    onAddNew?: () => void;
    loading?: boolean;
    errorMessage?: string;
    emptyMessage?: string;
    onRetry?: () => void;
};

export function SingleSelectDropdown({
    label,
    options,
    selectedId,
    onSelect,
    addNewLabel,
    onAddNew,
    loading,
    errorMessage,
    emptyMessage,
    onRetry,
}: SingleSelectDropdownProps) {
    const [expanded, setExpanded] = useState(false);

    const selectedOption = options.find((option) => option.id === selectedId);

    function handleSelect(id: string) {
        onSelect(id);
        setExpanded(false);
    }

    return (
        <View style={dropdownStyles.container}>
            <Text style={dropdownStyles.label}>{label.toUpperCase()}</Text>
            <View style={dropdownStyles.card}>
                <TouchableOpacity style={dropdownStyles.header} onPress={() => setExpanded(!expanded)}>
                    <Text style={dropdownStyles.headerText}>
                        {selectedOption ? selectedOption.label : `Select ${label}`}
                    </Text>
                    <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.formHeaders} />
                </TouchableOpacity>
                {expanded && (
                    <>
                        <DropdownStatus
                            loading={loading}
                            errorMessage={errorMessage}
                            emptyMessage={options.length === 0 ? emptyMessage : undefined}
                            onRetry={onRetry}
                        />
                        {!loading &&
                            !errorMessage &&
                            options.map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        dropdownStyles.row,
                                        option.id === selectedId && dropdownStyles.rowSelected,
                                    ]}
                                    onPress={() => handleSelect(option.id)}
                                >
                                    <Text style={dropdownStyles.rowText}>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        {/* Stays available even while loading or errored, so adding is never blocked. */}
                        {onAddNew && (
                            <TouchableOpacity style={dropdownStyles.row} onPress={onAddNew}>
                                <Feather name="plus" size={16} color={colors.primary} />
                                <Text style={dropdownStyles.accentText}>
                                    {addNewLabel ?? `Add a ${label.toLowerCase()}`}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </View>
    );
}