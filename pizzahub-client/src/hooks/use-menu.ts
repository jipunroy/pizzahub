
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getPublicMenuItems,
  type MenuQuery,
} from "@/services/menu.service";

export function usePublicMenu(params: MenuQuery = {}) {
  return useQuery({
    queryKey: ["public-menu", params],
    queryFn: () => getPublicMenuItems(params),
    staleTime: 60 * 1000,
  });
}
