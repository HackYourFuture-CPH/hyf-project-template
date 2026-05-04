import "dotenv/config";
import knex from "#configs/database.js";

(async () => {
    try {
        const [batch, files] = await knex.migrate.latest({ directory: "src/db/migrations" });
        console.log(`[db] ✅ migrated (batch ${batch}):`, files);
        await knex.destroy();
        process.exit(0);
    } catch (err) {
        console.error("[db] ❌ migrate failed:", err);
        try { await knex.destroy(); } catch {}
        process.exit(1);
    }
})();