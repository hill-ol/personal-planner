import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const typeDefsArray = loadFilesSync(path.join(__dirname, '../schema'), {
    extensions: ['graphql'],
});

const typeDefs = mergeTypeDefs(typeDefsArray);

const resolvers = {
    Query: {
        _placeholder: () => 'schema is alive',
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
});

console.log(`Server running at ${url}`);