"use client";

import React, { useState } from "react";
import { FolderTree, Plus, Pencil, Trash2, ChevronRight, ChevronDown, Loader2, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { 
  useCategoryTree, useCreateCategory, useUpdateCategory, useDeleteCategory,
  useCreateSubCategory, useUpdateSubCategory, useDeleteSubCategory 
} from "@/hooks/useCategories";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";
import type { CategoryResponse } from "@/types/api";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});
type CategoryFormData = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const { data: tree, isLoading } = useCategoryTree();
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  
  const createCat = useCreateCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();
  const createSub = useCreateSubCategory();
  const updateSub = useUpdateSubCategory();
  const deleteSub = useDeleteSubCategory();

  // Modal State
  const [modalMode, setModalMode] = useState<"CREATE_CAT" | "EDIT_CAT" | "CREATE_SUB" | "EDIT_SUB" | null>(null);
  const [activeItem, setActiveItem] = useState<{ id: string; parentId?: string; name: string; description?: string; imageUrl?: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const toggleExpand = (id: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openModal = (mode: typeof modalMode, item?: any, parentId?: string) => {
    setModalMode(mode);
    setActiveItem(item ? { ...item, parentId } : (parentId ? { id: "", parentId, name: "" } : null));
    reset({
      name: item?.name ?? "",
      description: item?.description ?? "",
      imageUrl: item?.imageUrl ?? "",
    });
  };

  const closeModal = () => {
    setModalMode(null);
    setActiveItem(null);
    reset();
  };

  const onSubmit = (data: CategoryFormData) => {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      imageUrl: data.imageUrl || undefined,
    };

    if (modalMode === "CREATE_CAT") {
      createCat.mutate(payload, { onSuccess: closeModal });
    } else if (modalMode === "EDIT_CAT" && activeItem) {
      updateCat.mutate({ id: activeItem.id, data: payload }, { onSuccess: closeModal });
    } else if (modalMode === "CREATE_SUB" && activeItem?.parentId) {
      createSub.mutate({ categoryId: activeItem.parentId, data: { name: payload.name, description: payload.description } }, { onSuccess: closeModal });
    } else if (modalMode === "EDIT_SUB" && activeItem) {
      updateSub.mutate({ id: activeItem.id, data: { name: payload.name, description: payload.description } }, { onSuccess: closeModal });
    }
  };

  const handleDelete = (isSub: boolean, id: string) => {
    if (!confirm(`Are you sure you want to delete this ${isSub ? 'sub-category' : 'category'}?`)) return;
    if (isSub) deleteSub.mutate(id);
    else deleteCat.mutate(id);
  };

  return (
    <div className="space-y-6 page-enter pb-12">
      <PageHeader
        title="Category Manager"
        description="Organize the platform's product taxonomy and hierarchy."
        action={
          <button onClick={() => openModal("CREATE_CAT")} className="btn-cta px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Root Category
          </button>
        }
      />

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : !tree?.length ? (
          <div className="p-12 text-center text-muted-foreground">
            <FolderTree className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No categories found. Start by creating a root category.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tree.map(cat => (
              <div key={cat.id} className="group flex flex-col transition-colors">
                
                {/* Root Category Row */}
                <div className="flex items-center justify-between p-4 hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleExpand(cat.id)} className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-muted-foreground hover:text-foreground">
                      {expandedCats.has(cat.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">{cat.name}</h4>
                      {cat.description && <p className="text-xs text-muted-foreground">{cat.description}</p>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openModal("CREATE_SUB", null, cat.id)} className="h-8 px-2.5 rounded text-xs font-medium text-[#1A365D] dark:text-[#3B82F6] hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      + Sub
                    </button>
                    <button onClick={() => openModal("EDIT_CAT", cat)} className="p-1.5 rounded text-muted-foreground hover:bg-muted text-xs">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(false, cat.id)} className="p-1.5 rounded text-muted-foreground hover:bg-red-50 hover:text-red-500 text-xs">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-Categories */}
                {expandedCats.has(cat.id) && (
                  <div className="bg-muted/10 border-t border-border/50">
                    {cat.subCategories?.length ? (
                      cat.subCategories.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between py-3 pr-4 pl-14 hover:bg-muted/40 group/sub border-b border-border/50 last:border-0">
                          <div>
                            <span className="font-medium text-foreground text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                              {sub.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                            <button onClick={() => openModal("EDIT_SUB", sub)} className="p-1.5 rounded text-muted-foreground hover:bg-muted text-xs">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDelete(true, sub.id)} className="p-1.5 rounded text-muted-foreground hover:bg-red-50 hover:text-red-500 text-xs">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-3 px-14 text-xs text-muted-foreground italic">No sub-categories yet.</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 flex justify-between items-center border-b border-border">
              <h3 className="text-lg font-bold text-foreground">
                {modalMode === "CREATE_CAT" && "Add Root Category"}
                {modalMode === "EDIT_CAT" && "Edit Category"}
                {modalMode === "CREATE_SUB" && "Add Sub-Category"}
                {modalMode === "EDIT_SUB" && "Edit Sub-Category"}
              </h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground"><XCircle className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name *</label>
                <input {...register("name")} className={cn("w-full h-10 px-3 rounded-lg border bg-background text-sm", errors.name ? "border-red-500" : "border-input focus:border-[#1A365D]")} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea {...register("description")} rows={3} className="w-full p-3 rounded-lg border border-input bg-background text-sm resize-none focus:border-[#1A365D]" />
              </div>

              {(modalMode === "CREATE_CAT" || modalMode === "EDIT_CAT") && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Image URL</label>
                  <input {...register("imageUrl")} placeholder="https://..." className={cn("w-full h-10 px-3 rounded-lg border bg-background text-sm", errors.imageUrl ? "border-red-500" : "border-input")} />
                  {errors.imageUrl && <p className="text-xs text-red-500 mt-1">{errors.imageUrl.message}</p>}
                </div>
              )}

              <div className="pt-4 border-t border-border flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-muted rounded-lg">Cancel</button>
                <button type="submit" className="btn-cta px-6 py-2 rounded-lg text-sm flex items-center gap-2">
                  {(createCat.isPending || updateCat.isPending || createSub.isPending || updateSub.isPending) ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
