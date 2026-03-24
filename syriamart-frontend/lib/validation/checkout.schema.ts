import { z } from "zod";

export const checkoutSchema = z.object({
  shippingFullName:     z.string().min(2, "Full name is required.").max(120),
  shippingPhone:        z.string().min(9, "Please enter a valid phone number.").max(20),
  shippingAddressLine1: z.string().min(5, "Address is required.").max(200),
  shippingAddressLine2: z.string().max(200).optional(),
  shippingCity:         z.string().min(2, "City is required.").max(80),
  shippingGovernorate:  z.string().min(2, "Governorate is required.").max(80),
  couponCode:           z.string().max(30).optional(),
  notes:                z.string().max(500).optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
