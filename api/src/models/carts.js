import db from "#configs/database.js";

const TABLE = "cart";

/**
 * Returns a base query builder for the cart table.
 */
function baseQuery(trx = db) {
  return trx(TABLE);
}

//Calculate the subtotal for a specific cart.
export async function getCartSubtotal(cartId, { trx = db } = {}) {
  const result = await trx("cart_item")
    .join("event", "cart_item.event_id", "=", "event.id")
    .where("cart_item.cart_id", cartId)
    .select(db.raw("SUM(cart_item.quantity * event.price) as subtotal"))
    .first();

  // Return the number, or 0 if the cart is empty
  return Number(result?.subtotal || 0);
}

//List all items in a cart with event details.
export async function listCartItems(cartId, { trx = db } = {}) {
  return trx("cart_item")
    .join("event", "cart_item.event_id", "=", "event.id")
    .where("cart_id", cartId)
    .select(
      "cart_item.id",
      "cart_item.quantity",
      "event.title",
      "event.price",
      "event.currency"
    );
}
