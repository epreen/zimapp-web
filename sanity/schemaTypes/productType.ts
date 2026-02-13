import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,

  fields: [
    /* =====================
       CORE PRODUCT INFO
    ===================== */

    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.min(1),
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),

    defineField({
      name: "price",
      title: "Base Price",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),

    defineField({
      name: "discount",
      title: "Discount (%)",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 0,
    }),

    defineField({
      name: "stock",
      title: "Stock Quantity",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),

    defineField({
      name: 'status',
      title: 'Product Status',
      type: 'string',
      options: {
        list: [
          {title: 'New', value: 'new'},
          {title: 'Hot', value: 'hot'},
          {title: 'Sale', value: 'sale'},
        ],
      },
    }),

    defineField({
      name: "hasBrand",
      title: "Has brand",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      hidden: ({ document }) => !document?.hasBrand,
    }),

    /* =====================
       DOMAIN ENABLE FLAGS
    ===================== */

    defineField({
      name: "isElectronic",
      title: "Electronic Product",
      type: "boolean",
      initialValue: false,
    }),

    /* =====================
       ELECTRONICS SECTION
    ===================== */

    defineField({
      name: "electronicDetails",
      title: "Electronic Details",
      type: "object",
      hidden: ({ document }) => !document?.isElectronic,
      fields: [
        defineField({ name: "model", type: "string" }),
        defineField({
          name: "warrantyMonths",
          title: "Warranty (Months)",
          type: "number",
        }),
        defineField({
          name: "isDevice",
          title: "Is a Device",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "specs",
          title: "Device Specifications",
          type: "object",
          hidden: ({ parent }) => !parent?.isDevice,
          fields: [
            defineField({ name: "ram", type: "string" }),
            defineField({ name: "storage", type: "string" }),
            defineField({
              name: "batteryCapacity",
              title: "Battery Capacity (mAh)",
              type: "number",
            }),
            defineField({
              name: "batteryHealth",
              title: "Battery Health (%)",
              type: "number",
              validation: (Rule) => Rule.min(0).max(100),
            }),
          ],
        }),
      ],
    }),

    /* =====================
       DOMAIN ENABLE FLAGS
    ===================== */

    defineField({
      name: "isClothing",
      title: "Clothing / Fashion Product",
      type: "boolean",
      initialValue: false,
    }),

    /* =====================
       CLOTHING SECTION
    ===================== */

    defineField({
      name: "clothingDetails",
      title: "Clothing Details",
      type: "object",
      hidden: ({ document }) => !document?.isClothing,
      fields: [
        defineField({
          name: "sizes",
          title: "Available Sizes",
          type: "array",
          of: [{ type: "reference", to: [{ type: "productSize" }] }],
        }),
        defineField({
          name: "colors",
          title: "Available Colors",
          type: "array",
          of: [{ type: "reference", to: [{ type: "productColor" }] }],
        }),
        defineField({
          name: "material",
          title: "Fabric / Material",
          type: "string",
        }),
        defineField({
          name: "gender",
          title: "Target Gender",
          type: "string",
          options: {
            list: ["Men", "Women", "Unisex", "Kids"],
          },
        }),
      ],
    }),

    /* =====================
       DOMAIN ENABLE FLAGS
    ===================== */

    defineField({
      name: "isConsumable",
      title: "Consumable Product",
      type: "boolean",
      initialValue: false,
    }),

    /* =====================
       CONSUMABLE SECTION
    ===================== */

    defineField({
      name: "consumableDetails",
      title: "Consumable Details",
      type: "object",
      hidden: ({ document }) => !document?.isConsumable,
      fields: [
        defineField({
          name: "weights",
          title: "Available Weights",
          type: "array",
          of: [{ type: "reference", to: [{ type: "productWeight" }] }],
        }),
        defineField({
          name: "expiryDate",
          title: "Expiry Date",
          type: "date",
        }),
        defineField({
          name: "batchNumber",
          title: "Batch / Lot Number",
          type: "string",
        }),
        defineField({
          name: "isPerishable",
          title: "Perishable",
          type: "boolean",
          initialValue: true,
        }),
      ],
    }),

    /* =====================
       DOMAIN ENABLE FLAGS
    ===================== */

    defineField({
      name: "isMaterial",
      title: "Material / Raw Product",
      type: "boolean",
      initialValue: false,
    }),

    /* =====================
       MATERIAL SECTION
    ===================== */

    defineField({
      name: "materialDetails",
      title: "Material Details",
      type: "object",
      hidden: ({ document }) => !document?.isMaterial,
      fields: [
        defineField({
          name: "materialType",
          title: "Material Type",
          type: "string",
          description: "e.g., Cement, Timber, Steel, Gravel",
        }),
        defineField({
          name: "grade",
          title: "Grade / Quality",
          type: "string",
        }),
        defineField({
          name: "weights",
          title: "Available Weights",
          type: "array",
          of: [{ type: "reference", to: [{ type: "productWeight" }] }],
        }),
      ],
    }),

    /* =====================
       VISIBILITY FLAGS
    ===================== */

    defineField({
      name: "isFeatured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "isOffer",
      title: "Offer Product",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: 'enableRatingsManagement',
      title: 'Ratings Management',
      type: 'boolean',
      description: 'Enable to view and manage product ratings and reviews',
      initialValue: false,
    }),

    defineField({
      name: 'averageRating',
      title: 'Average Rating',
      type: 'number',
      readOnly: true,
      description: 'Calculated average rating from approved reviews',
      validation: (Rule) => Rule.min(0).max(5),
      hidden: ({document}) => !document?.enableRatingsManagement,
    }),

    defineField({
      name: 'totalReviews',
      title: 'Total Reviews',
      type: 'number',
      readOnly: true,
      initialValue: 0,
      description: 'Total number of approved reviews',
      hidden: ({document}) => !document?.enableRatingsManagement,
    }),

    defineField({
      name: 'ratingDistribution',
      title: 'Rating Distribution',
      type: 'object',
      readOnly: true,
      description: 'Distribution of ratings (1-5 stars)',
      hidden: ({document}) => !document?.enableRatingsManagement,
      fields: [
        defineField({
          name: 'fiveStars',
          title: '5 Stars',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'fourStars',
          title: '4 Stars',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'threeStars',
          title: '3 Stars',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'twoStars',
          title: '2 Stars',
          type: 'number',
          initialValue: 0,
        }),
        defineField({
          name: 'oneStar',
          title: '1 Star',
          type: 'number',
          initialValue: 0,
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "name",
      media: "images.0",
      price: "price",
    },
    prepare({ title, media, price }) {
      return {
        title,
        subtitle: `MWK ${price}`,
        media,
      };
    },
  },
});