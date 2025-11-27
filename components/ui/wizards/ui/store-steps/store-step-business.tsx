'use client';

import { SelectionGrid } from "@/components/ui/wizards/ui/selection-grid";
import { StoreFormData, WizardStepInterface } from "@/app/(protected)/hub/create-store/page";

const storeTypes = ["Individual", "Company", "Brand", "Distributor"];
const categories = ["Electronics","Fashion","Groceries","Home & Living","Pharmacy","Automotive"];

export function StoreStepBusiness({ data, update }: WizardStepInterface<StoreFormData>) {
    return (
        <div className="space-y-6">
            <SelectionGrid
                label="Store Type"
                options={storeTypes}
                active={data.type}
                onSelect={(t) => update({ type: t })}
            />

            <SelectionGrid
                label="Category"
                options={categories}
                active={data.category}
                onSelect={(c) => update({ category: c })}
            />
        </div>
    );
}