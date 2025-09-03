import { Router } from "express";
import db from "../db.mjs";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    const tablesResult = await db.raw(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
    );

    const tableNames = tablesResult.rows
      .map((row) => row.tablename)
      .filter((name) => !name.startsWith("knex_"));

    const tableSamples = {};

    for (const tableName of tableNames) {
      const sampleData = await db(tableName).select("*").limit(2);
      tableSamples[tableName] = sampleData;
    }

    res.status(200).json(tableSamples);
  } catch (error) {
    console.error("!-> Database health check failed:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

export default router;
