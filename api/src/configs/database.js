import knex from "knex";
import { createKnexConfig } from "#configs/knex-config.js";

const connection = knex(createKnexConfig());

export default connection;
