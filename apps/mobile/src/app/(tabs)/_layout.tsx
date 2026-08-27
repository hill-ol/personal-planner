import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
            <Tabs.Screen name="week" options={{ title: 'Week' }} />
            <Tabs.Screen name="habits" options={{ title: 'Habits' }} />
            <Tabs.Screen name="recap" options={{ title: 'Recap' }} />
        </Tabs>
    );
}