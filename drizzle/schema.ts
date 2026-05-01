import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, longtext, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Articles table — single source of truth for every published or queued article.
 * Status workflow: queued → published. Public-facing routes filter status='published'.
 */
export const articles = mysqlTable(
  "articles",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 300 }).notNull(),
    description: varchar("description", { length: 500 }).notNull().default(""),
    body: longtext("body").notNull(),
    tldr: text("tldr"),
    category: varchar("category", { length: 80 }).notNull(),
    tags: json("tags").$type<string[]>().notNull(),
    authorName: varchar("authorName", { length: 80 }).notNull().default("The Oracle Lover"),
    authorCredential: varchar("authorCredential", { length: 200 }).notNull().default(""),
    heroUrl: text("heroUrl"),
    status: mysqlEnum("status", ["queued", "published"]).notNull().default("queued"),
    asinsUsed: json("asinsUsed").$type<string[]>().notNull(),
    wordCount: int("wordCount").notNull().default(0),
    queuedAt: timestamp("queuedAt").defaultNow().notNull(),
    publishedAt: timestamp("publishedAt"),
    lastModifiedAt: timestamp("lastModifiedAt").defaultNow().onUpdateNow().notNull(),
    lastRefreshedAt: timestamp("lastRefreshedAt"),
  },
  (t) => ({
    statusIdx: index("articles_status_idx").on(t.status),
    publishedAtIdx: index("articles_published_at_idx").on(t.publishedAt),
    categoryIdx: index("articles_category_idx").on(t.category),
  }),
);

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Cron run log — tracks every cron invocation so we can prove crons are working
 * and have been working over multiple distinct days.
 */
export const cronRuns = mysqlTable(
  "cron_runs",
  {
    id: int("id").autoincrement().primaryKey(),
    jobName: varchar("jobName", { length: 80 }).notNull(),
    status: mysqlEnum("status", ["success", "skipped", "error"]).notNull(),
    message: text("message"),
    ranAt: timestamp("ranAt").defaultNow().notNull(),
  },
  (t) => ({
    jobNameIdx: index("cron_runs_job_name_idx").on(t.jobName),
    ranAtIdx: index("cron_runs_ran_at_idx").on(t.ranAt),
  }),
);

export type CronRun = typeof cronRuns.$inferSelect;
export type InsertCronRun = typeof cronRuns.$inferInsert;
