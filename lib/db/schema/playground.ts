import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const snippetsTable = sqliteTable("snippets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull().default("Sem título"),
  html: text("html").notNull().default(""),
  css: text("css").notNull().default(""),
  js: text("js").notNull().default(""),
  mode: text("mode").notNull().default("html"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export type Snippet = typeof snippetsTable.$inferSelect;
