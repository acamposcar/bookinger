import { getAssets, searchAssetsBySimilarity } from "@/lib/db/queries";

import Image from "next/image";
import {
	CheckIcon,
	Download,
	Drill,
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
import EditBooking from "./_components/edit";
import DeleteBooking from "./_components/delete";
import AddBooking from "./_components/add";
import DeleteAsset from "./_components/delete";
import EditAsset from "./_components/edit";
import NewBooking from "./_components/new-booking";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Suspense } from "react";
import LoadingSpinner from "../../../components/loading-spinner";

export const revalidate = 3600; // revalidate the data at most every hour

export default async function AssetsPage({
	searchParams,
}: {
	searchParams: { [key: string]: string };
}) {
	const assets = searchParams.q
		? await searchAssetsBySimilarity({ searchTerm: searchParams.q })
		: await getAssets();

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
						<CardTitle className="text-2xl">Assets</CardTitle>
						<CardDescription>Manage the assets.</CardDescription>
					</CardHeader>
					<CardContent>
						<Suspense fallback={<LoadingSpinner />}>
							{assets.length === 0 ? (
								<p className="text-muted-foreground flex items-center justify-center min-h-44">
									No assets found.
								</p>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="hidden w-[100px] md:table-cell">
												<span className="sr-only">Image</span>
											</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Tag</TableHead>

											<TableHead className="hidden md:table-cell">
												Serial Number
											</TableHead>

											<TableHead>
												<span className="sr-only">Actions</span>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{assets.map((asset) => (
											<TableRow key={asset.id}>
												<TableCell className="hidden md:table-cell">
													<Link href={`/dashboard/assets/${asset.id}`}>
														<Image
															alt={asset.name}
															className="aspect-square rounded-md object-contain"
															height="64"
															src={
																asset.image || "https://via.placeholder.com/64"
															}
															width="64"
														/>
													</Link>
												</TableCell>
												<TableCell className="font-medium">
													<Link href={`/dashboard/assets/${asset.id}`}>
														{asset.name}{" "}
														<span className="text-muted-foreground font-normal hidden md:inline-block">
															({asset.assetTag})
														</span>
													</Link>
												</TableCell>

												<TableCell>
													{asset.status === "deployable" && (
														<CheckIcon className="h-4 w-4 text-green-600" />
													)}
													{asset.status === "undeployable" && (
														<XIcon className="h-4 w-4 text-red-600" />
													)}

													{asset.status !== "deployable" &&
														asset.status !== "undeployable" && (
															<Wrench className="h-4 w-4 text-sky-600" />
														)}
												</TableCell>
												<TableCell>{asset.assetTag}</TableCell>
												<TableCell className="hidden md:table-cell">
													{asset.serialNumber}
												</TableCell>

												<TableCell>
													{asset.status === "deployable" && (
														<div className="flex gap-2 items-center">
															{/* <EditAsset asset={asset} /> */}
															<NewBooking asset={asset} />
															{/* <DeleteAsset assetId={asset.id} /> */}
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
					<Suspense fallback={<LoadingSpinner />}>
						{assets.length > 0 && (
							<CardFooter>
								<div className="text-xs text-muted-foreground">
									Showing{" "}
									<strong>1-{assets.length > 10 ? 10 : assets.length}</strong>{" "}
									of <strong>{assets.length}</strong> bookings
								</div>
							</CardFooter>
						)}
					</Suspense>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
