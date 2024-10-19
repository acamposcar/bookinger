"use client";
import React, { useState } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type { Asset, Booking, User } from "@/lib/db/schema";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function CalendarComponent({
	events,
}: {
	events: any;
}) {
	const [weekendsVisible, setWeekendsVisible] = useState(true);
	const [currentEvents, setCurrentEvents] = useState([]);
	const router = useRouter();

	function handleWeekendsToggle() {
		setWeekendsVisible(!weekendsVisible);
	}

	function handleDateSelect(selectInfo: any) {
		const title = prompt("Please enter a new title for your event");
		const calendarApi = selectInfo.view.calendar;

		calendarApi.unselect(); // clear date selection

		if (title) {
			calendarApi.addEvent({
				id: 1,
				title,
				start: selectInfo.startStr,
				end: selectInfo.endStr,
				allDay: selectInfo.allDay,
			});
		}
	}

	function handleEventClick(clickInfo: any) {
		router.push(clickInfo.event.url);
	}

	function handleEvents(events: any) {
		setCurrentEvents(events);
	}

	return (
		<Card>
			<CardContent>
				<div className="py-8 sm:px-4">
					{/* <Sidebar
				weekendsVisible={weekendsVisible}
				handleWeekendsToggle={handleWeekendsToggle}
				currentEvents={currentEvents}
			/> */}
					<div className="max-w-7xl mx-auto">
						<FullCalendar
							plugins={[
								dayGridPlugin,
								timeGridPlugin,
								interactionPlugin,
								listPlugin,
							]}
							headerToolbar={{
								left: "prev,next today",
								center: "title",
								right: "dayGridMonth,dayGridWeek,listMonth",
							}}
							initialView="dayGridMonth"
							views={{
								dayGridFourWeeks: {
									type: "dayGridWeek",
									duration: { weeks: 4 },
								},
							}}
							nowIndicator={true}
							editable={false}
							selectable={false}
							selectMirror={true}
							dayMaxEvents={true}
							weekNumbers={true}
							weekends={weekendsVisible}
							events={events} // alternatively, use the `events` setting to fetch from a feed
							select={handleDateSelect}
							eventContent={renderEventContent} // custom render function
							eventClick={handleEventClick}
							eventsSet={handleEvents} // called after events are initialized/added/changed/removed
							/* you can update a remote database when these fire:
        eventAdd={function(){}}
        eventChange={function(){}}
        eventRemove={function(){}}
        */
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function renderEventContent(eventInfo: any) {
	return (
		<>
			{/* Use same bg-color for all events for the same user */}

			<i>{eventInfo.event.title}</i>
		</>
	);
}

function Sidebar({
	weekendsVisible,
	handleWeekendsToggle,
	currentEvents,
}: { weekendsVisible: any; handleWeekendsToggle: any; currentEvents: any }) {
	return (
		<div className="demo-app-sidebar">
			<div className="demo-app-sidebar-section">
				<h2>Instructions</h2>
				<ul>
					<li>Select dates and you will be prompted to create a new event</li>
					<li>Drag, drop, and resize events</li>
					<li>Click an event to delete it</li>
				</ul>
			</div>
			<div className="demo-app-sidebar-section">
				<label>
					<input
						type="checkbox"
						checked={weekendsVisible}
						onChange={handleWeekendsToggle}
					/>
					toggle weekends
				</label>
			</div>
			<div className="demo-app-sidebar-section">
				<h2>All Events ({currentEvents.length})</h2>
				<ul>
					{currentEvents.map((event: any) => (
						<SidebarEvent key={event.id} event={event} />
					))}
				</ul>
			</div>
		</div>
	);
}

function SidebarEvent({ event }: { event: any }) {
	return (
		<li key={event.id}>
			<b>
				{formatDate(event.start, {
					year: "numeric",
					month: "short",
					day: "numeric",
				})}
			</b>
			<i>{event.title}</i>
		</li>
	);
}
