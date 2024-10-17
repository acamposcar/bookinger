'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Booking } from "@/lib/db/schema";
import { startTransition, useActionState, useState } from "react";
import { editBooking } from "./actions";
import type { ActionState } from "@/lib/auth/middleware";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Loader2, Save } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function EditBooking({ booking }: { booking: Booking }) {
    const [isOpen, setIsOpen] = useState(false);
    const [description, setDescription] = useState(booking.description);
    const [project, setProject] = useState(booking.project);
    const [start, setStart] = useState(booking.start.toISOString().split('T')[0]);
    const [end, setEnd] = useState(booking.end.toISOString().split('T')[0]);

    const [state, editAction, isEditPending] = useActionState<ActionState, FormData>(
        editBooking,
        { error: "", success: "" },
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('bookingId', booking.id);
        formData.append('description', description);
        formData.append('project', project);
        formData.append('start', start);
        formData.append('end', end);

        startTransition(() => {
            editAction(formData)
            setIsOpen(false);

        });

    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    {isEditPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Booking</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="asset">Asset</Label>
                        <Input
                            id="asset"
                            value={booking.assetId}
                            placeholder="Booking asset"
                            readOnly
                        />
                    </div>
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                    {state.error && (
                        <p className="text-red-500 text-sm">{state.error}</p>
                    )}
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isEditPending} className="bg-blue-500">
                            {isEditPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}  Edit Booking
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>

    );
}
