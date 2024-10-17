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
import { useActionState } from "react";
import type { ActionState } from "@/lib/auth/middleware";
import { Book, Calendar, Loader2, Plus } from "lucide-react";
import { set } from "date-fns";
import { addBooking } from "../actions";
import type { Asset } from "@/lib/db/schema";

export default function NewBooking({ asset }: { asset: Asset }) {
	const [isOpen, setIsOpen] = useState(false);
	const [description, setDescription] = useState("");
	const [project, setProject] = useState("");
	const [start, setStart] = useState(new Date().toISOString().split("T")[0]);
	const [end, setEnd] = useState(new Date().toISOString().split("T")[0]);

	const [state, addAction, isPending] = useActionState<ActionState, FormData>(
		addBooking,
		{ error: "", success: "" },
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("description", description);
		formData.append("project", project);
		formData.append("start", start);
		formData.append("end", end);
		formData.append("assetId", asset.id);

		startTransition(() => {
			addAction(formData);
			if (state.success !== "") {
				setIsOpen(false);
				setDescription("");
				setProject("");
				setStart(new Date().toISOString().split("T")[0]);
				setEnd(new Date().toISOString().split("T")[0]);
			}
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon" disabled={isPending}>
					<Calendar />
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
							value={asset.name}
							placeholder="Booking asset"
							readOnly
						/>
					</div>
					<div>
						<Label htmlFor="description">Description</Label>
						<Input
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Booking description"
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
