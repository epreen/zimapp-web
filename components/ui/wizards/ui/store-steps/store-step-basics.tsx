'use client';

import { Input } from "@/components/ui/input";
import { StoreFormData, WizardStepInterface } from "@/app/(protected)/hub/create-store/page";

export function StoreStepBasics({ data, update }: WizardStepInterface<StoreFormData>) {
    return (
        <div className="space-y-4">
            <Input
                name="username"
                placeholder="Store Username"
                value={data.username}
                onChange={(e) => update({ username: e.target.value })}
            />

            <Input
                name="name"
                placeholder="Store Name"
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
            />

            <Input
                name="description"
                placeholder="Description"
                value={data.description}
                onChange={(e) => update({ description: e.target.value })}
            />
        </div>
    );
}