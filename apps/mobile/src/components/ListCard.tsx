import { View, StyleSheet } from 'react-native';
import { Children, isValidElement, type ReactNode } from 'react';
import { Card } from './Card';
import { CardHeader, CardHeaderProps } from './CardHeader';
import { colors } from '@/constants/theme';

type ListCardProps = {
    title: string;
    action?: CardHeaderProps['action'];
    gap: number;
    dividerPadding?: number;
    children: ReactNode;
};

export function ListCard({
    title,
    action,
    gap,
    dividerPadding = gap,
    children,
}: ListCardProps) {
    const items = Children.toArray(children);

    return (
        <Card>
            <CardHeader title={title} action={action} />
            <View style={{ gap }}>
                {items.map((child, index) => (
                    <View
                        key={isValidElement(child) ? (child.key ?? index) : index}
                        style={
                            index < items.length - 1
                                ? [styles.divider, { paddingBottom: dividerPadding }]
                                : undefined
                        }
                    >
                        {child}
                    </View>
                ))}
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.listDivider,
    },
});
