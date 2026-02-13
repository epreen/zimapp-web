import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const PersonelType = defineType({
  name: "personel",
  title: "Personel",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "firebaseUid",
      title: "Firebase Personel ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "The unique Firebase Personel ID (UID)",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "firstName",
      title: "First Name",
      type: "string",
      description: "Personel's first name",
    }),
    defineField({
      name: "lastName",
      title: "Last Name",
      type: "string",
      description: "Personel's last name",
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
      name: "addresses",
      title: "Addresses",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "address" }],
        }),
      ],
      description: "Personel's saved addresses",
    }),
    // Employee fields
    defineField({
      name: "isEmployee",
      title: "Is Employee",
      type: "boolean",
      initialValue: true,
      description: "Whether the personel is an employee",
    }),
    defineField({
      name: "employeeRole",
      title: "Employee Role",
      type: "string",
      options: {
        list: [
          { title: "Call Center", value: "callcenter" },
          { title: "Packer", value: "packer" },
          { title: "Warehouse", value: "warehouse" },
          { title: "Delivery Man", value: "deliveryman" },
          { title: "In-Charge", value: "incharge" },
          { title: "Accounts", value: "accounts" },
        ],
      },
      description: "Employee role if Personel is an employee",
      hidden: ({ document }) => !document?.isEmployee,
    }),
    defineField({
      name: "employeeStatus",
      title: "Employee Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Inactive", value: "inactive" },
          { title: "Suspended", value: "suspended" },
        ],
      },
      initialValue: "active",
      description: "Current employment status",
      hidden: ({ document }) => !document?.isEmployee,
    }),
    defineField({
      name: "employeeAssignedBy",
      title: "Employee Assigned By",
      type: "string",
      description: "Email of business owner who assigned employee role",
      hidden: ({ document }) => !document?.isEmployee,
    }),
    defineField({
      name: "employeeAssignedAt",
      title: "Employee Assigned At",
      type: "datetime",
      description: "When the employee role was assigned",
      hidden: ({ document }) => !document?.isEmployee,
    }),
    defineField({
      name: "employeeSuspendedBy",
      title: "Employee Suspended By",
      type: "string",
      description: "Email of business owner who suspended the employee",
      hidden: ({ document }) =>
        !document?.isEmployee || document?.employeeStatus !== "suspended",
    }),
    defineField({
      name: "employeeSuspendedAt",
      title: "Employee Suspended At",
      type: "datetime",
      description: "When the employee was suspended",
      hidden: ({ document }) =>
        !document?.isEmployee || document?.employeeStatus !== "suspended",
    }),
    defineField({
      name: "employeeSuspensionReason",
      title: "Suspension Reason",
      type: "text",
      description: "Reason for employee suspension",
      hidden: ({ document }) =>
        !document?.isEmployee || document?.employeeStatus !== "suspended",
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
  ],
  preview: {
    select: {
      firstName: "firstName",
      lastName: "lastName",
      email: "email",
      isActive: "isActive",
      isEmployee: "isEmployee",
      employeeRole: "employeeRole",
    },
    prepare(select) {
      const {
        firstName,
        lastName,
        email,
        isActive,
        isEmployee,
        employeeRole,
      } = select;

      // Build title with status badges
      let title = `${firstName} ${lastName}`;

      if (isEmployee && employeeRole) {
        const roleLabels: Record<string, string> = {
          callcenter: "Call Center 📞",
          packer: "Packer 📦",
          warehouse: "Warehouse 🏢",
          deliveryman: "Delivery 🚚",
          incharge: "In-Charge 👔",
          accounts: "Accounts 💰",
        };
        title += ` [${roleLabels[employeeRole] || employeeRole}]`;
      } else if (isEmployee) {
        title += " [Employee]";
      }

      if (!isActive) {
        title += " (Inactive) ⛔";
      }

      return {
        title: title,
        subtitle: email,
        media: UserIcon,
      };
    },
  },
});