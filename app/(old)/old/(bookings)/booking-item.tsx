
import { ExternalLink, Clock, List } from "lucide-react";
import type { Booking, Asset, User } from "@/lib/db/schema";
import DeleteBooking from "./delete";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EditBooking from "./edit";
import { formatDistanceToNow } from "date-fns";
import { UpdateIcon } from "@radix-ui/react-icons";
import Link from "next/link";


// export default async function BookingItem({ booking }: { booking: Booking & { asset: Asset[] } & { user: User } }) {
export default async function BookingItem({ booking, asset, user }: { booking: Booking, asset: Asset, user: User }) {

	return (
		<Card className="w-full">
			<CardContent className="p-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
					<div className="flex items-center space-x-4">
						<div >
							<div className="flex gap-8 items-center justify-between">
								<Link href={`/dashboard/assets/${asset.id}`}>
									<h2 className="text-lg capitalize">{asset.name}</h2>
								</Link>
								<p className="text-sm">{booking.start.toDateString()} - {booking.end.toDateString()}</p>

							</div>
							<div className="flex gap-1">
								<p className="capitalize">{booking.description.toLowerCase()}</p>-
								<p className="capitalize">{booking.project.toLowerCase()}</p>
							</div>
							<p className="text-sm">{user.email}</p>

						</div>
					</div>
					<div className="flex space-x-2 mt-4 justify-between">
						<EditBooking booking={booking} />
						<DeleteBooking bookingId={booking.id} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
