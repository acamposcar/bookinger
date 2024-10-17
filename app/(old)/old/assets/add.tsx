'use client'

import { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { addAsset } from "./actions";
import { useActionState } from "react";
import type { ActionState } from "@/lib/auth/middleware";
import { Loader2, Plus } from "lucide-react";
import { set } from "date-fns";

export default function AddAsset() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [assetTag, setAssetTag] = useState("");
    const [serialNumber, setSerialNumber] = useState("");


    const [state, addAction, isPending] = useActionState<ActionState, FormData>(
        addAsset,
        { error: "", success: "" },
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('assetTag', assetTag);
        formData.append('serialNumber', serialNumber);


        startTransition(() => {
            addAction(formData);
            setIsOpen(false);
            setName("")
            setAssetTag("")
            setSerialNumber(new Date().toISOString().split('T')[0])
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 " disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} Add Asset
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Asset</DialogTitle>
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
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                            placeholder="Serial"
                        />
                    </div>
                    {state.error && (
                        <p className="text-red-500 text-sm">{state.error}</p>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-500" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                            Add Asset
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}