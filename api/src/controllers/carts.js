import { getCartSubtotal, listCartItems } from "#models/carts.js";
import knex from "#configs/database.js";
import {
  AddToCartInput,
  UpdateCartItemInput,
  CartItemIdParams,
} from "#schemas/carts.js";
import { z } from "zod";

//GET /api/cart
export async function getCartById(req, res, next) {
  try {
    // 1. Get the User ID from the JWT token
    const userId = req.user?.id;
    const guestId = req.headers["x-guest-id"];

    if (!userId && !guestId) {
      return res.status(400).json({ error: "Missing identification" });
    }

    // Find cart for User OR Guest
    let cart = await knex("cart")
      .where(function () {
        if (userId) this.where({ user_id: userId });
        else this.where({ guest_id: guestId });
      })
      .first();

    // If no cart exists, create one (instead of 404)
    if (!cart) {
      [cart] = await knex("cart")
        .insert({
          user_id: userId || null,
          guest_id: userId ? null : guestId,
        })
        .returning("*");
    }

    const items = await listCartItems(cart.id);
    const subtotal = await getCartSubtotal(cart.id);

    res.json({
      data: {
        id: cart.id,
        items,
        subtotal,
      },
    });
  } catch (error) {
    next(error);
  }
}

//POST /api/cart/items

export async function addItemToCart(req, res, next) {
  try {
    const { event_id, quantity } = AddToCartInput.parse(req.body);
    const userId = req.user?.id;
    const guestId = req.headers["x-guest-id"];

    if (!userId && !guestId) {
      return res.status(400).json({ error: "Missing identification" });
    }

    // Ensure a cart record exists for this user or guest
    let cart = await knex("cart")
      .where(function () {
        if (userId) this.where({ user_id: userId });
        else this.where({ guest_id: guestId });
      })
      .first();

    if (!cart) {
      [cart] = await knex("cart")
        .insert({
          user_id: userId || null,
          guest_id: userId ? null : guestId,
        })
        .returning("*");
    }

    // 2. Check if the item already exists in the cart
    const existingItem = await knex("cart_item")
      .where({ cart_id: cart.id, event_id })
      .first();

    if (existingItem) {
      // Update quantity if it exists
      const [updatedItem] = await knex("cart_item")
        .where({ id: existingItem.id })
        .update({ quantity: existingItem.quantity + (quantity || 1) })
        .returning("*");
      return res.json({ data: updatedItem });
    }

    // 3. Otherwise, insert new item
    const [newItem] = await knex("cart_item")
      .insert({
        cart_id: cart.id,
        event_id,
        quantity: quantity || 1,
      })
      .returning("*");

    res.status(201).json({ data: newItem });
  } catch (error) {
    // If Zod fails
    if (error instanceof z.ZodError) {
      error.status = 400;
    }
    next(error);
  }
}

//PUT /api/cart/items/:itemId

export async function updateCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;
    const guestId = req.headers["x-guest-id"];

    // Security check: Ensure the item belongs to a cart owned by this user OR guest
    const itemOwnership = await knex("cart_item")
      .join("cart", "cart_item.cart_id", "=", "cart.id")
      .where("cart_item.id", itemId)
      .andWhere(function () {
        if (userId) this.where("cart.user_id", userId);
        else this.where("cart.guest_id", guestId);
      })
      .select("cart_item.id")
      .first();

    if (!itemOwnership) {
      return res
        .status(404)
        .json({ error: "Cart item not found or unauthorized" });
    }

    const [updatedItem] = await knex("cart_item")
      .where({ id: itemId })
      .update({ quantity })
      .returning("*");

    res.json({ data: updatedItem });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/cart/items/:itemId
export async function removeCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const userId = req.user?.id;
    const guestId = req.headers["x-guest-id"];

    // 1. Find the item and verify ownership through the parent cart
    const item = await knex("cart_item")
      .join("cart", "cart_item.cart_id", "cart.id")
      .where("cart_item.id", itemId)
      .where(function () {
        if (userId) this.where("cart.user_id", userId);
        else this.where("cart.guest_id", guestId);
      })
      .first();

    if (!item) {
      return res.status(404).json({ error: "Item not found in your cart" });
    }

    // 2. Delete the specific line
    await knex("cart_item").where({ id: itemId }).del();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// POST /api/cart/checkout
export async function checkout(req, res, next) {
  const userId = req.user?.id;
  const guestId = req.headers["x-guest-id"];

  try {
    //start the transaction
    await knex.transaction(async (trx) => {
      // 1. Identify the cart
      const cart = await trx("cart")
        .where(userId ? { user_id: userId } : { guest_id: guestId })
        .first();

      if (!cart) throw new Error("Cart not found");

      // 2. Get all items in the cart (Convert active cart - order)
      const items = await trx("cart_item")
        .join("event", "cart_item.event_id", "event.id")
        .where({ cart_id: cart.id })
        .select("cart_item.*", "event.price as current_price");

      if (items.length === 0) throw new Error("Cart is empty");

      // 3. Calculate total
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // 4. Create the Order
      const [order] = await trx("customer_order")
        .insert({
          user_id: userId || null,
          total_price: total,
          status: "completed",
        })
        .returning("*");

      // 5. Create order items
      const orderItems = items.map((item) => ({
        customer_order_id: order.id,
        event_id: item.event_id,
        quantity: item.quantity,
        unit_price: item.current_price,
      }));
      await trx("order_item").insert(orderItems);

      // 6. Clear the cart
      await trx("cart_item").where({ cart_id: cart.id }).del();

      res.status(201).json({
        message: "Checkout successful",
        orderId: order.id,
        total,
      });
    });
  } catch (error) {
    // If any error occurs inside the transaction, Knex rolls it back automatically
    if (error.message === "Cart is empty") {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}
