// lib/store-keywords.ts

export interface StoreKeyword {
  keyword: string;
  category: string;
  type: string;
  description: string;
}

export const STORE_KEYWORDS: Record<string, StoreKeyword[]> = {
  fashion: [
    {
      keyword: "streetwear",
      category: "fashion",
      type: "apparel",
      description: "Casual, urban-inspired clothing and accessories",
    },
    {
      keyword: "luxury clothing",
      category: "fashion",
      type: "premium",
      description: "High-end designer clothing and exclusive fashion items",
    },
    {
      keyword: "handmade apparel",
      category: "fashion",
      type: "artisan",
      description: "Locally or manually crafted clothing items",
    },
    {
      keyword: "custom tailoring",
      category: "fashion",
      type: "service",
      description: "Bespoke clothing made to customer measurements",
    },
  ],

  technology: [
    {
      keyword: "consumer electronics",
      category: "technology",
      type: "retail",
      description: "Phones, laptops, tablets, and personal electronic devices",
    },
    {
      keyword: "mobile accessories",
      category: "technology",
      type: "accessories",
      description: "Chargers, cases, cables, screen protectors",
    },
    {
      keyword: "smart devices",
      category: "technology",
      type: "iot",
      description: "Smart home devices, wearables, and connected electronics",
    },
    {
      keyword: "IT consulting",
      category: "technology",
      type: "service",
      description: "Professional technology advisory and support services",
    },
  ],

  food: [
    {
      keyword: "organic foods",
      category: "food",
      type: "retail",
      description: "Naturally grown food products without synthetic chemicals",
    },
    {
      keyword: "local produce",
      category: "food",
      type: "agriculture",
      description: "Fresh produce sourced from local farmers",
    },
    {
      keyword: "baked goods",
      category: "food",
      type: "bakery",
      description: "Bread, pastries, and other oven-baked products",
    },
    {
      keyword: "meal delivery",
      category: "food",
      type: "service",
      description: "Prepared meals delivered directly to customers",
    },
  ],

  creative: [
    {
      keyword: "graphic design",
      category: "creative",
      type: "service",
      description: "Visual design services for branding and marketing",
    },
    {
      keyword: "digital art",
      category: "creative",
      type: "digital",
      description: "Artwork created and distributed digitally",
    },
    {
      keyword: "photography",
      category: "creative",
      type: "media",
      description: "Professional photography services or photo sales",
    },
    {
      keyword: "content creation",
      category: "creative",
      type: "media",
      description: "Video, writing, and multimedia content production",
    },
  ],

  commerce: [
    {
      keyword: "online marketplace",
      category: "commerce",
      type: "platform",
      description: "Multi-vendor e-commerce platforms",
    },
    {
      keyword: "dropshipping",
      category: "commerce",
      type: "logistics",
      description: "Retail model without holding inventory",
    },
    {
      keyword: "wholesale",
      category: "commerce",
      type: "distribution",
      description: "Bulk selling to retailers or businesses",
    },
    {
      keyword: "subscription products",
      category: "commerce",
      type: "recurring",
      description: "Products delivered on a recurring basis",
    },
  ],
};