"use server";

import { z } from "zod";
import { and, eq, gte, lte, or } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
    ActivityType,
    bookings,
    type NewBooking,
} from "@/lib/db/schema";

import { getUserWithTeam } from "@/lib/db/queries";
import { validatedActionWithUser } from "@/lib/auth/middleware";
import { logActivity } from "@/app/(login)/actions";
import { redirect } from "next/navigation";

const addBookingSchema = z.object({
    description: z.string().max(255),
    project: z.string().max(100),
    start: z.coerce.date(),
    end: z.coerce.date(),
    assetId: z.string(),
});


export const addBooking = validatedActionWithUser(
    addBookingSchema,
    async (data, _, user) => {
        const { description, project, start, end, assetId } = data;
        const userWithTeam = await getUserWithTeam(user.id);

        const existingBooking = await db
            .select()
            .from(bookings)
            .where(
                and(
                    eq(bookings.assetId, assetId),
                    or(
                        and(eq(bookings.start, start), eq(bookings.end, end)),
                        and(gte(bookings.start, start), lte(bookings.start, end)),
                        and(gte(bookings.end, start), lte(bookings.end, end))
                    )
                )
            )

        if (existingBooking.length > 0) {
            return { error: "Asset is already booked for the selected dates." };
        }

        const bookingData: NewBooking = {
            description,
            project,
            start,
            end,
            assetId,
            userId: user.id
        };


        const [newBooking] = await db.insert(bookings).values(bookingData).returning({ id: bookings.id });

        await logActivity(userWithTeam?.teamId, user.id, ActivityType.ADD_PODCAST);

        redirect("/dashboard");
        // return { success: "Booking added successfully" };

    },
);


const deleteBookingschema = z.object({
    bookingId: z.string(),
});

export const deleteBooking = validatedActionWithUser(
    deleteBookingschema,
    async (data, _, user) => {
        const { bookingId } = data;
        const userWithTeam = await getUserWithTeam(user.id);

        // Delete the booking
        await db
            .delete(bookings)
            .where(
                and(
                    eq(bookings.id, bookingId),
                    eq(bookings.userId, user.id)
                )
            );

        await logActivity(userWithTeam?.teamId, user.id, ActivityType.DELETE_PODCAST);

        return { success: "Booking deleted successfully" };
    }
);

const editbookingschema = z.object({
    description: z.string().max(255),
    project: z.string().max(100),
    start: z.coerce.date(),
    end: z.coerce.date(),
    bookingId: z.string()
});

export const editBooking = validatedActionWithUser(
    editbookingschema,
    async (data, _, user) => {
        const { description, project, start, end, bookingId } = data;
        const userWithTeam = await getUserWithTeam(user.id);

        // Update the booking
        await db
            .update(bookings)
            .set({
                description,
                project,
                start,
                end,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(bookings.id, bookingId),
                    eq(bookings.userId, user.id)
                )
            );

        await logActivity(userWithTeam?.teamId, user.id, ActivityType.EDIT_PODCAST);

        return { success: "Booking updated successfully" };
    }
);