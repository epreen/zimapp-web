import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const userType = defineType({
  name: "user",
  title: "User",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "firebaseUid",
      title: "Firebase User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "The unique Firebase user ID (UID)",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      description: "User's first name (auto-filled from Firebase displayName)",
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
      description: "User's last name (auto-filled from Firebase displayName)",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "dateOfBirth",
      title: "Date of Birth",
      type: "date",
    }),
    defineField({
      name: "profileImage",
      title: "Profile Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "profileImageUrl",
      title: "Profile Image URL",
      type: "url",
      description:
        "OAuth provider profile image URL (for Google, Github, etc.)",
    }),
    defineField({
      name: "addresses",
      title: "Addresses",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "address" }],
        }),
      ],
      description: "User's saved addresses",
    }),
    defineField({
      name: "preferences",
      title: "User Preferences",
      type: "object",
      fields: [
        defineField({
          name: "newsletter",
          title: "Newsletter Subscription",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "emailNotifications",
          title: "Email Notifications",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "smsNotifications",
          title: "SMS Notifications",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "preferredCurrency",
          title: "Preferred Currency",
          type: "string",
          options: {
            list: [
              { title: "MWK", value: "MWK" },
              { title: "USD", value: "USD" },
              { title: "EUR", value: "EUR" },
              { title: "GBP", value: "GBP" },
              { title: "CAD", value: "CAD" },
            ],
          },
          initialValue: "MWK",
        }),
        defineField({
          name: "preferredLanguage",
          title: "Preferred Language",
          type: "string",
          options: {
            list: [
              { title: "English", value: "en" },
              { title: "Chichewa", value: "ch" },
              { title: "Spanish", value: "es" },
              { title: "French", value: "fr" },
              { title: "German", value: "de" },
            ],
          },
          initialValue: "en",
        }),
      ],
    }),
    defineField({
      name: "rewardPoints",
      title: "Reward Points",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
      description: "User's accumulated reward points",
    }),
    defineField({
      name: "wishlist",
      title: "Wishlist",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "product" }],
        }),
      ],
      description: "User's wishlist products",
    }),
    defineField({
      name: "cart",
      title: "Shopping Cart",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
              initialValue: 1,
            }),
            defineField({
              name: "addedAt",
              title: "Added At",
              type: "datetime",
              initialValue: () => new Date().toISOString(),
            }),
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              description: "Selected size if applicable",
            }),
            defineField({
              name: "color",
              title: "Color",
              type: "string",
              description: "Selected color if applicable",
            }),
          ],
          preview: {
            select: {
              product: "product.name",
              quantity: "quantity",
              image: "product.image",
              price: "product.price",
            },
            prepare(select) {
              return {
                title: `${select.product} x ${select.quantity}`,
                subtitle: `$${select.price * select.quantity}`,
                media: select.image,
              };
            },
          },
        }),
      ],
      description: "User's shopping cart items",
    }),
    defineField({
      name: "orders",
      title: "Order History",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "order" }],
        }),
      ],
      description: "User's order history",
    }),
    defineField({
      name: "loyaltyPoints",
      title: "Loyalty Points",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "totalSpent",
      title: "Total Amount Spent",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    // Wallet/Balance System
    defineField({
      name: "walletBalance",
      title: "Wallet Balance",
      type: "number",
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
      description: "User's wallet balance from refunds and credits",
    }),
    defineField({
      name: "walletTransactions",
      title: "Wallet Transactions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Transaction ID",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "type",
              title: "Transaction Type",
              type: "string",
              options: {
                list: [
                  { title: "Credit (Refund)", value: "credit_refund" },
                  { title: "Credit (Manual)", value: "credit_manual" },
                  { title: "Debit (Order Payment)", value: "debit_order" },
                  { title: "Debit (Withdrawal)", value: "debit_withdrawal" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "amount",
              title: "Amount",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "balanceBefore",
              title: "Balance Before",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "balanceAfter",
              title: "Balance After",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "orderId",
              title: "Related Order ID",
              type: "string",
              description: "Order ID if transaction is related to an order",
            }),
            defineField({
              name: "withdrawalRequestId",
              title: "Withdrawal Request ID",
              type: "string",
              description: "Withdrawal request ID if applicable",
            }),
            defineField({
              name: "processedBy",
              title: "Processed By",
              type: "string",
              description: "Admin/system who processed this transaction",
            }),
            defineField({
              name: "createdAt",
              title: "Created At",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: [
                  { title: "Completed", value: "completed" },
                  { title: "Pending", value: "pending" },
                  { title: "Failed", value: "failed" },
                  { title: "Cancelled", value: "cancelled" },
                ],
              },
              initialValue: "completed",
            }),
          ],
          preview: {
            select: {
              type: "type",
              amount: "amount",
              description: "description",
              createdAt: "createdAt",
            },
            prepare(select) {
              const { type, amount, description, createdAt } = select;
              const sign = type.startsWith("credit") ? "+" : "-";
              return {
                title: `${sign}$${amount.toFixed(2)}`,
                subtitle: `${description} • ${new Date(
                  createdAt
                ).toLocaleDateString()}`,
              };
            },
          },
        }),
      ],
      description: "History of all wallet transactions",
    }),
    defineField({
      name: "withdrawalRequests",
      title: "Withdrawal Requests",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Request ID",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "amount",
              title: "Amount",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "method",
              title: "Withdrawal Method",
              type: "string",
              options: {
                list: [
                  { title: "Bank Transfer", value: "bank" },
                  { title: "PayPal", value: "paypal" },
                  { title: "Stripe", value: "stripe" },
                  { title: "Check", value: "check" },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "bankDetails",
              title: "Bank Details",
              type: "object",
              fields: [
                defineField({
                  name: "accountHolderName",
                  title: "Account Holder Name",
                  type: "string",
                }),
                defineField({
                  name: "bankName",
                  title: "Bank Name",
                  type: "string",
                }),
                defineField({
                  name: "accountNumber",
                  title: "Account Number",
                  type: "string",
                }),
                defineField({
                  name: "routingNumber",
                  title: "Routing Number",
                  type: "string",
                }),
                defineField({
                  name: "swiftCode",
                  title: "SWIFT Code",
                  type: "string",
                }),
              ],
              hidden: ({ parent }) => parent?.method !== "bank",
            }),
            defineField({
              name: "paypalEmail",
              title: "PayPal Email",
              type: "string",
              hidden: ({ parent }) => parent?.method !== "paypal",
            }),
            defineField({
              name: "status",
              title: "Status",
              type: "string",
              options: {
                list: [
                  { title: "Pending", value: "pending" },
                  { title: "Approved", value: "approved" },
                  { title: "Processing", value: "processing" },
                  { title: "Completed", value: "completed" },
                  { title: "Rejected", value: "rejected" },
                  { title: "Cancelled", value: "cancelled" },
                ],
              },
              initialValue: "pending",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "requestedAt",
              title: "Requested At",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "processedAt",
              title: "Processed At",
              type: "datetime",
            }),
            defineField({
              name: "processedBy",
              title: "Processed By",
              type: "string",
              description: "Admin who processed the request",
            }),
            defineField({
              name: "rejectionReason",
              title: "Rejection Reason",
              type: "text",
              hidden: ({ parent }) => parent?.status !== "rejected",
            }),
            defineField({
              name: "notes",
              title: "Admin Notes",
              type: "text",
              description: "Internal notes for admins",
            }),
            defineField({
              name: "transactionId",
              title: "Transaction ID",
              type: "string",
              description: "External transaction ID from payment processor",
            }),
          ],
          preview: {
            select: {
              amount: "amount",
              status: "status",
              method: "method",
              requestedAt: "requestedAt",
            },
            prepare(select) {
              const { amount, status, method, requestedAt } = select;
              return {
                title: `$${amount.toFixed(2)} - ${status}`,
                subtitle: `${method} • ${new Date(
                  requestedAt
                ).toLocaleDateString()}`,
              };
            },
          },
        }),
      ],
      description: "User's withdrawal requests",
    }),
    defineField({
      name: "lastLogin",
      title: "Last Login",
      type: "datetime",
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
      description:
        "Whether the user account is active (all users are active by default)",
    }),
    // Business Account System
    defineField({
      name: "isBusiness",
      title: "Is Business",
      type: "boolean",
      initialValue: false,
      description:
        "Whether the user is an approved business user who can sell products",
    }),
    defineField({
      name: "businessStatus",
      title: "Business Status",
      type: "string",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "Pending", value: "pending" },
          { title: "Active", value: "active" },
          { title: "Rejected", value: "rejected" },
          { title: "Suspended", value: "suspended" },
        ],
      },
      initialValue: "none",
      description: "Current status of business account application",
    }),
    defineField({
      name: "businessAppliedAt",
      title: "Business Applied At",
      type: "datetime",
      description: "When the user applied to become a business owner",
    }),
    defineField({
      name: "businessApprovedBy",
      title: "Business Approved By",
      type: "string",
      description: "Email of admin who approved/rejected Business application",
    }),
    defineField({
      name: "businessApprovedAt",
      title: "Business Approved At",
      type: "datetime",
      description: "When the Business account was approved",
    }),
    defineField({
      name: "businessRejectedAt",
      title: "Business Rejected At",
      type: "datetime",
      description: "When the Business application was rejected",
    }),
    defineField({
      name: "businessRejectionReason",
      title: "Business Rejection Reason",
      type: "text",
      description: "Reason for Business application rejection",
    }),
    defineField({
      name: "businessSuspendedAt",
      title: "Business Suspended At",
      type: "datetime",
      description: "When the Business account was suspended",
    }),
    defineField({
      name: "businessSuspendedBy",
      title: "Business Suspended By",
      type: "string",
      description: "Email of admin who suspended the Business",
    }),
    defineField({
      name: "businessSuspensionReason",
      title: "Business Suspension Reason",
      type: "text",
      description: "Reason for Business account suspension",
    }),
    defineField({
      name: "businessName",
      title: "Business Name",
      type: "string",
      description: "Business/store name for the Business",
      hidden: ({ document }) =>
        !document?.isBusiness && document?.businessStatus === "none",
    }),
    defineField({
      name: "businessDescription",
      title: "Business Description",
      type: "text",
      description: "Description of the business",
      hidden: ({ document }) =>
        !document?.isBusiness && document?.businessStatus === "none",
    }),
    defineField({
      name: "businessLogo",
      title: "Business Logo",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Logo for the business",
      hidden: ({ document }) =>
        !document?.isBusiness && document?.businessStatus === "none",
    }),
    defineField({
      name: "businessCommissionRate",
      title: "Business Commission Rate",
      type: "number",
      validation: (Rule) => Rule.min(0).max(100),
      initialValue: 15,
      description:
        "Commission percentage the platform takes from Business sales (default 15%)",
      hidden: ({ document }) => !document?.isBusiness,
    }),
    defineField({
      name: "businessPerformance",
      title: "Business Performance",
      type: "object",
      fields: [
        defineField({
          name: "totalProducts",
          title: "Total Products",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "activeProducts",
          title: "Active Products",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "totalSales",
          title: "Total Sales",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "totalRevenue",
          title: "Total Revenue",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "totalCommission",
          title: "Total Commission Paid",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "averageRating",
          title: "Average Rating",
          type: "number",
          initialValue: 0,
        }),
        defineField({
          name: "totalReviews",
          title: "Total Reviews",
          type: "number",
          initialValue: 0,
        }),
      ],
      hidden: ({ document }) => !document?.isBusiness,
    }),
    defineField({
      name: "isAdmin",
      title: "Is Admin",
      type: "boolean",
      initialValue: false,
      description:
        "Whether the user has admin privileges (can be set by admins or via environment variable)",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "notifications",
      title: "Notifications",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Notification ID",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "message",
              title: "Message",
              type: "text",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "type",
              title: "Notification Type",
              type: "string",
              options: {
                list: [
                  { title: "Promo", value: "promo" },
                  { title: "Order Update", value: "order" },
                  { title: "System", value: "system" },
                  { title: "Marketing", value: "marketing" },
                  { title: "General", value: "general" },
                ],
              },
              initialValue: "general",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "read",
              title: "Read Status",
              type: "boolean",
              initialValue: false,
            }),
            defineField({
              name: "priority",
              title: "Priority",
              type: "string",
              options: {
                list: [
                  { title: "Low", value: "low" },
                  { title: "Medium", value: "medium" },
                  { title: "High", value: "high" },
                  { title: "Urgent", value: "urgent" },
                ],
              },
              initialValue: "medium",
            }),
            defineField({
              name: "sentAt",
              title: "Sent At",
              type: "datetime",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "readAt",
              title: "Read At",
              type: "datetime",
            }),
            defineField({
              name: "sentBy",
              title: "Sent By",
              type: "string",
              description: "Admin email who sent this notification",
            }),
            defineField({
              name: "actionUrl",
              title: "Action URL",
              type: "url",
              description: "Optional URL for notification action",
            }),
          ],
          preview: {
            select: {
              title: "title",
              type: "type",
              read: "read",
              sentAt: "sentAt",
            },
            prepare(select) {
              const { title, type, read, sentAt } = select;
              return {
                title: title,
                subtitle: `${type} • ${read ? "Read" : "Unread"} • ${new Date(
                  sentAt
                ).toLocaleDateString()}`,
              };
            },
          },
        }),
      ],
      description: "User's notifications",
    }),
  ],
  preview: {
    select: {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      image: "profileImage",
      isActive: "isActive",
      isAdmin: "isAdmin",
      isBusiness: "isBusiness",
      businessStatus: "businessStatus",
    },
    prepare(select) {
      const {
        firstName,
        lastName,
        email,
        image,
        isActive,
        isAdmin,
        isBusiness,
        businessStatus,
      } = select;

      // Build title with status badges
      let title = `${firstName} ${lastName}`;

      if (isAdmin) {
        title += " 👑";
      }

      if (isBusiness && businessStatus === "active") {
        title += " 🏪";
      } else if (businessStatus === "pending") {
        title += " ⏳";
      }

      if (!isActive) {
        title += " ⛔";
      }

      return {
        title: title,
        subtitle: email,
        media: image || UserIcon,
      };
    },
  },
});
