import {
	pgTable,
	serial,
	varchar,
	text,
	timestamp,
	integer,
	uuid,
	bigint,
	index
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 100 }),
	email: varchar("email", { length: 255 }).notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	role: varchar("role", { length: 20 }).notNull().default("member"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	deletedAt: timestamp("deleted_at"),
});

export const assets = pgTable("assets", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	assetTag: varchar("asset_tag", { length: 255 }).notNull(),
	idSnipeit: integer('idSnipeit'),
	serialNumber: varchar("serial_number", { length: 100 }),
	modelNumber: varchar("model_number", { length: 100 }),
	category: varchar("category", { length: 100 }),
	status: varchar("status", { length: 100 }),
	image: varchar("image", { length: 255 }),
	qr: varchar("qr", { length: 255 }),
	location: varchar("location", { length: 100 }),
	shelf: varchar("shelf", { length: 100 }),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
},
	(table) => ({
		trigramIndex: index('trigram_index').using(
			'gin',
			sql`
		${table.name} gin_trgm_ops,
		${table.assetTag} gin_trgm_ops,
		${table.serialNumber} gin_trgm_ops,
		${table.modelNumber} gin_trgm_ops
	  `
		),
	}),
);


export const bookings = pgTable("bookings", {
	id: uuid("id").defaultRandom().primaryKey(),
	description: varchar("description", { length: 255 }).notNull(),
	project: varchar("project", { length: 255 }).notNull(),
	location: text("location"),
	notes: varchar("notes", { length: 255 }),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	assetId: uuid("asset_id")
		.notNull()
		.references(() => assets.id, { onDelete: 'cascade' }),
	start: timestamp("start_at").notNull(),
	end: timestamp("end_at").notNull(),
	checkin: timestamp("checkin_at"),
	checkout: timestamp("checkout_at"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const teams = pgTable("teams", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 100 }).notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	planName: varchar("plan_name", { length: 50 }),
	subscriptionStatus: varchar("subscription_status", { length: 20 }),
});

export const teamMembers = pgTable("team_members", {
	id: serial("id").primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	teamId: integer("team_id")
		.notNull()
		.references(() => teams.id),
	role: varchar("role", { length: 50 }).notNull(),
	joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
	id: serial("id").primaryKey(),
	teamId: integer("team_id")
		.notNull()
		.references(() => teams.id),
	userId: uuid("user_id").references(() => users.id),
	action: text("action").notNull(),
	timestamp: timestamp("timestamp").notNull().defaultNow(),
	ipAddress: varchar("ip_address", { length: 45 }),
});

export const invitations = pgTable("invitations", {
	id: serial("id").primaryKey(),
	teamId: integer("team_id")
		.notNull()
		.references(() => teams.id),
	email: varchar("email", { length: 255 }).notNull(),
	role: varchar("role", { length: 50 }).notNull(),
	invitedBy: uuid("invited_by")
		.notNull()
		.references(() => users.id),
	invitedAt: timestamp("invited_at").notNull().defaultNow(),
	status: varchar("status", { length: 20 }).notNull().default("pending"),
});

export const teamsRelations = relations(teams, ({ many }) => ({
	teamMembers: many(teamMembers),
	activityLogs: many(activityLogs),
	invitations: many(invitations),
}));

export const usersRelations = relations(users, ({ many }) => ({
	teamMembers: many(teamMembers),
	invitationsSent: many(invitations),
	bookings: many(bookings),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
	team: one(teams, {
		fields: [invitations.teamId],
		references: [teams.id],
	}),
	invitedBy: one(users, {
		fields: [invitations.invitedBy],
		references: [users.id],
	}),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
	user: one(users, {
		fields: [teamMembers.userId],
		references: [users.id],
	}),
	team: one(teams, {
		fields: [teamMembers.teamId],
		references: [teams.id],
	}),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
	team: one(teams, {
		fields: [activityLogs.teamId],
		references: [teams.id],
	}),
	user: one(users, {
		fields: [activityLogs.userId],
		references: [users.id],
	}),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
	user: one(users, {
		fields: [bookings.userId],
		references: [users.id],
	}),
	asset: one(assets, {
		fields: [bookings.assetId],
		references: [assets.id],
	}),
}));

export const assetRelations = relations(assets, ({ many }) => ({
	bookings: many(bookings),
}));


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;

export type TeamDataWithMembers = Team & {
	teamMembers: (TeamMember & {
		user: Pick<User, "id" | "name" | "email">;
	})[];
};

export enum ActivityType {
	SIGN_UP = "SIGN_UP",
	SIGN_IN = "SIGN_IN",
	SIGN_OUT = "SIGN_OUT",
	UPDATE_PASSWORD = "UPDATE_PASSWORD",
	DELETE_ACCOUNT = "DELETE_ACCOUNT",
	UPDATE_ACCOUNT = "UPDATE_ACCOUNT",
	CREATE_TEAM = "CREATE_TEAM",
	REMOVE_TEAM_MEMBER = "REMOVE_TEAM_MEMBER",
	INVITE_TEAM_MEMBER = "INVITE_TEAM_MEMBER",
	ACCEPT_INVITATION = "ACCEPT_INVITATION",
	ADD_PODCAST = "ADD_PODCAST",
	DELETE_PODCAST = "DELETE_PODCAST",
	EDIT_PODCAST = "EDIT_PODCAST",
}
