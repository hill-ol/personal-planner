import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const typeDefsArray = loadFilesSync(path.join(__dirname, '../schema'), {
    extensions: ['graphql'],
});

const typeDefs = mergeTypeDefs(typeDefsArray);

const resolvers = {
    Query: {
        habits: () => prisma.habit.findMany(),
        courses: () => prisma.course.findMany(),
        persons: () => prisma.person.findMany(),
        dayEntries: () => prisma.dayEntry.findMany(),
        weeklyRecaps: () => prisma.weeklyRecap.findMany(),
        assignments: () => prisma.assignment.findMany(),
        deadlines: () => prisma.deadline.findMany(),
        socialEvents: () => prisma.socialEvent.findMany(),
        items: async () => {
            const items = await prisma.item.findMany({
                include: { assignment: true, deadline: true, socialEvent: true },
            });
            return items.map((item) => ({
                ...item,
                ...item.assignment,
                ...item.deadline,
                ...item.socialEvent,
            }));
        },
    },
    Item : {
        __resolveType(item) {
            if (item.type === 'ASSIGNMENT') return 'Assignment';
            if (item.type === 'DEADLINE') return 'Deadline';
            if (item.type === 'SOCIAL_EVENT') return 'SocialEvent';
            return null;
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
});

console.log(`Server running at ${url}`);