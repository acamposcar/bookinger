import { getBookings } from "@/lib/db/queries";
import BookingItem from "./booking-item";
import AddBooking from "./add";
import CalendarComponent from "./calendar";

export default async function Bookings() {
	const bookings = await getBookings();
	const events = bookings.map(booking => {
		return {
			...booking,
			title: `${booking.asset.name}  -  ${booking.project} (${booking.user.email})`
		}
	});

	return (
		<section className="flex-1 p-4 lg:p-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-lg lg:text-2xl font-medium text-gray-900  dark:text-gray-300">
					Bookings
				</h1>
				<AddBooking />
			</div>
			<div className="space-y-6 mb-12">
				{bookings.length > 0 ? (
					bookings.map((booking) => (
						<BookingItem key={booking.id} booking={booking} asset={booking.asset} user={booking.user} />
					))
				) : (
					<p className="text-center text-gray-500">No bookings found</p>
				)}
			</div>
			<CalendarComponent events={events} />

		</section>
	);
}