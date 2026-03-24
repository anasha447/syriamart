import { z } from "zod";

export const driverLoginSchema = z.object({
  email:    z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
export type DriverLoginFormData = z.infer<typeof driverLoginSchema>;

export const deliveryProofSchema = z.object({
  recipientName:    z.string().min(2, "Recipient name is required.").max(120),
  signatureImageUrl: z.string().min(1, "Signature is required."),
  photoProofUrl:    z.string().optional(),
  notes:            z.string().max(500).optional(),
});
export type DeliveryProofFormData = z.infer<typeof deliveryProofSchema>;

export const scanPackageSchema = z.object({
  orderId:   z.string().min(1, "Order ID is required."),
  scanCode:  z.string().min(1, "Scan code is required."),
  eventType: z.enum([
    "INBOUND_WAREHOUSE", "OUTBOUND_WAREHOUSE", "DRIVER_PICKUP",
    "IN_TRANSIT", "DELIVERED", "PICKUP_POINT_DROP",
    "RETURN_INITIATED", "RETURN_RECEIVED",
  ]),
  location:  z.string().min(1, "Location is required.").max(200),
  notes:     z.string().max(500).optional(),
});
export type ScanPackageFormData = z.infer<typeof scanPackageSchema>;
