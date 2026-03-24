import { z } from "zod";

const variationOptionSchema = z.object({
  value:        z.string().min(1, "Option value is required.").max(80),
  colorHex:     z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal("")),
  displayOrder: z.number().int().default(0),
});

const variationSchema = z.object({
  name:         z.string().min(1, "Variation name is required.").max(60),
  displayOrder: z.number().int().default(0),
  options:      z.array(variationOptionSchema).min(1, "Add at least one option."),
});

export const productCreateSchema = z.object({
  name:          z.string().min(2, "Product name must be at least 2 characters.").max(200),
  description:   z.string().max(5000).optional(),
  basePrice:     z.number({ invalid_type_error: "Price must be a number." }).positive("Price must be greater than 0."),
  stockQuantity: z.number().int().min(0).default(0),
  categoryId:    z.string().uuid("Please select a category."),
  subCategoryId: z.string().uuid().optional().or(z.literal("")),
  tags:          z.string().max(500).optional(),
  variations:    z.array(variationSchema).optional(),
});
export type ProductCreateFormData = z.infer<typeof productCreateSchema>;

export const productUpdateSchema = productCreateSchema.partial();
export type ProductUpdateFormData = z.infer<typeof productUpdateSchema>;

export const productModerationSchema = z.object({
  status:          z.enum(["ACTIVE", "REJECTED"]),
  rejectionReason: z.string().max(500).optional(),
}).refine(
  (data) => data.status !== "REJECTED" || (data.rejectionReason && data.rejectionReason.length > 0),
  { path: ["rejectionReason"], message: "Rejection reason is required when rejecting a product." }
);
export type ProductModerationFormData = z.infer<typeof productModerationSchema>;
