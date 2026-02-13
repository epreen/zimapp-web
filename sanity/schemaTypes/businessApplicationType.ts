import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const businessApplicationType = defineType({
  name: "businessApplication",
  title: "Business Application",
  type: "document",
  icon: PackageIcon,
  fields: [
    defineField({
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
      description: "Reference to the user who applied",
    }),
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Firebase User ID",
    }),
    defineField({
      name: "userEmail",
      title: "User Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessType",
      title: "Business Type",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Individual / Sole Trader", value: "individual" },
          { title: "Informal Business / Market Vendor", value: "informal" },
          { title: "Partnership", value: "partnership" },
          { title: "Limited Liability Company (LLC / LTD)", value: "llc" },
          { title: "Corporation", value: "corporation" },
          { title: "Cooperative / Farmers Group", value: "cooperative" },
          { title: "Non-Profit / NGO / Association", value: "nonprofit" },
          { title: "Religious or Community Organization", value: "community" },
          { title: "Online-Only / Digital Business", value: "digital" },
          { title: "Other", value: "other" },
        ],
      },
    }),    
    defineField({
      name: "businessDescription",
      title: "Business Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessAddress",
      title: "Business Address",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessPhone",
      title: "Business Phone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "businessEmail",
      title: "Business Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "taxId",
      title: "Tax ID / EIN",
      type: "string",
    }),
    defineField({
      name: "websiteUrl",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "productsCategory",
      title: "Primary Product Category",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Fresh Produce (Fruits & Vegetables)", value: "produce" },
          { title: "Grains & Cereals", value: "grains" },
          { title: "Meat, Fish & Poultry", value: "meat_fish" },
          { title: "Dairy & Eggs", value: "dairy" },
          { title: "Packaged & Processed Foods", value: "packaged_foods" },
          { title: "Beverages (Non-Alcoholic & Alcoholic)", value: "beverages" },
          { title: "Clothing & Fashion", value: "fashion" },
          { title: "Footwear & Accessories", value: "footwear_accessories" },
          { title: "Electronics & Appliances", value: "electronics" },
          { title: "Phones & Phone Accessories", value: "phones" },
          { title: "Home & Kitchen Items", value: "home_kitchen" },
          { title: "Furniture & Home Decor", value: "furniture" },
          { title: "Building Materials & Hardware", value: "building_materials" },
          { title: "Farming Inputs & Agro-Supplies", value: "agro_supplies" },
          { title: "Beauty, Cosmetics & Personal Care", value: "beauty" },
          { title: "Health & Wellness Products", value: "health" },
          { title: "Books, Stationery & Education Supplies", value: "education" },
          { title: "Handmade Goods & Crafts", value: "crafts" },
          { title: "Services (Repairs, Printing, Cleaning, etc.)", value: "services" },
          { title: "Digital Products & Services", value: "digital_products" },
          { title: "Wholesale & Bulk Goods", value: "wholesale" },
          { title: "Other", value: "other" },
        ],
      },
    }),    
    defineField({
      name: "estimatedMonthlyRevenue",
      title: "Estimated Monthly Sales Volume",
      type: "string",
      options: {
        list: [
          { title: "MWK0 - MWK499,999", value: "0-499999" },
          { title: "MWK750,000 - MWK1,249,999", value: "750000-1249999" },
          { title: "MWK1,250,000 - MWK2,499,999", value: "1250000-2499999" },
          { title: "MWK2,500,000 - MWK4,999,999", value: "2500000-4999999" },
          { title: "MWK5,000,000 - MWK9,999,999", value: "5000000-9999999" },
          { title: "MWK10,000,000+", value: "10000000+" },
        ],
      },
    }),
    defineField({
      name: "status",
      title: "Application Status",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Pending Review", value: "pending" },
          { title: "Under Review", value: "reviewing" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "appliedAt",
      title: "Applied At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "reviewedAt",
      title: "Reviewed At",
      type: "datetime",
    }),
    defineField({
      name: "reviewedBy",
      title: "Reviewed By",
      type: "string",
      description: "Email of admin who reviewed the application",
    }),
    defineField({
      name: "approvalNotes",
      title: "Approval Notes",
      type: "text",
      description: "Internal notes for admin review",
    }),
    defineField({
      name: "rejectionReason",
      title: "Rejection Reason",
      type: "text",
      description: "Reason for rejection (shown to applicant)",
      hidden: ({ document }) => document?.status !== "rejected",
    }),
    defineField({
      name: "adminNotes",
      title: "Admin Notes",
      type: "text",
      description: "Private admin notes",
    }),
  ],
  preview: {
    select: {
      businessName: "businessName",
      userEmail: "userEmail",
      status: "status",
      appliedAt: "appliedAt",
    },
    prepare(select) {
      const { businessName, userEmail, status, appliedAt } = select;

      const statusEmojis: Record<string, string> = {
        pending: "⏳",
        reviewing: "🔍",
        approved: "✅",
        rejected: "❌",
      };

      return {
        title: `${statusEmojis[status] || ""} ${businessName}`,
        subtitle: `${userEmail} • ${new Date(appliedAt).toLocaleDateString()}`,
      };
    },
  },
});
