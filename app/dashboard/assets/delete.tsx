"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import type { ActionState } from "@/lib/auth/middleware";
import { startTransition, useActionState, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { deleteAsset } from "./actions";

export default function DeleteAsset({ assetId }: { assetId: string }) {
	const [state, removeAction, isRemovePending] = useActionState<
		ActionState,
		FormData
	>(deleteAsset, { error: "", success: "" });
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		startTransition(() => {
			removeAction(new FormData(event.currentTarget));
			false;
		});
	};

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogTrigger asChild>
					<Button variant="outline" size="icon" disabled={isRemovePending}>
						<Trash2 className=" text-red-600" />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this asset? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<div className="flex justify-end space-x-2">
							<Button
								variant="outline"
								type="button"
								onClick={() => setIsDialogOpen(false)}
							>
								Cancel
							</Button>
							<form onSubmit={handleSubmit}>
								<input type="hidden" name="assetId" value={assetId} />

								<Button variant="destructive" disabled={isRemovePending}>
									{isRemovePending ? (
										<Loader2 className="h-4 w-4 animate-spin mr-2" />
									) : (
										<Trash2 className="h-4 w-4 mr-2" />
									)}
									Delete
								</Button>
							</form>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			{state?.error && <p className="text-red-500 mt-4">{state.error}</p>}
		</>
	);
}
