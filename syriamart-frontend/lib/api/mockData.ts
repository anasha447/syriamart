import type { CategoryTreeResponse, ProductDetailResponse } from "@/types/api";

export const MOCK_CATEGORIES: CategoryTreeResponse[] = [
  {
    id: "cat-fashion",
    name: "Fashion & Apparel",
    description: "Trendy clothes, shoes, and accessories",
    slug: "fashion",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800",
    displayOrder: 1,
    subCategories: [
      {
        id: "sub-mens",
        name: "Men's Clothing",
        description: "Men's shirts, pants, and more",
        slug: "mens-clothing",
        imageUrl: null,
        displayOrder: 1,
      },
      {
        id: "sub-womens",
        name: "Women's Clothing",
        description: "Dresses, tops, and skirts",
        slug: "womens-clothing",
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
        displayOrder: 2,
      }
    ]
  },
  {
    id: "cat-electronics",
    name: "Electronics",
    description: "Gadgets, phones, and computers",
    slug: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800",
    displayOrder: 2,
    subCategories: [
      {
        id: "sub-phones",
        name: "Smartphones",
        description: "Latest mobile devices",
        slug: "smartphones",
        imageUrl: null,
        displayOrder: 1,
      },
      {
        id: "sub-laptops",
        name: "Laptops",
        description: "Powerful computers for work and play",
        slug: "laptops",
        imageUrl: null,
        displayOrder: 2,
      }
    ]
  }
];

export const MOCK_TOP_SELLING: ProductDetailResponse[] = [
  {
    id: "prod-1",
    name: "Classic White Sneakers",
    slug: "classic-white-sneakers",
    description: "Comfortable everyday wear.",
    sellerId: "biz-1",
    basePrice: 45.99,
    effectivePrice: 39.99,
    primaryImageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
    stockQuantity: 100,
    categoryId: "cat-fashion",
    subCategoryId: "sub-mens",
    images: [{ id: "img-1", url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600", isPrimary: true, displayOrder: 1, altText: "Sneakers" }],
    totalSold: 420,
    tags: "shoes,fashion",
    rejectionReason: null,
    variations: [],
    status: "ACTIVE",
    averageRating: 4.8,
    totalReviews: 124,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-2",
    name: "Wireless ANC Headphones",
    slug: "wireless-anc-headphones",
    description: "Noise cancelling over-ear headphones.",
    sellerId: "biz-2",
    basePrice: 199.99,
    effectivePrice: 199.99,
    primaryImageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600",
    stockQuantity: 50,
    categoryId: "cat-electronics",
    subCategoryId: null,
    images: [{ id: "img-2", url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600", isPrimary: true, displayOrder: 1, altText: "Headphones" }],
    totalSold: 120,
    tags: "electronics,audio",
    rejectionReason: null,
    variations: [],
    status: "ACTIVE",
    averageRating: 4.6,
    totalReviews: 89,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-3",
    name: "Summer Floral Dress",
    slug: "summer-floral-dress",
    description: "Lightweight and bright floral dress.",
    sellerId: "biz-1",
    basePrice: 55.00,
    effectivePrice: 49.50,
    primaryImageUrl: "https://images.unsplash.com/photo-1572804013309-8c98e0a294d1?auto=format&fit=crop&q=80&w=600",
    stockQuantity: 40,
    categoryId: "cat-fashion",
    subCategoryId: "sub-womens",
    images: [{ id: "img-3", url: "https://images.unsplash.com/photo-1572804013309-8c98e0a294d1?auto=format&fit=crop&q=80&w=600", isPrimary: true, displayOrder: 1, altText: "Dress" }],
    totalSold: 300,
    tags: "dress,fashion",
    rejectionReason: null,
    variations: [],
    status: "ACTIVE",
    averageRating: 4.9,
    totalReviews: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "prod-4",
    name: "Gaming Laptop Pro",
    slug: "gaming-laptop-pro",
    description: "High-performance gaming machine.",
    sellerId: "biz-3",
    basePrice: 1299.99,
    effectivePrice: 1199.99,
    primaryImageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600",
    stockQuantity: 15,
    categoryId: "cat-electronics",
    subCategoryId: "sub-laptops",
    images: [{ id: "img-4", url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=600", isPrimary: true, displayOrder: 1, altText: "Laptop" }],
    totalSold: 12,
    tags: "gaming,laptop",
    rejectionReason: null,
    variations: [],
    status: "ACTIVE",
    averageRating: 4.7,
    totalReviews: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const MOCK_TOP_RATED: ProductDetailResponse[] = [...MOCK_TOP_SELLING].reverse();
