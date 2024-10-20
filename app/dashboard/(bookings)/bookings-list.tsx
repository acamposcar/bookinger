import { getMyBookings, getUser } from "@/lib/db/queries";

import Image from "next/image";
import {
	CheckIcon,
	Download,
	ListFilter,
	MoreHorizontal,
	PlusCircle,
	Wrench,
	XIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditBooking from "./edit";
import DeleteBooking from "./delete";
import AddBooking from "./add";
import Link from "next/link";
import type { Asset, Booking, User } from "@/lib/db/schema";
import { is } from "drizzle-orm";
import { Suspense } from "react";
import LoadingSpinner from "../../../components/loading-spinner";

export default async function BookingsList({
	isMyBookings,
	bookings,
}: {
	bookings: (Booking & { asset: Asset; user: User })[];
	isMyBookings: boolean;
}) {
	const user = await getUser();
	console.log(bookings);
	return (
		<Tabs defaultValue="all">
			<div className="flex items-center">
				<TabsList>
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="active">Active</TabsTrigger>
					<TabsTrigger value="draft">Draft</TabsTrigger>
					<TabsTrigger value="archived" className="hidden sm:flex">
						Archived
					</TabsTrigger>
				</TabsList>
				<div className="ml-auto flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-7 gap-1">
								<ListFilter className="h-3.5 w-3.5" />
								<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
									Filter
								</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Filter by</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuCheckboxItem checked>
								Active
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Button size="sm" variant="outline" className="h-7 gap-1">
						<Download className="h-3.5 w-3.5" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
							Export
						</span>
					</Button>
					{/* <AddBooking /> */}
				</div>
			</div>
			<TabsContent value="all">
				<Card x-chunk="A list of bookings in a table with actions.">
					<CardHeader>
						<CardTitle className="text-2xl">
							{isMyBookings ? "My Bookings" : "Bookings"}
						</CardTitle>
						<CardDescription>
							{isMyBookings ? "Manage your bookings." : "View all bookings."}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Suspense fallback={<LoadingSpinner />}>
							{bookings.length === 0 ? (
								<p className="text-muted-foreground flex items-center justify-center min-h-44">
									No bookings found.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="hidden w-[100px] md:table-cell">
												<span className="sr-only">Image</span>
											</TableHead>
											<TableHead>Asset</TableHead>
											{!isMyBookings && <TableHead>Booked by</TableHead>}
											<TableHead>Project</TableHead>

											<TableHead className="hidden md:table-cell">
												Description
											</TableHead>
											<TableHead className="hidden md:table-cell">
												Start at
											</TableHead>
											<TableHead className="hidden md:table-cell">
												End at
											</TableHead>
											<TableHead className="table-cell md:hidden">
												Date
											</TableHead>
											<TableHead className="hidden md:table-cell">
												Status
											</TableHead>
											<TableHead>
												<span className="sr-only">Actions</span>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{bookings.map((booking) => (
											<TableRow key={booking.id}>
												<TableCell className="hidden md:table-cell">
													<Image
														alt={booking.asset.name}
														className="aspect-square rounded-md object-contain"
														height="64"
														src={
															booking.asset.image ||
															"https://via.placeholder.com/64"
														}
														width="64"
													/>
												</TableCell>
												<TableCell className="font-medium">
													<Link href={`/dashboard/assets/${booking.asset.id}`}>
														{booking.asset.name}{" "}
														<span className="text-muted-foreground font-normal hidden md:inline-block">
															({booking.asset.assetTag})
														</span>
													</Link>
												</TableCell>
												{!isMyBookings && (
													<TableCell className="font-medium">
														{booking.user.name ||
															booking.user.email.split("@")[0]}
													</TableCell>
												)}

												<TableCell>{booking.project}</TableCell>
												<TableCell className="hidden md:table-cell">
													{booking.description}
												</TableCell>
												<TableCell className="hidden md:table-cell">
													{booking.start?.toLocaleDateString()}
												</TableCell>
												<TableCell className="hidden md:table-cell">
													{booking.end?.toLocaleDateString()}
												</TableCell>
												<TableCell className="table-cell md:hidden">
													<div>{booking.start?.toLocaleDateString()}</div>
													<div>{booking.end?.toLocaleDateString()}</div>
												</TableCell>
												<TableCell className="hidden md:table-cell">
													{booking.asset.status === "deployable" && (
														<CheckIcon className="h-4 w-4 text-green-600" />
													)}
													{booking.asset.status === "undeployable" && (
														<XIcon className="h-4 w-4 text-red-600" />
													)}

													{booking.asset.status !== "deployable" &&
														booking.asset.status !== "undeployable" && (
															<Wrench className="h-4 w-4 text-sky-600" />
														)}
												</TableCell>
												<TableCell>
													{user?.id === booking.userId && (
														<div className="flex gap-2 items-center">
															<EditBooking booking={booking} />
															<DeleteBooking
																bookingId={booking.id}
																bookingUserId={booking.userId}
															/>
														</div>
													)}

													{/* <DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															aria-haspopup="true"
															size="icon"
															variant="ghost"
														>
															<MoreHorizontal className="h-4 w-4" />
															<span className="sr-only">Toggle menu</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuLabel>Actions</DropdownMenuLabel>
														<DropdownMenuItem>
															<EditBooking booking={booking} />
														</DropdownMenuItem>
														<DropdownMenuItem>
															<DeleteBooking bookingId={booking.id} />
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu> */}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</Suspense>
					</CardContent>
					<Suspense>
						{bookings.length > 0 && (
							<CardFooter>
								<div className="text-xs text-muted-foreground">
									Showing{" "}
									<strong>
										1-{bookings.length > 10 ? 10 : bookings.length}
									</strong>{" "}
									of <strong>{bookings.length}</strong> bookings
								</div>
							</CardFooter>
						)}
					</Suspense>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
