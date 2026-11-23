
import { api } from "@/lib/api";

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  ingredients?: string[];
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isActive: boolean;
  status: "pending" | "approved" | "rejected";
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "newest";
  page?: number;
  limit?: number;
}

export interface MenuPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface PublicMenuResponse {
  success: boolean;
  results: number;
  pagination: MenuPagination;
  data: MenuItem[];
}

interface PublicMenuItemResponse {
  success: boolean;
  message: string;
  data: MenuItem;
}

// Get all public menu items
export const getPublicMenuItems = async (
  params: MenuQuery = {}
) => {
  const response = await api.get<PublicMenuResponse>("/api/menu", {
    params: {
      sort: "newest",
      page: 1,
      limit: 12,
      ...params,
    },
  });

  return response.data;
};

// Get one public menu item by ID
export const getPublicMenuItemById = async (
  itemId: string
): Promise<MenuItem> => {
  const response = await api.get<PublicMenuItemResponse>(
    `/api/menu/${itemId}`
  );

  return response.data.data;
};
