import knex from "#configs/database.js";

// GET /api/orders
export async function getOrders(req, res, next) {
  try {
    const userId = req.user?.id;
    // Order history is for logged-in users
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Please log in to view order history." });
    }

    const orders = await knex("customer_order")
      .where({ user_id: userId })
      .orderBy("created_at", "desc");

    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
}

// GET /api/orders/:orderId
export async function getOrderById(req, res, next) {
  try {
    const userId = req.user?.id;
    const { orderId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 1. Get the order base info (ensuring it belongs to this user)
    const order = await knex("customer_order")
      .where({ id: orderId, user_id: userId })
      .first();

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // 2. Get the items for this order and join with the event table to get the title
    const items = await knex("order_item")
      .join("event", "order_item.event_id", "event.id")
      .where({ customer_order_id: orderId })
      .select(
        "order_item.id",
        "order_item.event_id",
        "event.title",
        "order_item.quantity",
        "order_item.unit_price"
      );

    res.json({
      data: {
        ...order,
        items,
      },
    });
  } catch (error) {
    next(error);
  }
}
