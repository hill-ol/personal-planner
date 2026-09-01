export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  Time: { input: string; output: string; }
};

export type Achievement = {
  __typename?: 'Achievement';
  earnedAt: Scalars['DateTime']['output'];
  habitId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  type: AchievementType;
};

export type AchievementType =
  | 'EARLY_BIRD'
  | 'PERFECT_WEEK'
  | 'SEVEN_DAY_STREAK'
  | 'THIRTY_DAY_STREAK';

export type Assignment = Item & {
  __typename?: 'Assignment';
  assignmentType: AssignmentType;
  courseId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recurrence?: Maybe<Recurrence>;
  startDate: Scalars['DateTime']['output'];
  status: ItemStatus;
  time?: Maybe<Scalars['Time']['output']>;
};

export type AssignmentType =
  | 'EXAM'
  | 'HOMEWORK'
  | 'OTHER'
  | 'PROJECT'
  | 'QUIZ';

export type Course = {
  __typename?: 'Course';
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  instructor?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  recurrence: Recurrence;
};

export type CreateAssignmentDetailsInput = {
  assignmentType: AssignmentType;
  courseId?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateCourseInput = {
  icon: Scalars['String']['input'];
  instructor?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  recurrence: CreateRecurrenceInput;
};

export type CreateDayEntryInput = {
  date: Scalars['DateTime']['input'];
  mood?: InputMaybe<Mood>;
  photo?: InputMaybe<Scalars['String']['input']>;
  songInfo?: InputMaybe<CreateSongInfoInput>;
};

export type CreateDeadlineDetailsInput = {
  category: DeadlineCategory;
};

export type CreateHabitInput = {
  name: Scalars['String']['input'];
  recurrence: CreateRecurrenceInput;
};

export type CreateHighlightInput = {
  detail?: InputMaybe<Scalars['String']['input']>;
  icon: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateItemInput = {
  assignmentDetails?: InputMaybe<CreateAssignmentDetailsInput>;
  deadlineDetails?: InputMaybe<CreateDeadlineDetailsInput>;
  name: Scalars['String']['input'];
  recurrence?: InputMaybe<CreateRecurrenceInput>;
  socialEventDetails?: InputMaybe<CreateSocialEventDetailsInput>;
  startDate: Scalars['DateTime']['input'];
  status: ItemStatus;
  time?: InputMaybe<Scalars['DateTime']['input']>;
  type: ItemType;
};

export type CreatePersonInput = {
  name: Scalars['String']['input'];
};

export type CreateRecurrenceInput = {
  daysOfWeek?: InputMaybe<Array<Weekday>>;
  endCondition: RecurrenceEndCondition;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  frequency: RecurrenceFrequency;
  interval: Scalars['Int']['input'];
  occurrenceCount?: InputMaybe<Scalars['Int']['input']>;
  time?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CreateSocialEventDetailsInput = {
  endDate: Scalars['DateTime']['input'];
  inviteeIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  location?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSongInfoInput = {
  albumArtUrl?: InputMaybe<Scalars['String']['input']>;
  artist: Scalars['String']['input'];
  spotifyId: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateWeeklyRecapInput = {
  completionRate: Scalars['Float']['input'];
  highlightPhoto?: InputMaybe<Scalars['String']['input']>;
  highlights?: InputMaybe<Array<CreateHighlightInput>>;
  moodTrend?: InputMaybe<Mood>;
  songInfo?: InputMaybe<CreateSongInfoInput>;
  tasksCompletedCount: Scalars['Int']['input'];
  weekStartDate: Scalars['DateTime']['input'];
};

export type DayEntry = {
  __typename?: 'DayEntry';
  date: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  mood?: Maybe<Mood>;
  photo?: Maybe<Scalars['String']['output']>;
  songOfTheDay?: Maybe<SongInfo>;
};

export type Deadline = Item & {
  __typename?: 'Deadline';
  category: DeadlineCategory;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recurrence?: Maybe<Recurrence>;
  startDate: Scalars['DateTime']['output'];
  status: ItemStatus;
  time?: Maybe<Scalars['Time']['output']>;
};

export type DeadlineCategory =
  | 'CLASS'
  | 'OTHER'
  | 'PERSONAL'
  | 'WORK';

export type Habit = {
  __typename?: 'Habit';
  completions: Array<HabitCompletion>;
  currentStreak: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  longestStreak: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  recurrence: Recurrence;
};

export type HabitCompletion = {
  __typename?: 'HabitCompletion';
  completedAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
};

export type Highlight = {
  __typename?: 'Highlight';
  detail?: Maybe<Scalars['String']['output']>;
  icon: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type Item = {
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recurrence?: Maybe<Recurrence>;
  startDate: Scalars['DateTime']['output'];
  status: ItemStatus;
  time?: Maybe<Scalars['Time']['output']>;
};

export type ItemStatus =
  | 'DONE'
  | 'PENDING';

export type ItemType =
  | 'ASSIGNMENT'
  | 'DEADLINE'
  | 'SOCIAL_EVENT'
  | 'TASK';

export type Mood =
  | 'GOOD'
  | 'GREAT'
  | 'NEUTRAL'
  | 'SAD'
  | 'STRESSED'
  | 'TIRED';

export type Mutation = {
  __typename?: 'Mutation';
  completeHabit: Habit;
  createCourse: Course;
  createDayEntry: DayEntry;
  createHabit: Habit;
  createItem: Item;
  createPerson: Person;
  createWeeklyRecap: WeeklyRecap;
  deleteItem: Scalars['Boolean']['output'];
  logHabitProgress: Habit;
  updateItemStatus: Item;
};


export type MutationCompleteHabitArgs = {
  habitId: Scalars['ID']['input'];
};


export type MutationCreateCourseArgs = {
  input: CreateCourseInput;
};


export type MutationCreateDayEntryArgs = {
  input: CreateDayEntryInput;
};


export type MutationCreateHabitArgs = {
  input: CreateHabitInput;
};


export type MutationCreateItemArgs = {
  input: CreateItemInput;
};


export type MutationCreatePersonArgs = {
  input: CreatePersonInput;
};


export type MutationCreateWeeklyRecapArgs = {
  input: CreateWeeklyRecapInput;
};


export type MutationDeleteItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationLogHabitProgressArgs = {
  date: Scalars['DateTime']['input'];
  habitId: Scalars['ID']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateItemStatusArgs = {
  id: Scalars['ID']['input'];
  status: ItemStatus;
};

export type Person = {
  __typename?: 'Person';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  achievements: Array<Achievement>;
  assignments: Array<Assignment>;
  courses: Array<Course>;
  dayEntries: Array<DayEntry>;
  deadlines: Array<Deadline>;
  habits: Array<Habit>;
  items: Array<Item>;
  itemsForDateRange: Array<Item>;
  persons: Array<Person>;
  socialEvents: Array<SocialEvent>;
  weeklyRecaps: Array<WeeklyRecap>;
};


export type QueryItemsForDateRangeArgs = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type Recurrence = {
  __typename?: 'Recurrence';
  daysOfWeek?: Maybe<Array<Weekday>>;
  endCondition: RecurrenceEndCondition;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  frequency: RecurrenceFrequency;
  interval: Scalars['Int']['output'];
  occurrenceCount?: Maybe<Scalars['Int']['output']>;
  time?: Maybe<Scalars['Time']['output']>;
};

export type RecurrenceEndCondition =
  | 'AFTER_N_OCCURRENCES'
  | 'NEVER'
  | 'ON_DATE';

export type RecurrenceFrequency =
  | 'DAILY'
  | 'MONTHLY'
  | 'WEEKLY';

export type SocialEvent = Item & {
  __typename?: 'SocialEvent';
  endDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  invitees?: Maybe<Array<Person>>;
  location?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  recurrence?: Maybe<Recurrence>;
  startDate: Scalars['DateTime']['output'];
  status: ItemStatus;
  time?: Maybe<Scalars['Time']['output']>;
};

export type SongInfo = {
  __typename?: 'SongInfo';
  albumArtUrl?: Maybe<Scalars['String']['output']>;
  artist: Scalars['String']['output'];
  spotifyId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Task = Item & {
  __typename?: 'Task';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recurrence?: Maybe<Recurrence>;
  startDate: Scalars['DateTime']['output'];
  status: ItemStatus;
  time?: Maybe<Scalars['Time']['output']>;
};

export type Weekday =
  | 'FRIDAY'
  | 'MONDAY'
  | 'SATURDAY'
  | 'SUNDAY'
  | 'THURSDAY'
  | 'TUESDAY'
  | 'WEDNESDAY';

export type WeeklyRecap = {
  __typename?: 'WeeklyRecap';
  completionRate: Scalars['Float']['output'];
  highlightPhoto?: Maybe<Scalars['String']['output']>;
  highlights: Array<Highlight>;
  id: Scalars['ID']['output'];
  moodTrend?: Maybe<Mood>;
  tasksCompletedCount: Scalars['Int']['output'];
  topSong?: Maybe<SongInfo>;
  weekStartDate: Scalars['DateTime']['output'];
};
