import express from "express";
import {
    getEvents,
    getEventById,
    postEvent,
    patchEvent,
    removeEvent,
} from "#controllers/events.js";

const eventsRouter = express.Router();

/**
 * Events router (MVC example)
 *
 * This router demonstrates how HTTP routes are mapped to controller handlers
 * within the MVC structure used in this backend skeleton.
 *
 * Only some routes are required for the base trainee assignment.
 * Additional routes are included as OPTIONAL placeholders to illustrate
 * how the API structure may grow (for example with admin functionality).
 *
 * Optional routes should only be implemented if the trainee decides to
 * extend the project beyond the required scope.
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get paginated list of events
 *     description: Returns a paginated list of events. Pagination is zero-based.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         required: false
 *         description: Page number (zero-based)
 *     responses:
 *       200:
 *         description: Paginated list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       price:
 *                         type: number
 *                         example: 150
 *                       currency:
 *                         type: string
 *                         example: DKK
 *                       title:
 *                         type: string
 *                         example: Live Jazz Trio
 *                       description:
 *                         type: string
 *                         example: An intimate jazz evening.
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 0
 *                     pageSize:
 *                       type: integer
 *                       example: 5
 *                     totalItems:
 *                       type: integer
 *                       example: 245
 *                     totalPages:
 *                       type: integer
 *                       example: 49
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Server error
 */
eventsRouter.get("/", getEvents);

/**
 * OPTIONAL ROUTE PLACEHOLDER
 *
 * Demonstrates how a "get single resource" endpoint would be added.
 * Not required in the base trainee assignment unless optional scope
 * is implemented.
 *
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event found
 *       404:
 *         description: Event not found
 */
eventsRouter.get("/:id", getEventById);

/**
 * OPTIONAL ROUTE PLACEHOLDER
 *
 * Example of a "create event" endpoint (typically admin functionality).
 *
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create event (optional/admin)
 *     tags:
 *       - Events
 *     responses:
 *       501:
 *         description: Not implemented in base skeleton
 */
eventsRouter.post("/", postEvent);

/**
 * OPTIONAL ROUTE PLACEHOLDER
 *
 * Example of an "update event" endpoint.
 *
 * @swagger
 * /api/events/{id}:
 *   patch:
 *     summary: Update event (optional/admin)
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       501:
 *         description: Not implemented in base skeleton
 */
eventsRouter.patch("/:id", patchEvent);

/**
 * OPTIONAL ROUTE PLACEHOLDER
 *
 * Example of a "delete event" endpoint.
 *
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete event (optional/admin)
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       501:
 *         description: Not implemented in base skeleton
 */
eventsRouter.delete("/:id", removeEvent);

export default eventsRouter;