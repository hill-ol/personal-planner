import { View, TextInput, StyleSheet, Modal } from 'react-native';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { DatePicker } from './DatePicker';
import { colors, typography } from '@/constants/theme';
import {TimePicker, TimeValue} from "@/components/TimePicker";

type ItemTypeTab = 'TASK' | 'SOCIAL_EVENT' | 'ASSIGNMENT' | 'DEADLINE';

type AddItemModalProps = {
    visible: boolean;
    onClose: () => void;
};

export function AddItemModal({ visible, onClose }: AddItemModalProps) {
    const [type, setType] = useState<ItemTypeTab>('TASK');
    const [name, setName] = useState('');
    const [date, setDate] = useState<string | null>(null);
    const [hasTime, setHasTime] = useState(true);
    const [time, setTime] = useState<TimeValue>({ hour: 8, minute: 30, period: 'AM' });

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            <View style={styles.container}>
                <SegmentedControl
                    value={type}
                    onChange={setType}
                    options={[
                        { label: 'Task', value: 'TASK' },
                        { label: 'Event', value: 'SOCIAL_EVENT' },
                        { label: 'Work', value: 'ASSIGNMENT' },
                        { label: 'Deadline', value: 'DEADLINE' },
                    ]}
                />
                <TextInput
                    style={styles.nameInput}
                    placeholder="What needs to be done?"
                    value={name}
                    onChangeText={setName}
                />
                <DatePicker value={date} onChange={setDate} />
                <TimePicker hasTime={hasTime} onToggle={setHasTime} value={time} onChange={setTime} />            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surfaceLowest,
        padding: 16,
        gap: 24,
    },
    nameInput: {
        ...typography.cardBody,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
        paddingVertical: 12,
    },
});