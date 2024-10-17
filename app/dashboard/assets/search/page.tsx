'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Asset } from "@/lib/db/schema";
import { startTransition, useActionState, useState } from "react";
import { ActionState } from "@/lib/auth/middleware";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Loader2, Save, SearchCheck, SearchIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation'

export default function Search() {
    const [query, setQuery] = useState('');
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/dashboard/assets/search/${query}`)
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search assets"
            />


            <Button type="submit" >
                <SearchIcon className="h-3 w-3" />
            </Button>

        </form>


    );
}
