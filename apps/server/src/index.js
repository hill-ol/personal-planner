import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const typeDefsArray = loadFilesSync(path.join(__dirname, '../schema'), {
    extensions: ['graphql'],
});

const typeDefs = mergeTypeDefs(typeDefsArray);

function toRecurrenceCreateData(recurrenceInput) {
    return {
        ...recurrenceInput,
        daysOfWeek: recurrenceInput.daysOfWeek
            ? JSON.stringify(recurrenceInput.daysOfWeek)
            : null,
    };
}

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
    Mutation: {
        createPerson: (_parent, args) => {
            return prisma.person.create({
                data: { name: args.input.name },
            });
        },
        createHabit: (_parent, args) => {
            return prisma.habit.create({
                data: {
                    name: args.input.name,
                    currentStreak: 0,
                    longestStreak: 0,
                    recurrence: {
                        create: toRecurrenceCreateData(args.input.recurrence),
                    },
                },
            });
        },
        createItem: async (_parent, args) => {
            const { type, assignmentDetails, deadlineDetails, socialEventDetails, recurrence, ...itemFields } = args.input;

            const data = {
                ...itemFields,
                type,
                ...(recurrence && { recurrence: { create: recurrence } }),
            };

            if (type === 'ASSIGNMENT') {
                data.assignment = { create: assignmentDetails };
            } else if (type === 'DEADLINE') {
                data.deadline = { create: deadlineDetails };
            } else if (type === 'SOCIAL_EVENT') {
                data.socialEvent = {
                    create: {
                        endDate: socialEventDetails.endDate,
                        location: socialEventDetails.location,
                        invitees: socialEventDetails.inviteeIds
                            ? { connect: socialEventDetails.inviteeIds.map((id) => ({ id })) }
                            : undefined,
                    },
                };
            }

            const result = await prisma.item.create({
                data,
                include: { assignment: true, deadline: true, socialEvent: { include: { invitees: true } } },
            });

            return {
                ...result,
                ...result.assignment,
                ...result.deadline,
                ...result.socialEvent,
            };
        },
        createCourse: (_parent, args) => {
            return prisma.course.create({
                data: {
                    name: args.input.name,
                    instructor: args.input.instructor,
                    location: args.input.location,
                    color: args.input.color,
                    recurrence: {
                        create: toRecurrenceCreateData(args.input.recurrence),
                    },
                },
            });
        },
        createDayEntry: async (_parent, args) => {
            const result = await prisma.dayEntry.create({
                data: {
                    date: args.input.date,
                    mood: args.input.mood,
                    photo: args.input.photo,
                    ...(args.input.songInfo && {
                        songInfo: { create: args.input.songInfo },
                    }),
                },
                include: { songInfo: true },
            });

            return {
                ...result,
                songOfTheDay: result.songInfo,
            };
        },
        createWeeklyRecap: async (_parent, args) => {
            const result = await prisma.weeklyRecap.create({
                data: {
                    weekStartDate: args.input.weekStartDate,
                    moodTrend: args.input.moodTrend,
                    completionRate: args.input.completionRate,
                    highlightPhoto: args.input.highlightPhoto,
                    ...(args.input.songInfo && {
                        songInfo: { create: args.input.songInfo },
                    }),
                },
                include: { songInfo: true },
            });

            return {
                ...result,
                topSong: result.songInfo,
            };
        },
        completeHabit: async (_parent, args) => {
            const habit = await prisma.habit.findUnique({
                where: { id: args.habitId },
            });

            const newCurrentStreak = habit.currentStreak + 1;
            const newLongestStreak = Math.max(newCurrentStreak, habit.longestStreak);

            return prisma.habit.update({
                where: { id: args.habitId },
                data: {
                    currentStreak: newCurrentStreak,
                    longestStreak: newLongestStreak,
                    completions: {
                        create: { completedAt: new Date() },
                    },
                },
            });
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

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
    context: async ({ req }) => {
        const authHeader = req.headers.authorization;
        const providedKey = authHeader?.replace('Bearer ', '');

        if (providedKey !== process.env.API_KEY) {
            throw new Error('Unauthorized: invalid or missing API key');
        }

        return {};
    },
});

console.log(`Server running at ${url}`);