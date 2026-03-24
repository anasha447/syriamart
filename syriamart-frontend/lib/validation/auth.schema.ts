/**
 * lib/validation/auth.schema.ts
 *
 * Zod schemas for authentication forms.
 * Used by React Hook Form via @hookform/resolvers/zod.
 */

import { z } from "zod";

export const loginSchema = z.object({
  email:    z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
export type LoginFormData = z.infer<typeof loginSchema>;

const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.");

export const registerCustomerSchema = z
  .object({
    fullName:        z.string().min(2, "Full name must be at least 2 characters.").max(100),
    email:           z.string().email("Please enter a valid email address."),
    phone:           z.string().min(9, "Please enter a valid phone number.").max(20),
    password:        passwordRules,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path:    ["confirmPassword"],
    message: "Passwords do not match.",
  });
export type RegisterCustomerFormData = z.infer<typeof registerCustomerSchema>;

export const registerSellerSchema = registerCustomerSchema
  .innerType()
  .extend({
    storeName:        z.string().min(2, "Store name must be at least 2 characters.").max(100),
    storeDescription: z.string().max(500).optional(),
    confirmPassword:  z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path:    ["confirmPassword"],
    message: "Passwords do not match.",
  });
export type RegisterSellerFormData = z.infer<typeof registerSellerSchema>;
