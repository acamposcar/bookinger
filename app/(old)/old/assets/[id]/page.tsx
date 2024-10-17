import { getAsset, getAssets } from "@/lib/db/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BookingItem from "../../(bookings)/booking-item";
import NewBooking from "../new-booking";
import EditAsset from "../edit";
import DeleteAsset from "../delete";
import { bookings } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";

export default async function Asset({ params }: { params: { id: string } }) {
	const asset = await getAsset(params.id);

	if (!asset) {
		return (
			<Card className="w-full">

				<CardContent className="p-6">
					<p>Asset not found</p>
				</CardContent>
			</Card>

		)
	}
	return (
		<section className="flex-1 p-4 lg:p-8">

			<Card className="w-full">
				<CardHeader >
					<div className="flex items-center  gap-4">
						<h1 className="text-lg lg:text-2xl font-medium text-gray-900  dark:text-gray-300">
							{asset.name}
						</h1>
						{asset.status === 'deployable' ? <Badge className="bg-green-600">{asset.status}</Badge> : <Badge variant='destructive'>{asset.status}</Badge>}
					</div>
				</CardHeader>
				<CardContent className="p-6">
					<div className="flex gap-4 justify-between items-center">
						{asset.image && <img src={asset.image} className="max-w-64" />}
						<div className="flex space-x-2 mt-4 justify-between">
							<NewBooking asset={asset} />

							<EditAsset asset={asset} />
							<DeleteAsset assetId={asset.id} />
						</div>

					</div>
					<div>
						{asset.assetTag && <p>Tag: {asset.assetTag}</p>}
						{asset.serialNumber && <p>SN: {asset.serialNumber}</p>}
						{asset.modelNumber && <p>Model: {asset.modelNumber}</p>}
						{asset.category && <p>Category: {asset.category}</p>}
						<div className="flex gap-2">
							{asset.location && <p>Location: {asset.location}</p>}
							{asset.shelf && <p>Shelf: {asset.shelf}</p>}
						</div>
					</div>

				</CardContent>
			</Card>
			{asset.bookings.length > 0 &&
				<Card className="w-full mt-12">
					<CardHeader>
						<h1 className="text-lg lg:text-2xl font-medium text-gray-900  dark:text-gray-300">
							Next Bookings					</h1>
					</CardHeader>
					<CardContent className="p-6">
						<div className="space-y-5">
							{asset.bookings.map(booking => {
								return (
									<BookingItem booking={booking} asset={asset} user={booking.user} />
								)
							})}
						</div>

					</CardContent>
				</Card>}


		</section>
	);
}