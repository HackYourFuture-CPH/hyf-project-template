import "dotenv/config";
import knex from "#configs/database.js";

(async () => {
    try {
        const res = await knex.seed.run({ directory: "src/db/seeds" });
        console.log("[db] ✅ seeded:", res);
        await knex.destroy();
        process.exit(0);
    } catch (err) {
        console.error("[db] ❌ seed failed:", err);
        try { await knex.destroy(); } catch {}
        process.exit(1);
    }
})();