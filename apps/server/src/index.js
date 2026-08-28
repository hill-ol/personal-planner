import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import pkg from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';
import { timingSafeEqual } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const { PrismaClient } = pkg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error('API_KEY is not set. Refusing to start with authentication disabled.');
}

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const typeDefsArray = loadFilesSync(path.join(__dirname, '../schema'), {
    extensions: ['graphql'],
});

const typeDefs = mergeTypeDefs(typeDefsArray);

function parseIsoDate(value, typeName) {
    if (typeof value !== 'string') {
        throw new GraphQLError(`${typeName} must be an ISO-8601 string.`, {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new GraphQLError(`${typeName} cannot represent an invalid date: ${value}`, {
            extensions: { code: 'BAD_USER_INPUT' },
        });
    }
    return date;
}

function isoScalar(name, description) {
    return new GraphQLScalarType({
        name,
        description,
        serialize(value) {
            const date = value instanceof Date ? value : new Date(value);
            if (Number.isNaN(date.getTime())) {
                throw new GraphQLError(`${name} cannot serialize an invalid date: ${value}`);
            }
            return date.toISOString();
        },
        parseValue(value) {
            return parseIsoDate(value, name);
        },
        parseLiteral(ast) {
            if (ast.kind !== Kind.STRING) {
                throw new GraphQLError(`${name} must be an ISO-8601 string.`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            return parseIsoDate(ast.value, name);
        },
    });
}

function notFound(what, id) {
    return new GraphQLError(`${what} not found: ${id}`, {
        extensions: { code: 'NOT_FOUND', http: { status: 404 } },
    });
}

function missingDetails(type, field) {
    return new GraphQLError(`\`${field}\` is required when type is ${type}.`, {
        extensions: { code: 'BAD_USER_INPUT', http: { status: 400 } },
    });
}

function toRecurrenceCreateData(recurrenceInput) {
    return {
        ...recurrenceInput,
        daysOfWeek: recurrenceInput.daysOfWeek
            ? JSON.stringify(recurrenceInput.daysOfWeek)
            : null,
    };
}

const ITEM_INCLUDE = {
    assignment: true,
    deadline: true,
    socialEvent: { include: { invitees: true } },
    recurrence: true,
};

// A Task has no subtype row, so its spreads are no-ops and nothing extra is added.
function flattenItem(item) {
    return { ...item, ...item.assignment, ...item.deadline, ...item.socialEvent };
}

// Subtype tables carry only their own columns, so the base Item fields
// (name/startDate/status/...) have to be merged back in.
function flattenSubtype(row) {
    return { ...row.item, ...row };
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// One calendar day == one completion, so completeHabit and logHabitProgress
// converge on the same row instead of each writing a distinct timestamp.
function toDayKey(value) {
    const date = value instanceof Date ? value : new Date(value);
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function completionQualifies(completion, targetQuantity) {
    if (targetQuantity == null) return true;
    return completion.quantity != null && completion.quantity >= targetQuantity;
}

// How many days may separate two completions before the streak breaks.
// MONTHLY is approximated at 30 days. Accepted limitation: real calendar-month
// arithmetic would only shift a MONTHLY streak by a day or so around month
// boundaries. DAILY and WEEKLY -- everything this app actually schedules -- are exact.
function periodLengthInDays(recurrence) {
    const interval = recurrence?.interval ?? 1;
    switch (recurrence?.frequency) {
        case 'WEEKLY':
            return 7 * interval;
        case 'MONTHLY':
            return 30 * interval;
        default:
            return interval;
    }
}

// Derived from the full completion history rather than incremented, so
// double-logging cannot inflate a streak and a missed period breaks it.
function computeStreaks(habit) {
    const period = periodLengthInDays(habit.recurrence);
    const days = [
        ...new Set(
            habit.completions
                .filter((completion) => completionQualifies(completion, habit.targetQuantity))
                .map((completion) => toDayKey(completion.completedAt).getTime())
        ),
    ].sort((a, b) => b - a);

    if (days.length === 0) return { currentStreak: 0, longestStreak: 0 };

    let longestStreak = 1;
    let currentStreak = 1;
    let run = 1;
    let stillCurrent = true;

    for (let i = 1; i < days.length; i += 1) {
        const gapInDays = (days[i - 1] - days[i]) / MS_PER_DAY;
        if (gapInDays <= period) {
            run += 1;
            if (stillCurrent) currentStreak = run;
        } else {
            run = 1;
            stillCurrent = false;
        }
        longestStreak = Math.max(longestStreak, run);
    }

    return { currentStreak, longestStreak };
}

// The stored currentStreak is only correct as of the last write. Between writes
// a streak can lapse purely through inactivity, so it is re-checked on read:
// if the newest completion is older than one full period, the run is over.
// A lapse within the period is not a break -- with DAILY, a completion yesterday
// still counts today, because today is not over yet.
function effectiveCurrentStreak(habit, now = new Date()) {
    // Fall back to the stored value if the caller did not load completions.
    if (!Array.isArray(habit.completions)) return habit.currentStreak;

    const qualifying = habit.completions.filter((completion) =>
        completionQualifies(completion, habit.targetQuantity)
    );
    if (qualifying.length === 0) return 0;

    const newestDay = Math.max(
        ...qualifying.map((completion) => toDayKey(completion.completedAt).getTime())
    );
    const daysSince = (toDayKey(now).getTime() - newestDay) / MS_PER_DAY;

    if (daysSince > periodLengthInDays(habit.recurrence)) return 0;

    return computeStreaks(habit).currentStreak;
}

async function syncHabitStreaks(habitId) {
    const habit = await prisma.habit.findUnique({
        where: { id: habitId },
        include: { recurrence: true, completions: true },
    });
    if (!habit) throw notFound('Habit', habitId);

    const { currentStreak, longestStreak } = computeStreaks(habit);

    return prisma.habit.update({
        where: { id: habitId },
        data: { currentStreak, longestStreak },
        include: { recurrence: true, completions: true },
    });
}

const resolvers = {
    DateTime: isoScalar('DateTime', 'An ISO-8601 date-time string.'),
    Time: isoScalar('Time', 'An ISO-8601 date-time string carrying a time of day.'),
    Query: {
        habits: () => prisma.habit.findMany({ include: { recurrence: true, completions: true } }),
        courses: () => prisma.course.findMany({ include: { recurrence: true } }),
        persons: () => prisma.person.findMany(),
        dayEntries: () => prisma.dayEntry.findMany({ include: { songInfo: true } }),
        weeklyRecaps: () =>
            prisma.weeklyRecap.findMany({ include: { songInfo: true, highlights: true } }),
        achievements: () => prisma.achievement.findMany(),
        assignments: async () => {
            const rows = await prisma.assignment.findMany({
                include: { item: { include: { recurrence: true } } },
            });
            return rows.map(flattenSubtype);
        },
        deadlines: async () => {
            const rows = await prisma.deadline.findMany({
                include: { item: { include: { recurrence: true } } },
            });
            return rows.map(flattenSubtype);
        },
        socialEvents: async () => {
            const rows = await prisma.socialEvent.findMany({
                include: { item: { include: { recurrence: true } }, invitees: true },
            });
            return rows.map(flattenSubtype);
        },
        items: async () => {
            const items = await prisma.item.findMany({ include: ITEM_INCLUDE });
            return items.map(flattenItem);
        },
        itemsForDateRange: async (_parent, args) => {
            const items = await prisma.item.findMany({
                where: {
                    OR: [
                        { startDate: { gte: args.startDate, lte: args.endDate } },
                        // Multi-day events that overlap the window without starting inside it.
                        {
                            startDate: { lt: args.startDate },
                            socialEvent: { endDate: { gte: args.startDate } },
                        },
                    ],
                },
                include: ITEM_INCLUDE,
            });

            return items.map(flattenItem);
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
                include: { recurrence: true, completions: true },
            });
        },
        createItem: async (_parent, args) => {
            const { type, assignmentDetails, deadlineDetails, socialEventDetails, recurrence, ...itemFields } = args.input;

            const data = {
                ...itemFields,
                type,
                ...(recurrence && { recurrence: { create: toRecurrenceCreateData(recurrence) } }),
            };

            if (type === 'ASSIGNMENT') {
                if (!assignmentDetails) throw missingDetails(type, 'assignmentDetails');
                data.assignment = { create: assignmentDetails };
            } else if (type === 'DEADLINE') {
                if (!deadlineDetails) throw missingDetails(type, 'deadlineDetails');
                data.deadline = { create: deadlineDetails };
            } else if (type === 'SOCIAL_EVENT') {
                if (!socialEventDetails) throw missingDetails(type, 'socialEventDetails');
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
            // TASK has no subtype relation -- the base Item row is the whole record.

            const result = await prisma.item.create({
                data,
                include: ITEM_INCLUDE,
            });

            return flattenItem(result);
        },
        createCourse: (_parent, args) => {
            return prisma.course.create({
                data: {
                    name: args.input.name,
                    instructor: args.input.instructor,
                    location: args.input.location,
                    icon: args.input.icon,
                    recurrence: {
                        create: toRecurrenceCreateData(args.input.recurrence),
                    },
                },
                include: { recurrence: true },
            });
        },
        createDayEntry: (_parent, args) => {
            return prisma.dayEntry.create({
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
        },
        createWeeklyRecap: (_parent, args) => {
            return prisma.weeklyRecap.create({
                data: {
                    weekStartDate: args.input.weekStartDate,
                    moodTrend: args.input.moodTrend,
                    completionRate: args.input.completionRate,
                    tasksCompletedCount: args.input.tasksCompletedCount,
                    highlightPhoto: args.input.highlightPhoto,
                    ...(args.input.songInfo && {
                        songInfo: { create: args.input.songInfo },
                    }),
                    ...(args.input.highlights && {
                        highlights: { create: args.input.highlights },
                    }),
                },
                include: { songInfo: true, highlights: true },
            });
        },
        completeHabit: async (_parent, args) => {
            const habit = await prisma.habit.findUnique({ where: { id: args.habitId } });
            if (!habit) throw notFound('Habit', args.habitId);

            const completedAt = toDayKey(new Date());

            // Marking a quantity-tracked habit complete means it hit its target.
            await prisma.habitCompletion.upsert({
                where: {
                    habitId_completedAt: { habitId: args.habitId, completedAt },
                },
                update: { quantity: habit.targetQuantity },
                create: { habitId: args.habitId, completedAt, quantity: habit.targetQuantity },
            });

            return syncHabitStreaks(args.habitId);
        },
        updateItemStatus: async (_parent, args) => {
            const existing = await prisma.item.findUnique({ where: { id: args.id } });
            if (!existing) throw notFound('Item', args.id);

            const result = await prisma.item.update({
                where: { id: args.id },
                data: { status: args.status },
                include: ITEM_INCLUDE,
            });

            return flattenItem(result);
        },
        deleteItem: async (_parent, args) => {
            const item = await prisma.item.findUnique({ where: { id: args.id } });
            if (!item) return false;

            await prisma.$transaction(async (tx) => {
                await tx.item.delete({ where: { id: args.id } });
                // Item.recurrenceId is SET NULL on delete, so the row would otherwise linger.
                if (item.recurrenceId) {
                    await tx.recurrence.delete({ where: { id: item.recurrenceId } });
                }
            });

            return true;
        },
        logHabitProgress: async (_parent, args) => {
            const habit = await prisma.habit.findUnique({ where: { id: args.habitId } });
            if (!habit) throw notFound('Habit', args.habitId);

            const completedAt = toDayKey(args.date);

            await prisma.habitCompletion.upsert({
                where: {
                    habitId_completedAt: { habitId: args.habitId, completedAt },
                },
                update: { quantity: args.quantity },
                create: { habitId: args.habitId, completedAt, quantity: args.quantity },
            });

            return syncHabitStreaks(args.habitId);
        },
    },
    Item: {
        __resolveType(item) {
            if (item.type === 'ASSIGNMENT') return 'Assignment';
            if (item.type === 'DEADLINE') return 'Deadline';
            if (item.type === 'SOCIAL_EVENT') return 'SocialEvent';
            if (item.type === 'TASK') return 'Task';
            return null;
        },
    },
    Habit: {
        // Read-time correction. Deliberately does not write the corrected value
        // back -- reads stay side-effect free, and the stored column re-syncs on
        // the next completeHabit/logHabitProgress.
        currentStreak: (habit) => effectiveCurrentStreak(habit),
    },
    Recurrence: {
        // Stored as a JSON string because SQLite has no array type.
        daysOfWeek: (recurrence) =>
            recurrence.daysOfWeek ? JSON.parse(recurrence.daysOfWeek) : null,
    },
    DayEntry: {
        songOfTheDay: (dayEntry) => dayEntry.songInfo ?? null,
    },
    WeeklyRecap: {
        topSong: (weeklyRecap) => weeklyRecap.songInfo ?? null,
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
});

function keysMatch(provided, expected) {
    const providedBuffer = Buffer.from(provided, 'utf8');
    const expectedBuffer = Buffer.from(expected, 'utf8');
    if (providedBuffer.length !== expectedBuffer.length) return false;
    return timingSafeEqual(providedBuffer, expectedBuffer);
}

const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
    context: async ({ req }) => {
        const authHeader = req.headers.authorization ?? '';
        const [scheme, ...rest] = authHeader.split(' ');
        const providedKey = scheme.toLowerCase() === 'bearer' ? rest.join(' ') : null;

        if (providedKey === null || !keysMatch(providedKey, API_KEY)) {
            throw new GraphQLError('Unauthorized: invalid or missing API key', {
                extensions: { code: 'UNAUTHENTICATED', http: { status: 401 } },
            });
        }

        return {};
    },
});

console.log(`Server running at ${url}`);
