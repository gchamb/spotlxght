import { relations, sql } from "drizzle-orm";
import {
  bigint,
  index,
  int,
  mysqlTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `underground_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 191 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique().notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  password: varchar("password", { length: 255 }),
  location: varchar("location", { length: 255 }),
  profilePicImage: varchar("profilePicImage", { length: 255 }),
  profileBannerImage: varchar("profilePicImage", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  reviews: many(reviews),
  assets: many(assets),
  applications: many(applications),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 191 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const reviews = createTable(
  "review",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    reviewer: varchar("id", { length: 191 })
      .notNull()
      .references(() => users.id),
    message: varchar("message", { length: 255 }),
    reviewedAt: timestamp("reviewedAt", { mode: "date" }).notNull(),
    rate: int("rate").notNull(),
    userId: varchar("userId", { length: 191 })
      .notNull()
      .references(() => users.id),
  },
  (review) => ({
    userIdIdx: index("reviews_userId_idx").on(review.userId),
  }),
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const assets = createTable(
  "asset",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    type: varchar("type", { length: 25 }).notNull(),
    mimetype: varchar("mimetype", { length: 25 }).notNull(),
    azureBlobKey: varchar("azureBlobKey", { length: 191 }).notNull(),
    uploadedAt: timestamp("uploadedAt", { mode: "date" }).notNull(),
    userId: varchar("userId", { length: 191 })
      .notNull()
      .references(() => users.id),
  },
  (asset) => ({
    userIdIdx: index("assets_userId_idx").on(asset.userId),
  }),
);

export const assetsRelations = relations(assets, ({ one }) => ({
  user: one(users, { fields: [assets.userId], references: [users.id] }),
}));

export const events = createTable(
  "event",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    status: int("mimetype").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
    venueId: varchar("venueId", { length: 191 })
      .notNull()
      .references(() => users.id),
  },
  (event) => ({
    userIdIdx: index("events_userId_idx").on(event.venueId),
  }),
);

export const eventsRelations = relations(events, ({ one, many }) => ({
  user: one(users, { fields: [events.venueId], references: [users.id] }),
  timeslots: many(timeslots),
  applications: many(applications),
}));

export const timeslots = createTable(
  "timeslot",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    startDate: timestamp("startDate", { mode: "date" }).notNull(),
    endDate: timestamp("endDate", { mode: "date" }).notNull(),
    timezone: varchar("timezone", { length: 5 }).default("CST").notNull(),
    eventId: varchar("eventId", { length: 191 })
      .notNull()
      .references(() => events.id),
  },
  (timeslot) => ({
    eventIdIdx: index("events_userId_idx").on(timeslot.eventId),
  }),
);

export const timeslotsRelations = relations(timeslots, ({ one }) => ({
  event: one(events, { fields: [timeslots.eventId], references: [events.id] }),
}));

export const applications = createTable(
  "application",
  {
    id: varchar("id", { length: 191 }).notNull().primaryKey(),
    timeslotId: varchar("timeslotId", { length: 191 }).notNull(),
    eventId: varchar("eventId", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    status: int("status").notNull(),
    appliedAt: timestamp("endDate", { mode: "date" }).notNull(),
  },
  (application) => ({
    userIdIdx: index("application_userId_idx").on(application.userId),
    eventIdIdx: index("application_eventId_idx").on(application.eventId),
    timeslotIdIdx: index("application_timeslotId_idx").on(
      application.timeslotId,
    ),
  }),
);

export const applicantsRelations = relations(applications, ({ one, many }) => ({
  timeslot: one(timeslots, {
    fields: [applications.timeslotId],
    references: [timeslots.id],
  }),
  user: one(users, { fields: [applications.userId], references: [users.id] }),
  event: one(events, {
    fields: [applications.eventId],
    references: [events.id],
  }),
}));
