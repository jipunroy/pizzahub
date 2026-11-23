
import { api } from "@/lib/api";

// Create order payload
export interface CreateOrderPayload {
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  deliveryAddress: string;
  deliveryDate: string;
}

// Individual order item
export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

// Order information
export interface CreatedOrder {
  _id: string;
  customerId: string;
  vendorId: string;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  deliveryDate: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "rejected";
  cancellationReason?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
}

// Single order API response
interface OrderResponse {
  success: boolean;
  message: string;
  data: CreatedOrder;
}

// Pagination information
export interface OrdersPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

// Orders list API response
interface OrdersListResponse {
  success: boolean;
  message: string;
  data: {
    orders: CreatedOrder[];
    pagination: OrdersPagination;
  };
}

// Create customer order
export const createCustomerOrder = async (
  payload: CreateOrderPayload
): Promise<CreatedOrder> => {
  const response = await api.post<OrderResponse>(
    "/api/customer/orders",
    payload
  );

  return response.data.data;
};

// Get customer orders with pagination
export const getCustomerOrders = async (
  page = 1,
  limit = 12
): Promise<OrdersListResponse["data"]> => {
  const response = await api.get<OrdersListResponse>(
    `/api/customer/orders?page=${page}&limit=${limit}`
  );

  return response.data.data;
};

// Get single customer order
export const getCustomerOrderById = async (
  orderId: string
): Promise<CreatedOrder> => {
  const response = await api.get<OrderResponse>(
    `/api/customer/orders/${orderId}`
  );

  return response.data.data;
};

// Cancel customer order
export const cancelCustomerOrder = async (
  orderId: string,
  cancellationReason: string
): Promise<CreatedOrder> => {
  const response = await api.patch<OrderResponse>(
    `/api/customer/orders/${orderId}/cancel`,
    { cancellationReason }
  );

  return response.data.data;
};
