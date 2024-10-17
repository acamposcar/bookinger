import { getAssets, searchAsset } from "@/lib/db/queries";
import AssetItem from "./asset-item";
import AddAsset from "./add";
import { Card, CardContent } from "@/components/ui/card";
import Search from "./search/page";

export default async function Assets() {
	const assets = await getAssets();
	const search = await searchAsset('dewesoft')
	console.log(search)
	return (
		<section className="flex-1 p-4 lg:p-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-lg lg:text-2xl font-medium text-gray-900  dark:text-gray-300">
					Assets
				</h1>
				<Search />
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