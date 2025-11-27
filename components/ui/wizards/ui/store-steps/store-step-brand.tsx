'use client';

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { StaticImageData } from "next/image";
import { StoreFormData, WizardStepInterface } from "@/app/(protected)/hub/create-store/page"; // adjust path

interface StoreStepBrandProps extends WizardStepInterface<StoreFormData> {
    assets: {
        upload_area: StaticImageData;
        hero_model_img: StaticImageData;
        hero_product_img1: StaticImageData;
        hero_product_img2: StaticImageData;
    };
}

export function StoreStepBrand({ data, update, assets }: StoreStepBrandProps) {
    return (
        <div className="space-y-4">
            <label>Store Logo</label>
            <div className="flex items-center gap-4">
                <Image
                    src={data.image ? URL.createObjectURL(data.image) : assets.upload_area}
                    alt="preview"
                    width={100}
                    height={100}
                    className="rounded-md border"
                    priority
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        update({ image: e.target.files?.[0] ?? null })
                    }
                />
            </div>

            <Input
                placeholder="Email"
                type="email"
                name="email"
                value={data.email}
                onChange={(e) => update({ email: e.target.value })}
            />

            <Input
                placeholder="Contact"
                name="contact"
                value={data.contact}
                onChange={(e) => update({ contact: e.target.value })}
            />
        </div>
    );
}