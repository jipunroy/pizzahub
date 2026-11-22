
import { z } from "zod";

export const createMenuItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Item name must be at least 2 characters")
    .max(100),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(1000),

  price: z
    .number()
    .positive("Price must be greater than zero"),

  category: z
    .string()
    .trim()
    .min(2, "Category is required"),

  imageUrl: z
    .string()
    .url("Please provide a valid image URL")
    .optional()
    .or(z.literal("")),

  ingredients: z
    .array(z.string().trim().min(1))
    .max(30)
    .optional(),

  isVegetarian: z.boolean().optional(),

  isSpicy: z.boolean().optional(),
});

export const updateMenuItemSchema =
  createMenuItemSchema.partial();

export const menuQuerySchema = z.object({
  search: z.string().trim().optional(),

  category: z.string().trim().optional(),

  minPrice: z.coerce.number().min(0).optional(),

  maxPrice: z.coerce.number().min(0).optional(),

  sort: z
    .enum(["price_asc", "price_desc", "newest"])
    .default("newest"),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export type CreateMenuItemInput = z.infer<
  typeof createMenuItemSchema
>;

export type UpdateMenuItemInput = z.infer<
  typeof updateMenuItemSchema
>;
