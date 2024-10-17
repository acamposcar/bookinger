import { getAssets, searchAsset, searchAssetsBySimilarity } from "@/lib/db/queries";
import { Card, CardContent } from "@/components/ui/card";
import AddAsset from "../../add";
import AssetItem from "../../asset-item";

export default async function SearchResults({ params }: { params: { q: string } }) {
	const assets = await searchAssetsBySimilarity({ searchTerm: params.q })
	return (
		<section className="flex-1 p-4 lg:p-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-lg lg:text-2xl font-medium text-gray-900  dark:text-gray-300">
					Assets
				</h1>
				<AddAsset />
			</div>
			<Card className="w-full">
				<CardContent className="p-6">

					<div className="space-y-6">
						{assets.length > 0 ? (
							assets.map((asset) => (
								<AssetItem key={asset.id} asset={asset} />
							))
						) : (
							<p className="text-center text-gray-500">No assets found</p>
						)}
					</div>

				</CardContent>
			</Card>


		</section>
	);
}