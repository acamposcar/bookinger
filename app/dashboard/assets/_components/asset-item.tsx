
import { ExternalLink, Clock, List } from "lucide-react";
import { Booking, type Asset } from "@/lib/db/schema";
import DeleteAsset from "./delete";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditAsset from "./edit";
import { formatDistanceToNow } from "date-fns";
import { UpdateIcon } from "@radix-ui/react-icons";
import NewBooking from "./new-booking";
import Link from "next/link";

export default async function AssetItem({ asset }: { asset: Asset }) {

	return (
		// <Card className="w-full">
		// 	<CardContent className="p-6">
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
			<Link href={`/dashboard/assets/${asset.id}`} >
				<div className="flex gap-2 items-center justify-between">
					<h2 className="text-lg capitalize">{asset.name.toLowerCase()}</h2>
					{asset.status === 'deployable' ? <Badge className="bg-green-600">{asset.status}</Badge> : <Badge variant='destructive'>{asset.status}</Badge>}

				</div>
				<p className="text-sm text-gray-800">{asset.assetTag} - {asset.serialNumber}</p>

			</Link>
			<div className="flex space-x-2 mt-4 justify-between">
				<NewBooking asset={asset} />

				<EditAsset asset={asset} />
				<DeleteAsset assetId={asset.id} />
			</div>
		</div>
		// 	</CardContent>
		// </Card>
	);
}
