import { getAsset, getAssets } from "@/lib/db/queries";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import NewBooking from "../new-booking";
import EditAsset from "../edit";
import DeleteAsset from "../delete";
import { bookings } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default async function Asset({ params }: { params: { id: string } }) {
	const asset = await getAsset(params.id);

	if (!asset) {
		return (
			<Card className="w-full">
				<CardContent className="p-6">
					<p>Asset not found</p>
				</CardContent>
			</Card>
		);
	}
	return (
		<Card className="max-w-5xl mx-auto w-full">
			<CardHeader>
				<CardTitle>{asset.name}</CardTitle>
				{/* <CardDescription>
					Lipsum dolor sit amet, consectetur adipiscing elit
				</CardDescription> */}
			</CardHeader>
			<CardContent>
				<div className="flex gap-4">
					{asset.image && (
						<Image
							src={asset.image}
							alt={asset.name}
							width={200}
							height={200}
							className="rounded-md object-center"
						/>
					)}
					<div>
						<div className="grid gap-6">
							<div className="grid gap-3">
								<Label htmlFor="tag">Tag</Label>
								<Input
									id="tag"
									type="text"
									defaultValue={asset.assetTag}
									readOnly
								/>
							</div>
							{asset.location && asset.shelf && (
								<div className="grid gap-3">
									<Label htmlFor="name">Location</Label>
									<Input
										id="name"
										type="text"
										defaultValue={asset.location}
										readOnly
									/>
								</div>
							)}
							{asset.shelf && (
								<div className="grid gap-3">
									<Label htmlFor="name">Shelf</Label>
									<Input
										id="name"
										type="text"
										defaultValue={asset.shelf}
										readOnly
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>

		// 	{asset.bookings.length > 0 && (
		// 		<Card className="w-full mt-12">
		// 			<CardHeader>
		// 				<h1 className="text-lg lg:text-2xl font-medium text-gray-900  dark:text-gray-300">
		// 					Next Bookings{" "}
		// 				</h1>
		// 			</CardHeader>
		// 			<CardContent className="p-6">
		// 				<div className="space-y-5">
		// 					{asset.bookings.map((booking) => {
		// 						return "Hola";
		// 					})}
		// 				</div>
		// 			</CardContent>
		// 		</Card>
		// 	)}
		// </section>
	);
}
