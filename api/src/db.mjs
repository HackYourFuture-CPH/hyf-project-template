import knex from "knex";
import config from "../knexfile.js";

const dbConfig = config.development;

const db = knex(dbConfig);

export default db;
