import { Button } from "@/components/ui/button";
import { ArrowRight, AudioLines, CreditCard, Database, Headphones, Shield } from "lucide-react";
import { Terminal } from "./terminal";
import Link from "next/link";


export default function HomePage() {
	return (
		<main>
			<section className="py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="lg:grid lg:grid-cols-12 lg:gap-8">
						<div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
							<h1 className="text-4xl font-bold text-gray-900 dark:text-gray-300  tracking-tight sm:text-5xl md:text-6xl">
								YouTube to Booking
								<span className="block text-blue-500">Listening Made Easy</span>
							</h1>
							<p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl dark:text-gray-400">
								Transform your favorite YouTube content into portable bookings. Compatible with
								Apple Bookings, Spotify, PocketCast and more.
							</p>
							<div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
								<Link href="/dashboard">
									<Button className="bg-white hover:bg-gray-100 text-black border border-gray-200 rounded-full text-lg px-8 py-4 inline-flex items-center justify-center">
										Start listening
										<ArrowRight className="ml-2 h-5 w-5" />
									</Button>
								</Link>
							</div>
						</div>
						<div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
							<Terminal />
						</div>
					</div>
				</div>
			</section>

			{/* <section className="py-12 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-2xl font-semibold text-center mb-8">Works in Every App</h2>
					<div className="flex justify-center space-x-12">
						<Image src={spotify} alt="Brand 1" width={50} height={50} />
						<Image src={appleBooking} alt="Brand 2" width={50} height={50} />
						<Image src={pocketCast} alt="Brand 3" width={50} height={50} />
					</div>
				</div>
			</section> */}

			<section className="py-16 bg-white w-full dark:bg-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="lg:grid lg:grid-cols-3 lg:gap-8">
						<div>
							<div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
								<AudioLines className="h-6 w-6" />

							</div>
							<div className="mt-5">
								<h2 className="text-lg font-medium text-gray-900 dark:text-gray-300 ">
									Fast Streaming
								</h2>
								<p className="mt-2 text-base text-gray-500 dark:text-gray-400">
									Stream YouTube videos to booking format quickly and efficiently,
									saving you time and effort.
								</p>
							</div>
						</div>

						<div className="mt-10 lg:mt-0">
							<div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
								<Headphones className="h-6 w-6" />
							</div>
							<div className="mt-5">
								<h2 className="text-lg font-medium text-gray-900 dark:text-gray-300">
									Seamless Listening
								</h2>
								<p className="mt-2 text-base text-gray-500 dark:text-gray-400">
									Listen your favourite shows on any device or app. Compatible with
									Apple Bookings, Spotify, PocketCast and more.
								</p>
							</div>
						</div>

						<div className="mt-10 lg:mt-0">
							<div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
								<Shield className="h-6 w-6" />
							</div>
							<div className="mt-5">
								<h2 className="text-lg font-medium text-gray-900 dark:text-gray-300">
									Privacy Protected
								</h2>
								<p className="mt-2 text-base text-gray-500 dark:text-gray-400">
									Your listening habits and converted content are kept private and secure.
									We never share your data.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-gray-50 dark:bg-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">How It Works</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">1</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Paste YouTube URL</h3>
							<p className="text-gray-700 dark:text-gray-300">Simply copy and paste the URL of your favorite YouTube channel or playlist.</p>
						</div>
						<div className="text-center">
							<div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">2</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Convert to Booking</h3>
							<p className="text-gray-700 dark:text-gray-300">Our system quickly converts the content into a booking format.</p>
						</div>
						<div className="text-center">
							<div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">3</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Listen Anywhere</h3>
							<p className="text-gray-700 dark:text-gray-300">Access your converted booking on any device or booking app.</p>
						</div>
					</div>
				</div>
			</section>

			<section className="py-16 bg-white dark:bg-gray-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">What Our Users Say</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
							<p className="text-lg mb-4 text-gray-700 dark:text-gray-300">"This service has completely changed how I consume content. I can now listen to my favorite YouTubers while commuting!"</p>
							<p className="font-semibold text-gray-900 dark:text-gray-100">- Sarah K., Booking Enthusiast</p>
						</div>
						<div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
							<p className="text-lg mb-4 text-gray-700 dark:text-gray-300">"As a content creator, this tool helps me reach a wider audience. My viewers love the booking option!"</p>
							<p className="font-semibold text-gray-900 dark:text-gray-100">- Mike R., YouTuber</p>
						</div>
					</div>
				</div>
			</section>
			<section className="py-16 bg-blue-800 dark:bg-blue-900 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
						<div>
							<h2 className="text-3xl font-bold sm:text-4xl">
								Start Converting Your First Video for Free!
							</h2>
							<p className="mt-3 max-w-3xl text-lg">
								Try our service with no commitment. Convert your first video to booking format at no cost.
								Experience the convenience and decide if it's right for you.
							</p>
						</div>
						<div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
							<Link href="/dashboard">
								<Button className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500 dark:text-blue-400 border border-white dark:border-gray-800 rounded-full text-xl px-12 py-6 inline-flex items-center justify-center">
									Try It Free
									<ArrowRight className="ml-3 h-6 w-6" />
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}