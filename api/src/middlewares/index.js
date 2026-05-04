import {
    apiErrorHandler,
    apiNotFoundHandler,
} from "#middlewares/errors.js";

/**
 * Middlewares that should run for every request before route handlers.
 *
 * Examples:
 * - logging
 * - request parsing helpers
 * - optional auth extraction that does not reject public requests
 *
 * Route protection middleware such as requireAuth should usually be attached
 * on specific routers or routes, not here.
 */
export const globalMiddlewares = [];

/**
 * Middlewares that should run after routes.
 *
 * These are used for fallback and error handling after Express has tried
 * to match the request against the registered routes.
 */
export const terminalMiddlewares = [
    apiNotFoundHandler,
    apiErrorHandler,
];
