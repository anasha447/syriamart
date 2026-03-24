"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronLeft, Loader2, Plus, Trash2, Tag, Layers, Package, GripVertical } from "lucide-react";

import { useCreateProduct } from "@/hooks/useProducts";
import { useCategoryTree } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

const optionSchema = z.object({
  value: z.string().min(1, "Option value is required"),
  colorHex: z.string().optional(),
});

const variationSchema = z.object({
  name: z.string().min(1, "Variation name is required (e.g., Size, Color)"),
  options: z.array(optionSchema).min(1, "At least one option is required"),
});

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  basePrice: z.number().min(1, "Price must be greater than 0"),
  stockQuantity: z.number().min(0, "Stock cannot be negative"),
  categoryId: z.string().min(1, "Please select a category"),
  variations: z.array(variationSchema).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: categories } = useCategoryTree();
  const [activeTab, setActiveTab] = useState<"basic" | "variations">("basic");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      stockQuantity: 0,
      categoryId: "",
      variations: [],
    },
  });

  const { fields: variations, append: addVariation, remove: removeVariation } = useFieldArray({
    control,
    name: "variations",
  });

  const onSubmit = async (data: ProductFormData) => {
    // Transform variations to include displayOrder
    const payload = {
      ...data,
      variations: data.variations?.map((v, i) => ({
        ...v,
        displayOrder: i,
        options: v.options.map((o, j) => ({ ...o, displayOrder: j })),
      })),
    };

    createProduct.mutate(payload, {
      onSuccess: () => {
        router.push("/seller/products");
      },
    });
  };

  // Flatten categories into a selectable list (Parent > Child)
  const categoryOptions = React.useMemo(() => {
    if (!categories) return [];
    const opts: { id: string; name: string }[] = [];
    categories.forEach((cat) => {
      opts.push({ id: cat.id, name: cat.name });
      cat.subCategories.forEach((sub) => {
        opts.push({ id: sub.id, name: `${cat.name} > ${sub.name}` });
      });
    });
    return opts;
  }, [categories]);

  const fieldClass = (error?: boolean) => cn(
    "w-full h-11 px-3 rounded-xl border bg-background text-sm text-foreground",
    "placeholder:text-muted-foreground outline-none transition-all duration-150",
    "focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] dark:focus:ring-[#3B82F6]/20 dark:focus:border-[#3B82F6]",
    error ? "border-red-500" : "border-input"
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 page-enter pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/seller/products" className="p-2 rounded-full hover:bg-muted transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add New Product</h1>
            <p className="text-sm text-muted-foreground">Create a new product listing in your store.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button type="button" onClick={() => setActiveTab("basic")}
            className={cn("px-6 py-3 text-sm font-medium border-b-2 transition-colors", 
              activeTab === "basic" ? "border-[#1A365D] dark:border-[#3B82F6] text-[#1A365D] dark:text-[#3B82F6]" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Basic Info
          </button>
          <button type="button" onClick={() => setActiveTab("variations")}
            className={cn("px-6 py-3 text-sm font-medium border-b-2 transition-colors", 
              activeTab === "variations" ? "border-[#1A365D] dark:border-[#3B82F6] text-[#1A365D] dark:text-[#3B82F6]" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Variations & Options
          </button>
        </div>

        {/* BASIC TAB */}
        {activeTab === "basic" && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Product Name *</label>
                <input {...register("name")} placeholder="e.g., Wireless Noise Cancelling Headphones" className={fieldClass(!!errors.name)} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Category *</label>
                <div className="relative">
                  <select {...register("categoryId")} className={cn(fieldClass(!!errors.categoryId), "appearance-none cursor-pointer pr-10")}>
                    <option value="">Select a category</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                  <Tag className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Base Price (SYP) *</label>
                <input type="number" {...register("basePrice", { valueAsNumber: true })} placeholder="0" className={fieldClass(!!errors.basePrice)} />
                {errors.basePrice && <p className="text-xs text-red-500 mt-1">{errors.basePrice.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Initial Stock Quantity *</label>
                <input type="number" {...register("stockQuantity", { valueAsNumber: true })} placeholder="0" className={fieldClass(!!errors.stockQuantity)} />
                {errors.stockQuantity && <p className="text-xs text-red-500 mt-1">{errors.stockQuantity.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Description *</label>
                <textarea {...register("description")} rows={5} placeholder="Describe the product details..." className={cn(fieldClass(!!errors.description), "h-auto py-3 resize-none")} />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
              </div>

            </div>
          </div>
        )}

        {/* VARIATIONS TAB */}
        {activeTab === "variations" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {variations.length === 0 ? (
              <div className="bg-card border border-border border-dashed rounded-2xl p-10 text-center">
                <Layers className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No Variations</h3>
                <p className="text-sm text-muted-foreground mb-6">Does your product come in different sizes, colors, or materials?</p>
                <button type="button" onClick={() => addVariation({ name: "", options: [{ value: "" }] })}
                  className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add First Variation
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {variations.map((field, index) => (
                  <VariationBuilder 
                    key={field.id} 
                    index={index} 
                    control={control} 
                    register={register} 
                    errors={errors} 
                    onRemove={() => removeVariation(index)} 
                  />
                ))}
                
                <button type="button" onClick={() => addVariation({ name: "", options: [{ value: "" }] })}
                  className="w-full flex items-center justify-center gap-2 h-12 rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Another Variation (e.g. Size, Color)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Save Bar (Sticky Footer) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-border p-4 z-10 md:pl-64">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Product will be placed in review queue upon saving.</p>
            <div className="flex items-center gap-3">
              <Link href="/seller/products" className="h-11 px-6 rounded-xl font-medium flex items-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                Cancel
              </Link>
              <button type="submit" disabled={createProduct.isPending}
                className="btn-cta h-11 px-8 rounded-xl font-medium focus:ring-4 focus:ring-[#1A365D]/30"
              >
                {createProduct.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Package className="w-4 h-4 mr-2" />}
                Save Product
              </button>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

// ── Variation Sub-component ────────────────────────────────────────────────────────
function VariationBuilder({ index, control, register, errors, onRemove }: any) {
  const { fields: options, append, remove } = useFieldArray({
    control,
    name: `variations.${index}.options` as const,
  });

  const varErrors = errors?.variations?.[index];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm group">
      {/* Variation Header */}
      <div className="bg-muted/30 px-6 py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-3 w-1/2">
          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
          <input 
            {...register(`variations.${index}.name`)} 
            placeholder="Variation Name (e.g., Color)" 
            className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm font-medium outline-none focus:border-[#1A365D]"
          />
        </div>
        <button type="button" onClick={onRemove} className="p-2 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        {varErrors?.name && <p className="text-xs text-red-500 mb-4">{varErrors.name.message}</p>}
        {varErrors?.options?.root && <p className="text-xs text-red-500 mb-4">{varErrors.options.root.message}</p>}

        <div className="space-y-3">
          {options.map((opt, optIdx) => (
            <div key={opt.id} className="flex gap-3 items-start">
              <div className="flex-1">
                <input 
                  {...register(`variations.${index}.options.${optIdx}.value`)} 
                  placeholder="Option Value (e.g., Red, XL)" 
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-[#1A365D]"
                />
                {varErrors?.options?.[optIdx]?.value && <p className="text-xs text-red-500 mt-1">{varErrors.options[optIdx].value.message}</p>}
              </div>
              <div className="w-48">
                <input 
                  {...register(`variations.${index}.options.${optIdx}.colorHex`)} 
                  placeholder="Color Hex (Optional)" 
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-[#1A365D] font-mono"
                />
              </div>
              <button type="button" onClick={() => remove(optIdx)} className="h-10 px-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-red-500 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button type="button" onClick={() => append({ value: "" })} className="text-sm font-medium text-[#1A365D] dark:text-[#3B82F6] hover:underline flex items-center gap-1 mt-2">
            <Plus className="w-3.5 h-3.5" /> Add Option
          </button>
        </div>
      </div>
    </div>
  );
}
