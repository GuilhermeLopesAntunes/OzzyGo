import { pgEnum } from "drizzle-orm/pg-core";
import { 
    pgTable, 
    text, 
    timestamp, 
    boolean, 
    uuid, 
    integer, 
    doublePrecision, 
    primaryKey 
} from "drizzle-orm/pg-core";

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

export const schools = pgTable("schools", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull().unique(), 
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const classrooms = pgTable("classrooms", {
    id: uuid("id").defaultRandom().primaryKey(),
    schoolId: uuid("school_id")
        .notNull()
        .references(() => schools.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        code: text("code").notNull().unique(),
        active: boolean("active").default(true).notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
    });

export const students = pgTable("students", {
    id: uuid('student_id')
        .notNull() 
        .references(() => users.id, { onDelete: "cascade" }),
    level: integer("level").default(1).notNull(),
    currentXp: integer("current_xp").default(0).notNull(), 
    totalXp: integer("total_xp").default(0).notNull(),
    levelProgress: doublePrecision("level_progress").default(0).notNull(),
    rank: integer("rank"),
    ruby: integer("ruby").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
  
    return {
        pk: primaryKey({ columns: [table.id] }) 
    };
});
export const professors = pgTable("professors", {
    id: uuid('professor_id')
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    specialization: text("specialization"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.id] })
    };
});

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert