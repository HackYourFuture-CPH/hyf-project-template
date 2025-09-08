import db from "../database.js";
export const createAddress = async (req, res) => {
  try {
    const authUserId = req.user?.userId;
    if (!authUserId) {
      res.status(401).json({
        success: false,
        error: "UnAuthenticated User",
      });
      return;
    }
    const userId =
      typeof authUserId === "string" ? Number(authUserId) : authUserId;
    const { name, address, postalcode, city, country, phone, isDefault } =
      req.body;

    const addressRow = await db.transaction(async (trx) => {
      if (isDefault) {
        await trx("Address").where({ userId }).update({ isDefault: false });
      }
      const [{ count }] = await trx("Address")
        .where({ userId })
        .count({ count: "*" });

      const makeDefault = isDefault || Number(count) === 0;
      const [row] = await trx("Address")
        .insert({
          userId,
          name,
          address,
          city,
          country,
          postalcode,
          phone,
          isDefault: makeDefault,
          createdAt: trx.fn.now(),
          updatedAt: trx.fn.now(),
        })
        .returning("*");
      return row;
    });
    return res.status(201).json({ success: true, address: addressRow });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

export const getAddress = async (req, res) => {
  try {
    const authUser = req.user?.userId;
    if (!authUser) {
      res.status(401).json({
        success: false,
        error: "User is not authenticated",
      });
      return;
    }

    const userId = typeof authUser === "string" ? Number(authUser) : authUser;

    const addresses = await db("Address")
      .where({ userId })
      .orderBy("createdAt", "desc")
      .select("*");
    return res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Error getting addresses, server error" });
  }
};
