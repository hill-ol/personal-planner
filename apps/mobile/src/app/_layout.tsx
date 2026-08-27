import { useFonts, PlayfairDisplay_600SemiBold, PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/lib/apolloClient';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        PlayfairDisplay_400Regular,
        PlayfairDisplay_600SemiBold,
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <ApolloProvider client={apolloClient}>
            <Slot />
        </ApolloProvider>
    );
}