import { getBookings } from "@/lib/db/queries";
import BookingsList from "../(bookings)/bookings-list";
import CalendarComponent from "./calendar";

function generateColorFromUserId(userId: string) {
	// Generate a hash from the userId string
	let hash = 0;
	for (let i = 0; i < userId.length; i++) {
		hash = userId.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Generate pastel RGB values
	const r = ((hash & 0xff) % 156) + 100; // 100-255
	const g = (((hash >> 8) & 0xff) % 156) + 100; // 100-255
	const b = (((hash >> 16) & 0xff) % 156) + 100; // 100-255

	// Convert to hex and return
	return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default async function Calendar() {
	const bookings = await getBookings();
	const events = bookings.map((booking) => {
		return {
			id: booking.id,
			title: `${booking.asset.name} - ${booking.asset.assetTag} (${booking.user.name || booking.user.email.split("@")[0]}, ${booking.project})`,
			assetId: booking.assetId,
			allDay: true,
			start: new Date(booking.start),
			end: new Date(booking.end),
			url: `/dashboard/assets/${booking.assetId}`,
			backgroundColor: generateColorFromUserId(booking.user.id),
		};
	});
	return (
		<>
			<CalendarComponent events={events} />
			<BookingsList bookings={bookings} isMyBookings={false} />;
		</>
	);
}
