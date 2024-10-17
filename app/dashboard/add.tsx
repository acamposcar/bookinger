"use client";

import { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { addBooking } from "./actions";
import { useActionState } from "react";
import type { ActionState } from "@/lib/auth/middleware";
import { Loader2, Plus, PlusCircle } from "lucide-react";
import { set } from "date-fns";

export default function AddBooking() {
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState("");
	const [project, setProject] = useState("");
	const [start, setStart] = useState(new Date().toISOString().split("T")[0]);
	const [end, setEnd] = useState(new Date().toISOString().split("T")[0]);
	const [assetId, setAssetId] = useState("");

	const [state, addAction, isPending] = useActionState<ActionState, FormData>(
		addBooking,
		{ error: "", success: "" },
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("project", project);
		formData.append("start", start);
		formData.append("end", end);
		formData.append("assetId", assetId);

		startTransition(() => {
			addAction(formData);
			setIsOpen(false);
			setName("");
			setProject("");
			setStart(new Date().toISOString().split("T")[0]);
			setEnd(new Date().toISOString().split("T")[0]);
			setAssetId("");
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="h-7 gap-1">
					<PlusCircle className="h-3.5 w-3.5" />
					<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
						Add Booking
					</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New Booking</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="asset">Asset</Label>
						<Input
							id="asset"
							value={assetId}
							onChange={(e) => setAssetId(e.target.value)}
							placeholder="Booking asset"
						/>
					</div>
					<div>
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Booking name"
						/>
					</div>
					<div>
						<Label htmlFor="project">Project</Label>
						<Input
							id="project"
							value={project}
							onChange={(e) => setProject(e.target.value)}
							placeholder="Project"
						/>
					</div>
					<div>
						<Label htmlFor="start">Start Date</Label>
						<Input
							id="start"
							type="date"
							value={start}
							onChange={(e) => setStart(e.target.value)}
							placeholder="Start Date"
						/>
					</div>
					<div>
						<Label htmlFor="end">End Date</Label>

						<Input
							id="end"
							type="date"
							value={end}
							onChange={(e) => setEnd(e.target.value)}
							placeholder="End Date"
						/>
					</div>
					{state.error && <p className="text-red-500 text-sm">{state.error}</p>}
					<div className="flex justify-end space-x-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" className="bg-blue-500" disabled={isPending}>
							{isPending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Plus className="mr-2 h-4 w-4" />
							)}
							Add Booking
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
