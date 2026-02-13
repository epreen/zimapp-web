// schemas/customer.ts

import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const customerType = defineType({
  name: "customer",
  title: "Customer",
  type: "document",
  icon: UserIcon,

  groups: [
    { name: "details", title: "Customer Details", default: true },
    { name: "paychangu", title: "PayChangu" },
    { name: "relations", title: "Relations" },
  ],

  fields: [
    // ─────────────────────────────────────────────
    // Relations
    // ─────────────────────────────────────────────
    defineField({
      name: "store",
      title: "Store",
      type: "reference",
      to: [{ type: "store" }],
      group: "relations",
      validation: (rule) =>
        rule.required().error("Customer must belong to a store"),
    }),

    // ─────────────────────────────────────────────
    // Customer details
    // ─────────────────────────────────────────────
    defineField({
      name: "email",
      type: "string",
      group: "details",
      validation: (rule) =>
        rule.required().email().error("Valid email is required"),
    }),

    defineField({
      name: "name",
      type: "string",
      group: "details",
      description: "Customer full name",
    }),

    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      group: "details",
      description: "Unique Clerk user ID for authentication",
      validation: (rule) =>
        rule.required().error("Clerk user ID is required"),
    }),

    // ─────────────────────────────────────────────
    // PayChangu
    // ─────────────────────────────────────────────
    defineField({
      name: "paychanguCustomerId",
      title: "PayChangu Customer ID",
      type: "string",
      group: "paychangu",
      readOnly: true,
      description: "Customer identifier in PayChangu",
    }),

    defineField({
      name: "paychanguStatus",
      title: "PayChangu Status",
      type: "string",
      group: "paychangu",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Pending", value: "pending" },
          { title: "Disabled", value: "disabled" },
        ],
      },
      initialValue: "pending",
      readOnly: true,
    }),

    // ─────────────────────────────────────────────
    // Metadata
    // ─────────────────────────────────────────────
    defineField({
      name: "createdAt",
      type: "datetime",
      group: "details",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],

  preview: {
    select: {
      name: "name",
      email: "email",
      store: "store.name",
      paychanguCustomerId: "paychanguCustomerId",
    },
    prepare({ name, email, store, paychanguCustomerId }) {
      return {
        title: name ?? email ?? "Unknown Customer",
        subtitle: [
          store ? `Store: ${store}` : null,
          paychanguCustomerId ? `PayChangu: ${paychanguCustomerId}` : null,
        ]
          .filter(Boolean)
          .join(" • "),
      };
    },
  },

  orderings: [
    {
      title: "Newest First",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Email A–Z",
      name: "emailAsc",
      by: [{ field: "email", direction: "asc" }],
    },
  ],
});