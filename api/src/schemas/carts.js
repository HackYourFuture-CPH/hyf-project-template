import { z } from "zod";

/**
 * Body schema for adding an item to the cart.
 */
export const AddToCartInput = z.object({
  event_id: z.coerce
    .number()
    .int()
    .positive("event_id must be a positive integer"),
  quantity: z.coerce
    .number()
    .int()
    .min(1, "quantity must be at least 1")
    .default(1),
});

/**
 * Body schema for updating a cart item's quantity.
 */
export const UpdateCartItemInput = z.object({
  quantity: z.coerce.number().int().min(1, "quantity must be at least 1"),
});

/**
 * Path params schema for cart routes using :itemId.
 */
export const CartItemIdParams = z.object({
  itemId: z.coerce.number().int().positive("itemId must be a positive integer"),
});
