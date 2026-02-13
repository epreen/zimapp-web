"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productStepSchema, type ProductStepValues } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApplicationStore } from "@/lib/store/application-store";

type ProductCategory =
  | "produce"
  | "grains"
  | "meat_fish"
  | "dairy"
  | "packaged_foods"
  | "beverages"
  | "fashion"
  | "footwear_accessories"
  | "electronics"
  | "phones"
  | "home_kitchen"
  | "furniture"
  | "building_materials"
  | "agro_supplies"
  | "beauty"
  | "health"
  | "education"
  | "crafts"
  | "services"
  | "digital_products"
  | "wholesale"
  | "other";

const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "produce", label: "Fresh Produce (Fruits & Vegetables)" },
  { value: "grains", label: "Grains & Cereals" },
  { value: "meat_fish", label: "Meat, Fish & Poultry" },
  { value: "dairy", label: "Dairy & Eggs" },
  { value: "packaged_foods", label: "Packaged & Processed Foods" },
  { value: "beverages", label: "Beverages" },
  { value: "fashion", label: "Clothing & Fashion" },
  { value: "footwear_accessories", label: "Footwear & Accessories" },
  { value: "electronics", label: "Electronics & Appliances" },
  { value: "phones", label: "Phones & Phone Accessories" },
  { value: "home_kitchen", label: "Home & Kitchen Items" },
  { value: "furniture", label: "Furniture & Home Decor" },
  { value: "building_materials", label: "Building Materials & Hardware" },
  { value: "agro_supplies", label: "Farming Inputs & Agro-Supplies" },
  { value: "beauty", label: "Beauty & Personal Care" },
  { value: "health", label: "Health & Wellness Products" },
  { value: "education", label: "Books & Education Supplies" },
  { value: "crafts", label: "Handmade Goods & Crafts" },
  { value: "services", label: "Services" },
  { value: "digital_products", label: "Digital Products & Services" },
  { value: "wholesale", label: "Wholesale & Bulk Goods" },
  { value: "other", label: "Other" },
];

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function ProductStep({ onNext, onBack }: Props) {
  const draft = useApplicationStore((s) => s.draft);
  const setProduct = useApplicationStore((s) => s.setProduct);
  const saveDraft = useApplicationStore((s) => s.saveDraft);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductStepValues>({
    resolver: zodResolver(productStepSchema),
    mode: "onChange",
    defaultValues: draft.product ?? {
      productsCategory: "",
      estimatedMonthlyRevenue: "",
    },
  });

  const onSubmit = async (data: ProductStepValues) => {
    setProduct(data);
    await saveDraft({ persistToSanity: true });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Controller
          control={control}
          name="productsCategory"
          render={({ field: { value, onChange } }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Product Category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.productsCategory && (
          <p className="text-sm text-red-500">{errors.productsCategory.message}</p>
        )}
      </div>

      <div>
        <Controller
          control={control}
          name="estimatedMonthlyRevenue"
          render={({ field: { value, onChange } }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Estimated Monthly Revenue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-499999">MWK 0 – 499,999</SelectItem>
                <SelectItem value="750000-1249999">MWK 750k – 1.25M</SelectItem>
                <SelectItem value="2500000-4999999">MWK 2.5M – 5M</SelectItem>
                <SelectItem value="10000000+">MWK 10M+</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.estimatedMonthlyRevenue && (
          <p className="text-sm text-red-500">{errors.estimatedMonthlyRevenue.message}</p>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}