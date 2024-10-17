"use server";

import { z } from "zod";
import { and, eq, gte, lte, or } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
    ActivityType,
    assets,
    type NewAsset,
} from "@/lib/db/schema";

import { getUserWithTeam } from "@/lib/db/queries";
import { validatedActionWithUser } from "@/lib/auth/middleware";
import { logActivity } from "@/app/(login)/actions";

const addAssetSchema = z.object({
    name: z.string().max(255),
    assetTag: z.string().max(100),
    serialNumber: z.string().max(100).optional(),

});


export const addAsset = validatedActionWithUser(
    addAssetSchema,
    async (data, _, user) => {
        const { name, assetTag, serialNumber } = data;
        const userWithTeam = await getUserWithTeam(user.id);

        const assetData: NewAsset = {
            name,
            assetTag,
            serialNumber,
        };


        const [newAsset] = await db.insert(assets).values(assetData).returning({ id: assets.id });

        await logActivity(userWithTeam?.teamId, user.id, ActivityType.ADD_PODCAST);

        // redirect("/dashboard");
        return { success: "Asset added successfully" };

    },
);


const deleteAssetschema = z.object({
    assetId: z.string(),
});

export const deleteAsset = validatedActionWithUser(
    deleteAssetschema,
    async (data, _, user) => {
        const { assetId } = data;
        const userWithTeam = await getUserWithTeam(user.id);

        // TODO
        // Only admin

        // Delete the asset
        await db
            .delete(assets)
            .where(
                and(
                    eq(assets.id, assetId),
                )
            );

        await logActivity(userWithTeam?.teamId, user.id, ActivityType.DELETE_PODCAST);

        return { success: "Asset deleted successfully" };
    }
);

const editassetschema = z.object({
    name: z.string().max(255),
    assetTag: z.string().max(100),
    serialNumber: z.string().max(100).optional(),
    assetId: z.string().max(100),
});

export const editAsset = validatedActionWithUser(
    editassetschema,
    async (data, _, user) => {
        const { name, assetTag, serialNumber, assetId } = data;
        const userWithTeam = await getUserWithTeam(user.id);

        // Update the asset
        await db
            .update(assets)
            .set({
                name,
                assetTag,
                serialNumber,
                updatedAt: new Date(),
            })
            .where(
                and(
                    eq(assets.id, assetId),
                )
            );

        await logActivity(userWithTeam?.teamId, user.id, ActivityType.EDIT_PODCAST);

        return { success: "Asset updated successfully" };
    }
);

