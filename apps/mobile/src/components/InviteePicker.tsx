import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useQuery, useMutation } from '@apollo/client/react';
import { colors, typography } from '@/constants/theme';
import { CreatePersonDocument, PersonsDocument } from '@/generated/graphql';
import { DropdownStatus } from './DropdownStatus';
import { dropdownStyles } from './dropdownStyles';

type InviteePickerProps = {
    selectedIds: string[];
    onChange: (ids: string[]) => void;
};

export function InviteePicker({ selectedIds, onChange }: InviteePickerProps) {
    const [expanded, setExpanded] = useState(false);
    const [addingPerson, setAddingPerson] = useState(false);
    const [newName, setNewName] = useState('');
    const [addError, setAddError] = useState<string | null>(null);

    const { data, loading, error, refetch } = useQuery(PersonsDocument);
    const [createPerson, { loading: adding }] = useMutation(CreatePersonDocument);

    function toggleSelected(id: string) {
        onChange(
            selectedIds.includes(id) ? selectedIds.filter((existingId) => existingId !== id) : [...selectedIds, id]
        );
    }

    async function handleAddPerson() {
        if (!newName.trim()) return;
        setAddError(null);
        try {
            const result = await createPerson({ variables: { name: newName.trim() } });
            if (result.data) {
                onChange([...selectedIds, result.data.createPerson.id]);
            }
            setNewName('');
            setAddingPerson(false);
            void refetch();
        } catch {
            // Keep the typed name so the entry is not lost on a failed save.
            setAddError("Couldn't add that person.");
        }
    }

    return (
        <View style={dropdownStyles.container}>
            <Text style={dropdownStyles.label}>INVITEES</Text>
            <View style={dropdownStyles.card}>
                <TouchableOpacity style={dropdownStyles.header} onPress={() => setExpanded(!expanded)}>
                    <Text style={dropdownStyles.headerText}>Select Invitees</Text>
                    <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.formHeaders} />
                </TouchableOpacity>
                {expanded && (
                    <>
                        <DropdownStatus
                            loading={loading}
                            errorMessage={error ? "Couldn't load people." : undefined}
                            emptyMessage={data?.persons.length === 0 ? 'No people yet.' : undefined}
                            onRetry={() => {
                                void refetch();
                            }}
                        />
                        {!loading &&
                            !error &&
                            data?.persons.map((person) => (
                                <TouchableOpacity
                                    key={person.id}
                                    style={[
                                        dropdownStyles.row,
                                        selectedIds.includes(person.id) && dropdownStyles.rowSelected,
                                    ]}
                                    onPress={() => toggleSelected(person.id)}
                                >
                                    <Text style={dropdownStyles.rowText}>{person.name}</Text>
                                </TouchableOpacity>
                            ))}
                        {addError && <DropdownStatus errorMessage={addError} />}
                        {addingPerson ? (
                            <View style={dropdownStyles.row}>
                                <TextInput
                                    style={styles.input}
                                    value={newName}
                                    onChangeText={setNewName}
                                    placeholder="Person's name"
                                    autoFocus
                                    editable={!adding}
                                    onSubmitEditing={handleAddPerson}
                                />
                                {adding && <ActivityIndicator size="small" color={colors.primary} />}
                            </View>
                        ) : (
                            <TouchableOpacity style={dropdownStyles.row} onPress={() => setAddingPerson(true)}>
                                <Feather name="plus" size={16} color={colors.primary} />
                                <Text style={dropdownStyles.accentText}>Add a person</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        fontFamily: typography.cardBody.fontFamily,
        fontSize: typography.cardBody.fontSize,
        color: colors.typographyHeading,
        padding: 0,
    },
});