import { View, StyleSheet } from 'react-native';
import { Card } from './Card';
import { CardHeader, CardHeaderProps } from './CardHeader';

type ListCardProps = {
    title: string;
    action?: CardHeaderProps['action'];
    gap: number;
    children: React.ReactNode;
};

export function ListCard({ title, action, gap, children }: ListCardProps) {
    return (
        <Card>
            <CardHeader title={title} action={action} />
            <View style={{ gap }}>{children}</View>
        </Card>
    );
}