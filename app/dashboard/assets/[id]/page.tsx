import { getAsset, getAssetBookings, getAssets } from "@/lib/db/queries";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import NewBooking from "../_components/new-booking";
import EditAsset from "../_components/edit";
import DeleteAsset from "../_components/delete";
import { bookings } from "@/lib/db/schema";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Box, Hash, MapPin, QrCode, Tag } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from "@/components/ui/table";
import BookingsList from "../../(bookings)/bookings-list";

export default async function Asset({ params }: { params: { id: string } }) {
	const asset = await getAsset(params.id);
	const bookings = await getAssetBookings(params.id);

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
		<>
			<div className="grid gap-6 md:grid-cols-[2fr,1fr]">
				<Card className="w-full">
					<CardHeader>
						<CardTitle>
							<div className="flex justify-between items-center">
								<div className="space-y-1">
									<div className="flex gap-3 items-center">
										<h1 className="text-2xl">{asset.name}</h1>
										<span className="text-lg text-muted-foreground">
											({asset.assetTag})
										</span>
										{asset.category && (
											<Badge variant="secondary">{asset.category}</Badge>
										)}
									</div>
									{asset.status === "deployable" ? (
										<Badge className="bg-green-200 text-green-900 hover:bg-green-300">
											{asset.status}
										</Badge>
									) : (
										<Badge className="bg-red-200 text-red-900 hover:bg-red-300">
											{asset.status}
										</Badge>
									)}
								</div>
								<NewBooking asset={asset} />
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell className="font-medium">Tag</TableCell>
									<TableCell>{asset.assetTag || "-"}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Serial Number</TableCell>
									<TableCell>{asset.serialNumber || "-"}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Location</TableCell>
									<TableCell>{asset.location || "-"}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="font-medium">Shelf</TableCell>
									<TableCell>{asset.shelf || "-"}</TableCell>
								</TableRow>
								{asset.image && (
									<TableRow>
										<TableCell className="font-medium">Image</TableCell>
										<TableCell>
											<div className="relative h-40 w-40">
												<Image
													src={asset.image}
													alt={asset.name}
													layout="fill"
													objectFit="contain"
													className="rounded-md"
												/>
											</div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<Card className="w-full">
					<CardHeader>
						<CardTitle className="text-xl font-semibold flex items-center space-x-2">
							<QrCode className="h-6 w-6" />
							<span>QR Code</span>
						</CardTitle>
					</CardHeader>
					<Separator />
					<CardContent className="flex items-center justify-center p-6">
						<div className="bg-white p-4 rounded-lg shadow-inner">
							{/* <QrCode className="w-48 h-48 text-primary" /> */}
							<Image
								src={asset.qr || ""}
								alt={asset.name}
								objectFit="contain"
								className="rounded-lg"
								width={200}
								height={200}
							/>
							<span className="sr-only">
								QR Code for asset {asset.assetTag}
							</span>
						</div>
					</CardContent>
					<Separator />
					<CardContent className="p-4">
						<p className="text-sm text-center text-muted-foreground">
							Scan this QR code to view more details or update the asset status.
						</p>
					</CardContent>
				</Card>
			</div>
			<BookingsList bookings={bookings} isMyBookings={false} />
		</>
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
	);
}
