import { pgTable, serial, varchar, timestamp, text, jsonb } from 'drizzle-orm/pg-core';

// Users – we store the Clerk user ID for reference
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkId: varchar('clerk_id', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const conversations = pgTable('conversations', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .references(() => users.id)
    .notNull(),
  title: varchar('title', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversationId: serial('conversation_id')
    .references(() => conversations.id)
    .notNull(),
  role: varchar('role', { length: 20 }).notNull(), // 'user' | 'assistant'
  content: text('content').notNull(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
});

export const attachments = pgTable('attachments', {
  id: serial('id').primaryKey(),
  messageId: serial('message_id')
    .references(() => messages.id)
    .notNull(),
  url: varchar('url', { length: 1024 }).notNull(),
  mimeType: varchar('mime_type', { length: 128 }),
  size: serial('size'),
  createdAt: timestamp('created_at').defaultNow(),
});
