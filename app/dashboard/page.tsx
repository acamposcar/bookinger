import { getMyBookings } from "@/lib/db/queries";
import BookingsList from "./(bookings)/bookings-list";

export default async function MyBookings() {
	const bookings = await getMyBookings();

	return <BookingsList bookings={bookings} isMyBookings />;
}
