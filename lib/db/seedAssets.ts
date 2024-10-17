import { assetsData } from "@/app/(old)/old/assets/assets-data";
import { db } from "./drizzle";
import { assets } from "./schema";

export async function insertAssets(assetsDat: any) {
	for (const asset of assetsDat) {
		await db.insert(assets).values({
			name: asset.name,
			idSnipeit: asset.id,
			assetTag: asset.asset_tag,
			serialNumber: asset.serial,
			modelNumber: asset.model_number,
			image: asset.image,
			qr: asset.qr,
			location: asset.location?.name,
			category: asset.category?.name,
			status: asset.status_label?.status_type,
			shelf: asset.custom_fields?.Estantería?.value,
			createdAt: new Date(asset.created_at.datetime), // Adjust based on your asset data structure
			updatedAt: new Date(asset.updated_at.datetime), // Adjust based on your asset data structure
		});
	}
}

insertAssets(assetsData.rows)
	.catch((error) => {
		console.error("Seed process failed:", error);
		process.exit(1);
	})
	.finally(() => {
		console.log("Seed process finished. Exiting...");
		process.exit(0);
	});
