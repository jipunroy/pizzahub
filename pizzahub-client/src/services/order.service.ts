
import { api } from "@/lib/api";

export interface CreateOrderPayload {
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  deliveryAddress: string;
  deliveryDate: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

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

interface OrderResponse {
  success: boolean;
  message: string;
  data: CreatedOrder;
}

interface OrdersListResponse {
  success: boolean;
  message: string;
  data: CreatedOrder[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const createCustomerOrder = async (
  payload: CreateOrderPayload
): Promise<CreatedOrder> => {
  const response = await api.post<OrderResponse>(
    "/api/customer/orders",
    payload
  );
  return response.data.data;
};

export const getCustomerOrders = async (
  page = 1,
  limit = 12
): Promise<OrdersListResponse> => {
  const response = await api.get<OrdersListResponse>(
    `/api/customer/orders?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getCustomerOrderById = async (
  orderId: string
): Promise<CreatedOrder> => {
  const response = await api.get<OrderResponse>(
    `/api/customer/orders/${orderId}`
  );
  return response.data.data;
};

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
