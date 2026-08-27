import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const httpLink = new HttpLink({
    uri: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
    },
});

export const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});