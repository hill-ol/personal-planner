import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { dropdownStyles } from './dropdownStyles';

type DropdownStatusProps = {
    loading?: boolean;
    errorMessage?: string;
    emptyMessage?: string;
    onRetry?: () => void;
};

export function DropdownStatus({ loading, errorMessage, emptyMessage, onRetry }: DropdownStatusProps) {
    if (loading) {
        return (
            <View style={dropdownStyles.row}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={dropdownStyles.mutedText}>Loading…</Text>
            </View>
        );
    }

    if (errorMessage) {
        return (
            <>
                <View style={dropdownStyles.row}>
                    <Feather name="alert-circle" size={16} color={colors.primary} />
                    <Text style={dropdownStyles.errorText}>{errorMessage}</Text>
                </View>
                {onRetry && (
                    <TouchableOpacity style={dropdownStyles.row} onPress={onRetry}>
                        <Feather name="refresh-cw" size={16} color={colors.primary} />
                        <Text style={dropdownStyles.accentText}>Try again</Text>
                    </TouchableOpacity>
                )}
            </>
        );
    }

    if (emptyMessage) {
        return (
            <View style={dropdownStyles.row}>
                <Text style={dropdownStyles.mutedText}>{emptyMessage}</Text>
            </View>
        );
    }

    return null;
}
