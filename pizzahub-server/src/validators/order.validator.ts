import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        menuItemId: z
          .string()
          .regex(/^[0-9a-fA-F]{24}$/, "Invalid menu item ID"),

        quantity: z
          .number()
          .int()
          .min(1, "Quantity must be at least 1")
          .max(50, "Quantity cannot exceed 50"),
      })
    )
    .min(1, "At least one item is required"),

  deliveryAddress: z
    .string()
    .trim()
    .min(10, "Delivery address must be at least 10 characters")
    .max(500, "Delivery address is too long"),

  deliveryDate: z
    .string()
    .datetime({ offset: true })
    .refine(
      (date) => new Date(date).getTime() > Date.now(),
      "Delivery date must be in the future"
    ),
});

export const cancelOrderSchema = z.object({
  cancellationReason: z
    .string()
    .trim()
    .min(3, "Please provide a cancellation reason")
    .max(500, "Reason is too long"),
});

export const rejectOrderSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(3, "Please provide a rejection reason")
    .max(500, "Reason is too long"),
});

export type CreateOrderInput = z.infer<
  typeof createOrderSchema
>;

export type CancelOrderInput = z.infer<
  typeof cancelOrderSchema
>;

export type RejectOrderInput = z.infer<
  typeof rejectOrderSchema
>;