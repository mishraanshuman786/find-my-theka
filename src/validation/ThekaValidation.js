import { z } from "zod";

// Step 1: Shop and owner details
export const thekaStep1Schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Theka name must be at least 2 characters")
    .max(150, "Theka name must not exceed 150 characters"),

  // Frontend-only field: not included in the backend schema
  ownerName: z
    .string()
    .trim()
    .min(1, "Owner name is required")
    .max(150, "Owner name must not exceed 150 characters"),

  contact_phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),

  gst_number: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
      "Enter a valid GST number",
    ),

  aadhaar_number: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "Aadhaar number must be 12 digits"),
});

// Step 2: License, address and location
export const thekaStep2Schema = z.object({
  license_number: z
    .string()
    .trim()
    .min(3, "License number must be at least 3 characters")
    .max(100, "License number must not exceed 100 characters"),

  license_expiry_date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter the date in YYYY-MM-DD format")
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);

      const date = new Date(Date.UTC(year, month - 1, day));

      return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
      );
    }, "Enter a valid license expiry date"),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must not exceed 500 characters"),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must not exceed 100 characters"),

  state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(100, "State must not exceed 100 characters"),

  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Invalid pincode"),

  // TextInput values are strings, so convert them to numbers
  // before applying the backend's numeric constraints.
  latitude: z
    .string()
    .trim()
    .min(1, "Latitude is required")
    .refine(
      (value) =>
        Number.isFinite(Number(value)) &&
        Number(value) >= -90 &&
        Number(value) <= 90,
      "Latitude must be between -90 and 90",
    ),

  longitude: z
    .string()
    .trim()
    .min(1, "Longitude is required")
    .refine(
      (value) =>
        Number.isFinite(Number(value)) &&
        Number(value) >= -180 &&
        Number(value) <= 180,
      "Longitude must be between -180 and 180",
    ),
});
