
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelCustomerOrder,
  getCustomerOrderById,
  getCustomerOrders,
} from "@/services/order.service";

export const useCustomerOrders = (page = 1, limit = 12) => {
  return useQuery({
    queryKey: ["customer-orders", page, limit],
    queryFn: () => getCustomerOrders(page, limit),
  });
};

export const useCustomerOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["customer-order", orderId],
    queryFn: () => getCustomerOrderById(orderId),
    enabled: Boolean(orderId),
  });
};

export const useCancelCustomerOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      cancellationReason,
    }: {
      orderId: string;
      cancellationReason: string;
    }) => cancelCustomerOrder(orderId, cancellationReason),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customer-orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer-order"],
      });
    },
  });
};
