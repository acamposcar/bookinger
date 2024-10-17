"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import type { Asset } from "@/lib/db/schema";
import { startTransition, useActionState, useState } from "react";
import { editAsset } from "./actions";
import type { ActionState } from "@/lib/auth/middleware";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Loader2, Save } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function EditAsset({ asset }: { asset: Asset }) {
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState(asset.name);
	const [assetTag, setAssetTag] = useState(asset.assetTag);
	const [serialNumber, setSerialNumber] = useState(asset.serialNumber);

	const [state, editAction, isEditPending] = useActionState<
		ActionState,
		FormData
	>(editAsset, { error: "", success: "" });

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("assetId", asset.id);
		formData.append("name", name);
		formData.append("assetTag", assetTag);
		formData.append("serialNumber", serialNumber || "");
		startTransition(() => {
			editAction(formData);

			setIsOpen(false);
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon" disabled={isEditPending}>
					<Pencil className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Asset</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Asset name"
						/>
					</div>
					<div>
						<Label htmlFor="assetTag">Asset Tag</Label>
						<Input
							id="assetTag"
							value={assetTag}
							onChange={(e) => setAssetTag(e.target.value)}
							placeholder="Asset Tag"
						/>
					</div>
					<div>
						<Label htmlFor="serial">Serial</Label>
						<Input
							id="serial"
							value={serialNumber || ""}
							onChange={(e) => setSerialNumber(e.target.value)}
							placeholder="Serial"
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
						<Button
							type="submit"
							disabled={isEditPending}
							className="bg-blue-500"
						>
							{isEditPending ? (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							) : (
								<Save className="h-4 w-4 mr-2" />
							)}{" "}
							Edit Asset
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
