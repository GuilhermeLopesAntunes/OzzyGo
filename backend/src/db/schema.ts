import {
    pgTable,
    numeric,
    text,
    timestamp,
    uuid,
    pgEnum,
    boolean
} from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role", ["student", "professor"])

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    username: text("username").notNull(),
    role: userRoleEnum('role').notNull().default("student"),
    isVerified: boolean('is_verified').notNull().default(false),
    verificationToken: text("verificationToken"),
    verificationTokenExpiresAt: timestamp('verification_token_expires_at'),
    resetToken: text("reset_token"),
    resetTokenExpiresAt: timestamp("reset_token_expires_at"),
    refreshTokenHash: text('refresh_token_hash'),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});


export const students = pgTable("studets", {
    id: uuid('student_id')
        .notNull()
        .references(() => users.id, {onDelete: "cascade"}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export const professors = pgTable("professors", {
    id: uuid('professor_id')
        .notNull()
        .references(() => users.id, {onDelete: "cascade"}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert