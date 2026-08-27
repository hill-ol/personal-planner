import { View, StyleSheet, ViewProps } from 'react-native';
import { colors } from '@/constants/theme';

type CardProps = ViewProps & {
    children: React.ReactNode;
};

export function Card({ children, style, ...rest }: CardProps) {
    return (
        <View style={[styles.card, style]} {...rest}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surfaceBackground,
        borderWidth: 1,
        borderColor: colors.surfaceBorder,
        borderRadius: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
        paddingHorizontal: 25,
        paddingVertical: 31,
        gap: 32,
    },
});