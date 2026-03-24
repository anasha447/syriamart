import { AuthenticationResponse, UserProfileResponse, UserRole, SellerDetailResponse } from "@/types/api";

export const MOCK_ADMIN: AuthenticationResponse = {
  token: "mock-admin-token",
  type: "Bearer",
  userId: "admin-1",
  email: "admin@syriamart.com",
  role: "ADMIN" as UserRole,
  firstName: "System",
  lastName: "Admin",
};

export const MOCK_SELLER_APPROVED: AuthenticationResponse = {
  token: "mock-seller-token",
  type: "Bearer",
  userId: "seller-1",
  email: "seller@syriamart.com",
  role: "SELLER" as UserRole,
  firstName: "Ahmad",
  lastName: "Sellers",
  storeName: "Syrian Organic Fruits",
};

// --- Stateful In-Memory Data ---
let PENDING_SELLERS: SellerDetailResponse[] = [
  {
    sellerId: "pending-1",
    storeName: "Old Damascus Spices",
    storeDescription: "Authentic spices from the heart of the old city.",
    storeImageUrl: null,
    status: "PENDING",
    email: "spices@example.com",
    phone: "+963 933 555 666",
    createdAt: new Date().toISOString(),
  }
];

let APPROVED_SELLERS: SellerDetailResponse[] = [
  {
    sellerId: "seller-1",
    storeName: "Syrian Organic Fruits",
    storeDescription: "Fresh organic fruits delivered to your door.",
    storeImageUrl: "https://images.unsplash.com/photo-1610832958506-ee56366376c8?w=800&auto=format&fit=crop&q=60",
    status: "ACTIVE",
    email: "seller@syriamart.com",
    phone: "+963 932 333 444",
    createdAt: "2024-01-05T12:00:00Z",
  }
];

export const getPendingSellers = () => PENDING_SELLERS;
export const getActiveSellers = () => APPROVED_SELLERS;

export const addPendingSeller = (data: any) => {
  const newSeller: SellerDetailResponse = {
    sellerId: `sel-${Math.random().toString(36).slice(2, 9)}`,
    storeName: data.storeName,
    storeDescription: data.storeDescription || null,
    storeImageUrl: null,
    status: "PENDING",
    email: data.email,
    phone: data.phone,
    createdAt: new Date().toISOString(),
  };
  PENDING_SELLERS.push(newSeller);
  return "Registration successful";
};

export const approveSeller = (sellerId: string) => {
  const idx = PENDING_SELLERS.findIndex(s => s.sellerId === sellerId);
  if (idx !== -1) {
    const [seller] = PENDING_SELLERS.splice(idx, 1);
    seller.status = "ACTIVE";
    APPROVED_SELLERS.push(seller);
  }
};

export const loginMock = (email: string): AuthenticationResponse | null => {
  if (email === "admin@syriamart.com") return MOCK_ADMIN;
  if (email === "seller@syriamart.com") return MOCK_SELLER_APPROVED;
  
  // Check approved sellers
  const seller = APPROVED_SELLERS.find(s => s.email === email);
  if (seller) {
    return {
      token: `mock-token-${seller.sellerId}`,
      type: "Bearer",
      userId: seller.sellerId,
      email: seller.email,
      role: "SELLER" as UserRole,
      storeName: seller.storeName,
    };
  }
  
  // Check pending (allow login but maybe it should fail? Let's allow for testing)
  const pending = PENDING_SELLERS.find(s => s.email === email);
  if (pending) {
    return {
      token: `mock-token-${pending.sellerId}`,
      type: "Bearer",
      userId: pending.sellerId,
      email: pending.email,
      role: "SELLER" as UserRole,
      storeName: pending.storeName,
    };
  }

  // Default mock for any other email (Customer)
  return {
    token: "mock-customer-token",
    type: "Bearer",
    userId: "cust-new",
    email,
    role: "CUSTOMER" as UserRole,
  };
};

export const MOCK_PROFILES: Record<string, UserProfileResponse> = {
  "admin-1": {
    id: "admin-1",
    fullName: "System Admin",
    email: "admin@syriamart.com",
    phone: "+963 931 111 222",
    role: "ADMIN",
    createdAt: "2024-01-01T10:00:00Z",
  },
  "seller-1": {
    id: "seller-1",
    fullName: "Ahmad Sellers",
    email: "seller@syriamart.com",
    phone: "+963 932 333 444",
    role: "SELLER",
    storeName: "Syrian Organic Fruits",
    createdAt: "2024-01-05T12:00:00Z",
  },
};

export const getProfileMock = (token: string): UserProfileResponse | null => {
  if (token === "mock-admin-token") return MOCK_PROFILES["admin-1"] || null;
  if (token === "mock-seller-token") return MOCK_PROFILES["seller-1"] || null;
  
  // Check sellers by token
  const sellerId = token.replace("mock-token-", "");
  const seller = [...APPROVED_SELLERS, ...PENDING_SELLERS].find(s => s.sellerId === sellerId);
  if (seller) {
    return {
      id: seller.sellerId,
      fullName: "New Vendor",
      email: seller.email,
      phone: seller.phone,
      role: "SELLER",
      storeName: seller.storeName,
      createdAt: seller.createdAt,
    };
  }

  return {
    id: "cust-new",
    fullName: "Mock Customer",
    email: "customer@example.com",
    phone: "+963 000 000 000",
    role: "CUSTOMER",
    createdAt: new Date().toISOString(),
  };
};
