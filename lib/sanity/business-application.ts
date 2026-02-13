import { writer } from "@/sanity/lib/client";

type BusinessDraft = {
    _id?: string;
    userId: string;
  
    businessName?: string;
    businessType?: string;
    businessAddress?: string;
    businessDescription?: string;
    businessPhone?: string;
    businessEmail?: string;
    taxId?: string;
    websiteUrl?: string;
    productsCategory?: string;
    estimatedMonthlyRevenue?: string;
  
    status: "pending";
};  

export async function createDraft(data: BusinessDraft) {
  return writer.create({
    _type: "businessApplication",
    appliedAt: new Date().toISOString(),
    ...data,
  });
}

export async function updateDraft(id: string, data: Partial<BusinessDraft>) {
  return writer
    .patch(id)
    .set(data)
    .commit({ autoGenerateArrayKeys: true });
}
