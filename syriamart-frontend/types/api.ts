/**
 * types/api.ts
 *
 * TypeScript interfaces mapped exactly from Spring Boot DTOs in
 * commercial-service, user-service, and logistics-service.
 *
 * Convention:
 *   - Names match the Java record names exactly (PascalCase)
 *   - Java `String` → `string`, `BigDecimal` → `number`,
 *     `LocalDateTime` → `string` (ISO-8601 from JSON serializer),
 *     `List<T>` → `T[]`, nullable → `T | null`
 */

// ═══════════════════════════════════════════════════════════════════════════
// SHARED / COMMON
// ═══════════════════════════════════════════════════════════════════════════

export interface PageResponse<T> {
  content:      T[];
  pageNumber:   number;
  pageSize:     number;
  totalElements: number;
  totalPages:   number;
  first:        boolean;
  last:         boolean;
}

export interface ErrorResponse {
  status:    number;
  error:     string;
  message:   string;
  path:      string;
  timestamp: string;
  details:   string[] | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// USER-SERVICE
// ═══════════════════════════════════════════════════════════════════════════

export type UserRole = "ADMIN" | "SELLER" | "CUSTOMER" | "DRIVER";
export type SellerStatus = "PENDING" | "ACTIVE" | "SUSPENDED";
export type AddressType = "HOME" | "WORK" | "STORE" | "OTHER";

export interface AuthenticationResponse {
  token:     string;
  type:      string;      // "Bearer"
  userId:    string;
  email:     string;
  role:      UserRole;
  firstName?: string;
  lastName?:  string;
  storeName?: string;
}

export interface UserProfileResponse {
  id:        string;
  fullName:  string;
  email:     string;
  phone:     string;
  role:      UserRole;
  storeName?: string;
  addresses?: AddressResponse[];
  createdAt: string;
}

export interface AddressResponse {
  id:           string;
  fullName:     string;
  phone:        string;
  addressLine1: string;
  addressLine2: string | null;
  city:         string;
  governorate:  string;
  type:         AddressType;
}

export interface SellerDetailResponse {
  sellerId:      string;
  storeName:     string;
  storeDescription: string | null;
  storeImageUrl: string | null;
  status:        SellerStatus;
  email:         string;
  phone:         string;
  createdAt:     string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMERCIAL-SERVICE — Categories
// ═══════════════════════════════════════════════════════════════════════════

export interface CategoryResponse {
  id:           string;
  name:         string;
  slug:         string;
  description:  string | null;
  imageUrl:     string | null;
  active:       boolean;
  displayOrder: number;
}

export interface CategoryTreeResponse {
  id:            string;
  name:          string;
  slug:          string;
  description:   string | null;
  imageUrl:      string | null;
  displayOrder:  number;
  subCategories: SubCategoryResponse[];
}

export interface SubCategoryResponse {
  id:           string;
  name:         string;
  slug:         string;
  description:  string | null;
  imageUrl:     string | null;
  displayOrder: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMERCIAL-SERVICE — Products
// ═══════════════════════════════════════════════════════════════════════════

export type ProductStatus =
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "INACTIVE"
  | "REJECTED"
  | "ARCHIVED";

export interface ProductImageResponse {
  id:           string;
  url:          string;
  isPrimary:    boolean;
  displayOrder: number;
  altText:      string | null;
}

export interface VariationOptionResponse {
  id:           string;
  value:        string;
  colorHex:     string | null;
  displayOrder: number;
}

export interface ProductVariationResponse {
  id:           string;
  name:         string;
  displayOrder: number;
  options:      VariationOptionResponse[];
}

export interface ProductSummaryResponse {
  id:              string;
  name:            string;
  slug:            string;
  basePrice:       number;
  effectivePrice:  number;
  primaryImageUrl: string | null;
  averageRating:   number;
  totalReviews:    number;
  status:          ProductStatus;
  categoryId:      string;
  sellerId:        string;
  totalSold:       number;
}

export interface ProductDetailResponse {
  id:              string;
  name:            string;
  slug:            string;
  description:     string | null;
  tags:            string | null;
  basePrice:       number;
  effectivePrice:  number;
  primaryImageUrl: string | null;
  stockQuantity:   number;
  status:          ProductStatus;
  rejectionReason: string | null;
  averageRating:   number;
  totalReviews:    number;
  totalSold:       number;
  sellerId:        string;
  categoryId:      string;
  subCategoryId:   string | null;
  images:          ProductImageResponse[];
  variations:      ProductVariationResponse[];
  createdAt:       string;
  updatedAt:       string;
}

export interface ProductListResponse {
  products:      ProductSummaryResponse[];
  page:          number;
  size:          number;
  totalElements: number;
  totalPages:    number;
}

export interface ProductCatalogResponse {
  categoryId:    string;
  categoryName:  string | null;
  subCategoryId: string | null;
  products:      ProductSummaryResponse[];
  page:          number;
  size:          number;
  totalElements: number;
  totalPages:    number;
}

export interface ProductSearchResponse {
  query:         string;
  results:       ProductSummaryResponse[];
  page:          number;
  size:          number;
  totalElements: number;
  totalPages:    number;
}

export interface ProductModerationQueueResponse {
  products:     ProductSummaryResponse[];
  totalPending: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMERCIAL-SERVICE — Cart
// ═══════════════════════════════════════════════════════════════════════════

export interface CartItemResponse {
  cartItemId:       string;
  productId:        string;
  productName:      string;
  variationValueId: string | null;
  variationSummary: string | null;
  imageUrl:         string | null;
  unitPrice:        number;
  quantity:         number;
  lineTotal:        number;
  inStock:          boolean;
}

export interface CartResponse {
  cartId:            string;
  customerId:        string;
  items:             CartItemResponse[];
  subtotal:          number;
  appliedCouponCode: string | null;
  discountAmount:    number;
  estimatedTotal:    number;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMERCIAL-SERVICE — Orders
// ═══════════════════════════════════════════════════════════════════════════

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED"
  | "RETURN_REQUESTED"
  | "RETURNED";

export type OrderItemStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED";

export interface OrderItemResponse {
  id:               string;
  productId:        string;
  productName:      string;
  variationSnapshot: string | null;
  imageUrl:         string | null;
  unitPrice:        number;
  quantity:         number;
  lineTotal:        number;
  status:           OrderItemStatus;
  sellerId:         string;
  sellerNote:       string | null;
}

export interface OrderDetailResponse {
  id:                  string;
  customerId:          string;
  status:              OrderStatus;
  trackingNumber:      string | null;
  shippingFullName:    string;
  shippingPhone:       string;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingCity:        string;
  shippingGovernorate: string;
  subtotal:            number;
  discountAmount:      number;
  shippingFee:         number;
  total:               number;
  couponCode:          string | null;
  notes:               string | null;
  items:               OrderItemResponse[];
  createdAt:           string;
  updatedAt:           string;
}

export interface OrderListResponse {
  id:             string;
  status:         OrderStatus;
  total:          number;
  itemCount:      number;
  trackingNumber: string | null;
  createdAt:      string;
}

export interface OrderSellerViewResponse {
  orderId:          string;
  customerId:       string;
  shippingFullName: string;
  shippingPhone:    string;
  shippingCity:     string;
  shippingGovernorate: string;
  items:            OrderItemResponse[];
  sellerSubtotal:   number;
  aggregateStatus:  OrderItemStatus;
  orderedAt:        string;
}

export interface CheckoutSummaryResponse {
  orderId:          string;
  items:            OrderItemResponse[];
  subtotal:         number;
  discountAmount:   number;
  shippingFee:      number;
  total:            number;
  appliedCouponCode: string | null;
  message:          string;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMERCIAL-SERVICE — Reviews
// ═══════════════════════════════════════════════════════════════════════════

export interface ReviewResponse {
  id:               string;
  productId:        string;
  customerId:       string;
  rating:           number;
  comment:          string | null;
  verifiedPurchase: boolean;
  sellerReply:      string | null;
  createdAt:        string;
}

export interface ReviewSummaryResponse {
  averageRating:      number;
  totalReviews:       number;
  ratingDistribution: Record<string, number>;  // "1"–"5" → count
  recentReviews:      ReviewResponse[];
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMERCIAL-SERVICE — Coupons & Discounts
// ═══════════════════════════════════════════════════════════════════════════

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export interface CouponResponse {
  id:               string;
  code:             string;
  description:      string | null;
  discountType:     DiscountType;
  discountValue:    number;
  minOrderAmount:   number;
  maxDiscountAmount: number | null;
  validFrom:        string;
  validTo:          string;
  usageLimit:       number | null;
  usageCount:       number;
  perUserLimit:     number;
  active:           boolean;
  sellerId:         string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMERCIAL-SERVICE — Wishlist
// ═══════════════════════════════════════════════════════════════════════════

export interface WishlistItemResponse {
  id:      string;
  product: ProductSummaryResponse;
  addedAt: string;
}

export interface WishlistResponse {
  id:          string;
  name:        string;
  defaultList: boolean;
  items:       WishlistItemResponse[];
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMERCIAL-SERVICE — Dashboards
// ═══════════════════════════════════════════════════════════════════════════

export interface SellerAnalyticsResponse {
  sellerId:          string;
  year:              number;
  month:             number;
  totalOrders:       number;
  completedOrders:   number;
  cancelledOrders:   number;
  returnedOrders:    number;
  totalRevenue:      number;
  totalItemsSold:    number;
  averageOrderValue: number;
  averageRating:     number;
  totalReviews:      number;
  returnRate:        number;
}

export interface MonthlyRevenue {
  year:    number;
  month:   number;
  revenue: number;
}

export interface RevenueBreakdownResponse {
  totalRevenue:       number;
  platformCommission: number;
  monthly:            MonthlyRevenue[];
}

export interface SellerListResponse {
  sellerId:      string;
  storeName:     string | null;
  totalProducts: number;
  totalOrders:   number;
  totalRevenue:  number;
  averageRating: number;
}

export interface SellerDashboardResponse {
  sellerId:         string;
  activeProducts:   number;
  pendingProducts:  number;
  ordersThisMonth:  number;
  revenueThisMonth: number;
  averageRating:    number;
  recentOrders:     OrderListResponse[];
  topProducts:      ProductSummaryResponse[];
}

export interface AdminDashboardResponse {
  revenueThisMonth:       number;
  ordersThisMonth:        number;
  activeSellers:          number;
  pendingProductModeration: number;
  totalCustomers:         number;
  topSellers:             SellerListResponse[];
  topProducts:            ProductSummaryResponse[];
  revenueChart:           MonthlyRevenue[];
}

export interface PlatformAnalyticsResponse {
  year:                number;
  month:               number;
  totalOrders:         number;
  totalRevenue:        number;
  totalCustomers:      number;
  activeSellers:       number;
  newProductsListed:   number;
  productsPendingReview: number;
  platformCommission:  number;
  cancelledOrders:     number;
  returnedOrders:      number;
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGISTICS-SERVICE — Driver
// ═══════════════════════════════════════════════════════════════════════════

export type DriverStatus =
  | "OFFLINE"
  | "AVAILABLE"
  | "ON_DELIVERY"
  | "ON_BREAK"
  | "SUSPENDED";

export type ScanEventType =
  | "INBOUND_WAREHOUSE"
  | "OUTBOUND_WAREHOUSE"
  | "DRIVER_PICKUP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "PICKUP_POINT_DROP"
  | "RETURN_INITIATED"
  | "RETURN_RECEIVED";

export type ShiftStatus = "ACTIVE" | "COMPLETED" | "ABANDONED";

export interface DriverLoginResponse {
  token:     string;
  type:      string;
  driverId:  string;
  firstName: string;
  lastName:  string;
  email:     string;
  phone:     string;
  status:    DriverStatus;
}

export interface DriverProfileResponse {
  id:               string;
  firstName:        string;
  lastName:         string;
  email:            string;
  phone:            string;
  status:           DriverStatus;
  profilePhotoUrl:  string | null;
  vehicleType:      string;
  vehicleMake:      string | null;
  vehicleModel:     string | null;
  vehicleYear:      number | null;
  vehiclePlate:     string | null;
  vehicleColor:     string | null;
  licenseNumber:    string | null;
  licenseExpiry:    string | null;
  averageRating:    number;
  totalDeliveries:  number;
  successRate:      number;
  totalEarnings:    number;
  pendingPayout:    number;
}

export interface ScanConfirmationResponse {
  scanEventId:      string;
  orderId:          string;
  eventType:        ScanEventType;
  newOrderStatus:   OrderStatus;
  location:         string;
  scannedAt:        string;
  message:          string;
}

export interface AssignedOrderResponse {
  orderId:              string;
  currentStatus:        OrderStatus;
  customerName:         string | null;
  customerPhone:        string | null;
  shippingAddressLine1: string | null;
  shippingAddressLine2: string | null;
  city:                 string | null;
  governorate:          string | null;
  destinationLatitude:  number | null;
  destinationLongitude: number | null;
  notes:                string | null;
  lastScanLocation:     string | null;
}

export interface ShiftSummaryResponse {
  shiftId:              string;
  driverId:             string;
  status:               ShiftStatus;
  startedAt:            string;
  endedAt:              string | null;
  deliveriesCompleted:  number;
  deliveriesFailed:     number;
  returnsHandled:       number;
  totalDistanceKm:      number;
  shiftEarnings:        number;
  summary:              string | null;
}

export interface DriverDashboardResponse {
  driverId:           string;
  fullName:           string;
  currentStatus:      DriverStatus;
  deliveriesToday:    number;
  deliveriesThisMonth: number;
  earningsToday:      number;
  earningsThisMonth:  number;
  pendingPayout:      number;
  unreadMessages:     number;
  activeOrders:       AssignedOrderResponse[];
}

export interface PayoutResponse {
  driverId:            string;
  totalEarnings:       number;
  pendingPayout:       number;
  paidOut:             number;
  lastPayoutDate:      string | null;
  completedDeliveries: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGISTICS-SERVICE — Tracking
// ═══════════════════════════════════════════════════════════════════════════

export interface ScanEventResponse {
  id:        string;
  orderId:   string;
  eventType: ScanEventType;
  location:  string;
  latitude:  number | null;
  longitude: number | null;
  notes:     string | null;
  scannedAt: string;
}

export interface OrderTrackingResponse {
  orderId:             string;
  trackingNumber:      string | null;
  currentStatus:       OrderStatus;
  estimatedDeliveryCity: string | null;
  assignedDriverName:  string | null;
  lastUpdated:         string | null;
  timeline:            ScanEventResponse[];
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGISTICS-SERVICE — Messages
// ═══════════════════════════════════════════════════════════════════════════

export interface MessageResponse {
  id:           string;
  senderId:     string;
  senderRole:   string;
  receiverId:   string;
  receiverRole: string;
  orderId:      string | null;
  content:      string;
  read:         boolean;
  createdAt:    string;
  attachmentUrl: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGISTICS-SERVICE — Pickup Points
// ═══════════════════════════════════════════════════════════════════════════

export interface PickupPointResponse {
  id:              string;
  name:            string;
  addressLine1:    string;
  addressLine2:    string | null;
  city:            string;
  governorate:     string;
  latitude:        number | null;
  longitude:       number | null;
  contactPhone:    string | null;
  operatingHours:  string | null;
  maxCapacity:     number;
  currentOccupancy: number;
  active:          boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// REQUEST types (forms → API body)
// ═══════════════════════════════════════════════════════════════════════════

export interface UserLoginRequest {
  email:    string;
  password: string;
}

export interface UserRegistrationRequest {
  fullName:  string;
  email:     string;
  phone:     string;
  password:  string;
}

export interface CheckoutRequest {
  shippingFullName:    string;
  shippingPhone:       string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity:        string;
  shippingGovernorate: string;
  couponCode?:         string;
  notes?:              string;
}

export interface CartAddItemRequest {
  productId:        string;
  variationValueId?: string;
  quantity:         number;
}

export interface ScanPackageRequest {
  orderId:   string;
  scanCode:  string;
  eventType: ScanEventType;
  location:  string;
  latitude?: number;
  longitude?: number;
  notes?:    string;
}

export interface DeliveryProofRequest {
  signatureImageUrl: string;
  recipientName:     string;
  photoProofUrl?:    string;
  notes?:            string;
  latitude?:         number;
  longitude?:        number;
}

export interface DriverLoginRequest {
  email:    string;
  password: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ADDITIONAL TYPES — Request bodies & missing response shapes
// ═══════════════════════════════════════════════════════════════════════════

/** Body for POST /api/sellers/{id}/approve — sets profitPercentage (margin). */
export interface SellerApprovalRequest {
  approved:          boolean;
  profitPercentage?: number;   // 0–100, commission rate; required when approved=true
  rejectionReason?:  string;   // required when approved=false
}

export interface SellerProfileUpdateRequest {
  storeName?:         string;
  storeDescription?:  string;
  storeImageUrl?:     string;
  phone?:             string;
}

export interface UserProfileUpdateRequest {
  fullName?: string;
  phone?:    string;
}


export interface DiscountResponse {
  id:             string;
  productId:      string | null;
  categoryId:     string | null;
  discountType:   DiscountType;
  discountValue:  number;
  validFrom:      string;
  validTo:        string;
  active:         boolean;
  sellerId:       string | null;
}

export interface OrderStatusEventResponse {
  orderItemId: string;
  newStatus:   OrderItemStatus;
  updatedAt:   string;
}

export type ReturnStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "RECEIVED"
  | "REFUNDED";

export interface ReturnResponse {
  id:            string;
  orderId:       string;
  orderItemId:   string | null;
  customerId:    string;
  reason:        string;
  description:   string | null;
  status:        ReturnStatus;
  adminNote:     string | null;
  createdAt:     string;
  updatedAt:     string;
}

export interface DriverPerformanceResponse {
  driverId:             string;
  period:               string;
  totalDeliveries:      number;
  successfulDeliveries: number;
  failedDeliveries:     number;
  successRate:          number;
  avgDeliveryTimeMin:   number;
  totalDistanceKm:      number;
  customerRatingAvg:    number;
  totalRatings:         number;
}

/** Warehouse fulfillment response types */
export interface InboundSummaryResponse {
  scanEventId: string;
  orderId:     string;
  receivedAt:  string;
  location:    string;
  message:     string;
}

export interface OutboundSummaryResponse {
  scanEventId:   string;
  orderId:       string;
  dispatchedAt:  string;
  assignedDriver: string | null;
  message:       string;
}

export interface InventoryStatusResponse {
  orderId:      string;
  inWarehouse:  boolean;
  location:     string | null;
  receivedAt:   string | null;
  dispatchedAt: string | null;
  status:       string;
}

export interface WarehouseDashboardResponse {
  totalInbound:    number;
  totalOutbound:   number;
  pendingDispatch: number;
  activeDrivers:   number;
  ordersInWarehouse: number;
}

