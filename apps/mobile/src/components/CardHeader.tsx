import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts } from '@/constants/theme';

type CardHeaderProps = {
    title: string;
    action?: {
        icon: 'edit' | 'plus';
        onPress: () => void;
    };
};

export function CardHeader({ title, action }: CardHeaderProps) {
    return (
        <View style={styles.row}>
            <Text style={styles.title}>{title}</Text>
            {action && (
                <TouchableOpacity onPress={action.onPress} hitSlop={8}>
                    <Feather
                        name={action.icon === 'edit' ? 'edit-2' : 'plus'}
                        size={18}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontFamily: fonts.serif,
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: -0.2,
        color: colors.typographyHeading,
    },
});