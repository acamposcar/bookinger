import { desc, and, eq, isNull, count, sql, or } from "drizzle-orm";
import { db } from "./drizzle";
import {
	activityLogs,
	assets,
	teamMembers,
	teams,
	users,
	bookings,
} from "./schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";

export async function getUser() {
	const sessionCookie = cookies().get("session");
	if (!sessionCookie || !sessionCookie.value) {
		return null;
	}

	const sessionData = await verifyToken(sessionCookie.value);

	if (
		!sessionData ||
		!sessionData.user ||
		typeof sessionData.user.id !== "string"
	) {
		return null;
	}

	if (new Date(sessionData.expires) < new Date()) {
		return null;
	}
	const user = await db
		.select()
		.from(users)
		.where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
		.limit(1);

	if (user.length === 0) {
		return null;
	}

	return user[0];
}

export async function getUserWithTeam(userId: string) {
	const result = await db
		.select({
			user: users,
			teamId: teamMembers.teamId,
		})
		.from(users)
		.leftJoin(teamMembers, eq(users.id, teamMembers.userId))
		.where(eq(users.id, userId))
		.limit(1);

	return result[0];
}

export async function getActivityLogs() {
	const user = await getUser();
	if (!user) {
		throw new Error("User not authenticated");
	}

	return await db
		.select({
			id: activityLogs.id,
			action: activityLogs.action,
			timestamp: activityLogs.timestamp,
			ipAddress: activityLogs.ipAddress,
			userName: users.name,
		})
		.from(activityLogs)
		.leftJoin(users, eq(activityLogs.userId, users.id))
		.where(eq(activityLogs.userId, user.id))
		.orderBy(desc(activityLogs.timestamp))
		.limit(10);
}

export async function getBookings() {
	const user = await getUser();
	if (!user) {
		throw new Error("User not authenticated");
	}
	return await db.query.bookings.findMany({
		with: {
			asset: true,
			user: true,
		},
		orderBy: (bookings, { asc }) => [asc(bookings.start)],
	});
}

export async function getMyBookings() {
	const user = await getUser();
	if (!user) {
		throw new Error("User not authenticated");
	}
	return await db.query.bookings.findMany({
		with: {
			asset: true,
			user: true,
		},
		where: eq(bookings.userId, user.id),
		orderBy: (bookings, { asc }) => [asc(bookings.start)],
	});
}

export async function getAssetBookings(assetId: string) {
	const user = await getUser();
	if (!user) {
		throw new Error("User not authenticated");
	}
	return await db.query.bookings.findMany({
		with: {
			asset: true,
			user: true,
		},
		where: eq(bookings.assetId, assetId),
		orderBy: (bookings, { asc }) => [asc(bookings.start)],
	});
}

export async function getBooking(bookingId: string) {
	const user = await getUser();
	if (!user) {
		throw new Error("User not authenticated");
	}

	return await db.select().from(bookings).where(eq(bookings.id, bookingId));
}

export async function getAssets() {
	const user = await getUser();
	if (!user) {
		throw new Error("User not authenticated");
	}

	// return await db.select().from(assets).limit(50);

	return await db.query.assets.findMany({
		with: {
			bookings: {
				limit: 10,
				orderBy: (bookings, { asc }) => [asc(bookings.start)],
			},
		},
		orderBy: (assets, { asc }) => [asc(assets.createdAt)],
		limit: 40,
	});
}

export async function searchAsset(query: string) {
	const user = await getUser();
	if (!user) {
		throw new Error("User not authenticated");
	}
	return await db
		.select()
		.from(assets)
		.where(sql`(
      setweight(to_tsvector('english', ${assets.name}), 'A') ||
      setweight(to_tsvector('english', ${assets.assetTag}), 'B') ||
      setweight(to_tsvector('english', ${assets.serialNumber}), 'C') ||
      setweight(to_tsvector('english', ${assets.modelNumber}), 'D'))
      @@ to_tsquery('english', ${query}
    )`);
}

interface SearchOptions {
	searchTerm: string;
	limit?: number;
	minSimilarity?: number;
}

export async function searchAssetsBySimilarity({
	searchTerm,
	limit = 10,
	minSimilarity = 0.3,
}: SearchOptions) {
	const results = await db
		.select()
		.from(assets)
		.where(
			or(
				sql`${assets.name} % ${searchTerm}`,
				sql`${assets.assetTag} % ${searchTerm}`,
				sql`${assets.serialNumber} % ${searchTerm}`,
				sql`${assets.modelNumber} % ${searchTerm}`,
			),
		)
		.limit(limit);

	return results;
}

export async function getAsset(assetId: string) {
	const user = await getUser();
	if (!user) {
		throw new Error("User not authenticated");
	}
	return await db.query.assets.findFirst({
		where: eq(assets.id, assetId),
		with: {
			bookings: {
				with: { user: true },
				limit: 10,
				orderBy: (bookings, { asc }) => [asc(bookings.start)],
			},
		},
	});
	// return await db.select().from(assets).where(and(eq(assets.id, assetId)));
}

export async function getTeamForUser(userId: string) {
	const result = await db.query.users.findFirst({
		where: eq(users.id, userId),
		with: {
			teamMembers: {
				with: {
					team: {
						with: {
							teamMembers: {
								with: {
									user: {
										columns: {
											id: true,
											name: true,
											email: true,
										},
									},
								},
							},
						},
					},
				},
			},
		},
	});

	return result?.teamMembers[0]?.team || null;
}
