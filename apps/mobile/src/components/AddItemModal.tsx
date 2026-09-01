import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    StyleSheet,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { DatePicker } from './DatePicker';
import { colors, fonts, typography } from '@/constants/theme';
import { TimePicker, TimeValue } from "@/components/TimePicker";
import { InviteePicker } from "@/components/InviteePicker";
import { CategoryDropdown } from './CategoryDropdown';
import { CourseDropdown } from './CourseDropdown';
import { RecurrencePicker } from './RecurrencePicker';
import type { ItemType, Weekday } from '@/generated/schema-types';
import {
    ASSIGNMENT_TYPES,
    DEADLINE_CATEGORIES,
    ITEM_NAME_PLACEHOLDERS,
    ITEM_TYPE_TABS,
    itemTypeLabel,
} from '@/constants/itemOptions';

type ItemTypeTab = ItemType;

const INITIAL_TIME: TimeValue = { hour: 8, minute: 30, period: 'AM' };

type AddItemModalProps = {
    visible: boolean;
    onClose: () => void;
};

export function AddItemModal({ visible, onClose }: AddItemModalProps) {
    const [type, setType] = useState<ItemTypeTab>('TASK');
    const [name, setName] = useState('');
    const [date, setDate] = useState<string | null>(null);
    const [hasTime, setHasTime] = useState(true);
    const [time, setTime] = useState<TimeValue>(INITIAL_TIME);
    const [inviteeIds, setInviteeIds] = useState<string[]>([]);
    const [category, setCategory] = useState<string | null>(null);
    const [courseId, setCourseId] = useState<string | null>(null);
    // Empty means "does not recur" -- see toRecurrenceInput.
    const [recurrenceDays, setRecurrenceDays] = useState<Weekday[]>([]);

    // Reset on open rather than on close, so every dismissal path -- the close
    // button, the Android back button, and iOS swipe-to-dismiss -- lands on a
    // clean form next time.
    useEffect(() => {
        if (!visible) return;
        setType('TASK');
        setName('');
        setDate(null);
        setHasTime(true);
        setTime(INITIAL_TIME);
        setInviteeIds([]);
        setCategory(null);
        setCourseId(null);
        setRecurrenceDays([]);
    }, [visible]);

    // Deadline and Assignment use different category enums, so a value picked
    // under one tab is meaningless under the other.
    function handleTypeChange(nextType: ItemTypeTab) {
        setType(nextType);
        setCategory(null);
    }

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
            {/* iOS needs an explicit behavior; on Android the view's presence
                is enough, per Expo's keyboard-handling guide. */}
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Sheet grabber. Decorative -- RN's pageSheet has no built-in
                    handle, and on Android the modal is full-screen. */}
                <View style={styles.grabber} />
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{`New ${itemTypeLabel(type)}`}</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            hitSlop={12}
                            accessibilityRole="button"
                            accessibilityLabel="Close"
                        >
                            <Feather name="x" size={28} color={colors.typographyHeading} />
                        </TouchableOpacity>
                    </View>
                    <SegmentedControl
                        value={type}
                        onChange={handleTypeChange}
                        options={ITEM_TYPE_TABS}
                    />
                    <TextInput
                        style={styles.nameInput}
                        placeholder={ITEM_NAME_PLACEHOLDERS[type]}
                        placeholderTextColor={colors.typographyInactive}
                        value={name}
                        onChangeText={setName}
                    />
                    <DatePicker value={date} onChange={setDate} />
                    <TimePicker hasTime={hasTime} onToggle={setHasTime} value={time} onChange={setTime} />
                    <RecurrencePicker value={recurrenceDays} onChange={setRecurrenceDays} />
                    {type === 'SOCIAL_EVENT' && (
                        <InviteePicker selectedIds={inviteeIds} onChange={setInviteeIds} />
                    )}
                    {(type === 'DEADLINE' || type === 'ASSIGNMENT') && (
                        <CategoryDropdown
                            options={type === 'DEADLINE' ? DEADLINE_CATEGORIES : ASSIGNMENT_TYPES}
                            selectedId={category}
                            onSelect={setCategory}
                        />
                    )}
                    {type === 'ASSIGNMENT' && (
                        <CourseDropdown
                            selectedId={courseId}
                            onSelect={setCourseId}
                            onAddNew={() => console.log('open new course modal')}
                        />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.surfaceLowest,
    },
    scroll: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        padding: 16,
        gap: 24,
        paddingBottom: 48,
    },
    grabber: {
        alignSelf: 'center',
        width: 44,
        height: 5,
        borderRadius: 999,
        backgroundColor: colors.surfaceBorder,
        marginTop: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // Top only -- the content container's `gap: 24` already spaces the
        // title from the segmented control below it.
        paddingTop: 24,
    },
    title: {
        fontFamily: fonts.serif,
        fontSize: 24,
        lineHeight: 30,
        // Android pads Text using font metrics; without this the serif's
        // generous line box reads as extra space under the title.
        includeFontPadding: false,
        color: colors.typographyHeading,
    },
    nameInput: {
        ...typography.cardBody,
        fontSize: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.typographyInactive,
        paddingVertical: 14,
    },
});