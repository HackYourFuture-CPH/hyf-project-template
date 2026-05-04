# The API package

This package sets up a [Express](https://expressjs.com/) API server and a connection to a database using [Knex](https://knexjs.org/).

For development you can run the command `npm run dev` which uses `nodemon` to watch files and restarts the server when a change happens. You can find the API at [http://localhost:3001/api](http://localhost:3001/api). 

There is an example route set up at "/" which you can implement to quickly test the connection to the database.

There is no build step, so when deploying it is enough to just run `npm run start`.

## Environment variables

You can set environment variables in the `.env` file or in the Render.com environment variables section.

When you start a fresh project, check out `.env-template` to get started. Create a file called `.env` and copy the contents of the template as a starting point (or just run `cp .env-template .env`). You should comment in/out the sections you need, and add any additional configuration as necessary.

## Scope clarifications

This README explains how the starter API is structured. It does not replace the project contract, PRD, or weekly plan.

- Some routes in the starter exist mainly as examples of controller/router/model structure
- Placeholder admin-style CRUD routes are illustrative and may be optional depending on the course scope
- Core project scope should still be taken from the program requirements and contract

When designing your own database and API, a few practical conventions are worth keeping in mind:

- Avoid reserved database table names such as `user` and `order`; use safer names if needed
- Route params such as `itemId` should identify the record named by the route, for example a cart line item rather than a catalog event
- If the project contract specifies a route shape, follow that contract even if another route design could also work

Design hint:

If your cart API uses a route such as `/api/cart/items/{itemId}`, that usually implies a single unique identifier for the cart line item itself. If your database instead identifies a cart line by a composite key such as `(cart_id, line_no)`, the route shape would typically need to reflect that design as well, for example `/api/carts/{cartId}/lines/{lineNo}`.

## Node & Packages

This project uses modern JavaScript modules throughout the codebase.

- Use `import` / `export` syntax in project files
- If you see older Node.js examples online using `require()` and `module.exports`, that is CommonJS syntax and not the style used in this repository
- This skeleton intentionally includes only the dependencies and environment variables needed for the base starter setup
- As you implement new features, you are expected to install additional packages and extend `.env` with any new variables you need
- Common examples for auth work are `bcryptjs` for password hashing, `jsonwebtoken` for JWT handling, and a `JWT_SECRET` environment variable for signing tokens

The goal is to keep the project structure and separation of concerns consistent while still allowing you to extend the implementation as your project grows.

## Input validation

Backend input validation is also expected in this project for request bodies, path params, and query params.

This starter now includes [Zod](https://zod.dev/) as a simple schema-based example for input validation. It was chosen intentionally because the schema definitions stay compact, readable, and close to the actual data shape.

The included examples live in `src/schemas/events.js` as named schemas for request input.

- Use it as a reference if you want a schema-based approach
- Zod schemas can validate and normalize input in one step with `.parse(...)`
- If `.parse(...)` fails, Zod throws a `ZodError`, which this starter maps to a `400` JSON response
- You may still use manual validation if that fits your learning process better
- You may also choose a different validation library if you have a good reason

The important part is that incoming input is validated before it is used by controllers or models.

### Example

```js
import { EventInput, EventListQuery } from "#schemas/events.js";

export async function postEvent(req, res, next) {
    try {
        const eventInput = EventInput.parse(req.body);
        // continue with validated and normalized input
    } catch (error) {
        next(error);
    }
}
```

`EventInput.parse(req.body)` returns a validated object ready to use in the controller.

For query params, the same pattern can be used:

```js
const { page, pageSize } = EventListQuery.parse(req.query);
```

If you prefer manual validation, the wiring is similar: parse the input near the start of the controller, throw a `400`-type error when a value is invalid, and pass only normalized values deeper into the model layer.

For comparison, `src/schemas/events.js` also includes commented manual alternatives that throw on invalid input and return normalized values on success.

## Middleware placement

This project uses middleware in more than one place, depending on what the middleware is supposed to do.

- Use `globalMiddlewares` for middleware that should run before all routes
- Use `terminalMiddlewares` for fallback and error handling after routes
- Use router-level or route-level middleware for protected endpoints or feature-specific behavior

Examples:

- logging middleware can be global
- an optional auth extractor can be global if it does not block public routes
- `requireAuth` should usually be attached on protected routers or routes
- 404 and error handlers belong in the terminal middleware group

In general, if a middleware would block public endpoints such as `/api/events`, do not add it as a global middleware.

### Example

Router-level middleware protects all routes in that router:

```js
import express from "express";
import { requireAuth } from "#middlewares/auth.js";

const ordersRouter = express.Router();

ordersRouter.use(requireAuth);

ordersRouter.get("/", getOrders);
ordersRouter.get("/:id", getOrderById);
```

Route-level middleware protects only one specific route:

```js
eventsRouter.get("/", getEvents); // public
eventsRouter.post("/", requireAuth, postEvent); // protected
```

## Database clients

The package comes installed with SQLite, MySQL, and PostgreSQL clients because it is based on a shared template.

For the Events Startup Project, keep the course-specific database setup in the [main README](../README.md), including the required `DB_CLIENT=pg` setting, local Docker example, and example `.env` values.

See `.env-template` for the full list of available configuration variables supported by this package.

## Advanced database management

You can get far with a simple `.sql` file to manage your database but if you'd prefer to manage your database with Knex, you can use [Knex Migrations](https://knexjs.org/guide/migrations.html) to set up your schema (as well as rollback schema changes across versions).  

You can also use [Knex Seeds](https://knexjs.org/guide/migrations.html#seed-files) to populate your database with data.  

Combined, these two techniques make it very easy to experiment with changes to your database or recover your database if something happens to it.  

It also makes it possible to share temporary schema changes with others during Pull Request testing.

### Running migrations and seeds

This project includes helper scripts for running Knex migrations and seeds:

- `npm run db:migrate` – runs all pending migrations
- `npm run db:seed` – runs all seed files
- `npm run db:setup` – runs migrations and then seeds (fresh setup)
- `npm run db:migrate:make <name>` – creates a new migration file using the standard Knex CLI
- `npm run db:seed:make <name>` – creates a new seed file using the standard Knex CLI

If you are using the included example schema in this repository, run `npm run db:setup` before starting the API.

If you built your own PostgreSQL schema during the database weeks and imported it separately, the included demo migration and seed files are optional. In that case, your own schema becomes the source of truth, and it must match the API code you are running.

You can use either the npm scripts above or the Knex CLI directly from inside the `api` directory.

Example:

```bash
npm run db:migrate:make create_user_table
```

Direct Knex CLI example:

```bash
npx knex migrate:make create_user_table
```

Both commands create a timestamped migration file in `src/db/migrations`.

### Creating a new migration or seed

Migrations and seeds are considered advanced project tooling in this repository, so the README only documents the local project conventions and the basic commands. For more complete usage patterns, refer to the official Knex documentation.

Create a migration:

```bash
npm run db:migrate:make create_user_table
```

Create a seed:

```bash
npm run db:seed:make 002_users
```

New migration files are created in `src/db/migrations`, and new seed files are created in `src/db/seeds`.

For migrations, Knex expects an `up()` function for applying the schema change and a `down()` function for rolling it back:

```js
export async function up(knex) {
    await knex.schema.createTable("user", (table) => {
        table.increments("id").primary();
        table.string("email").notNullable().unique();
    });
}

export async function down(knex) {
    await knex.schema.dropTableIfExists("user");
}
```

See the [Knex migration documentation](https://knexjs.org/guide/migrations.html) and [Knex seed documentation](https://knexjs.org/guide/migrations.html#seed-files) for more details.

The `db:setup` command is useful when:

- You are starting the project for the first time
- You want to reset your local database
- You are running the demo version of the API

### Project structure

This skeleton includes a simple **MVC-style structure**:

- **Routers** define API endpoints
- **Controllers** handle HTTP request/response logic
- **Models** contain database access logic

MVC is introduced intentionally in this project, even if it has not been deeply covered as a formal pattern during the course.

The reason is to simulate a more realistic backend project environment:
you may join a codebase where the overall structure was already chosen by a more experienced developer, and your task is to understand it, follow it, and continue building within it.

At the same time, this project keeps the implementation aligned with the JavaScript level of the course:

- modules and exported functions
- no class-based OOP requirement
- no advanced framework abstractions
- SQL and Knex used in a direct and readable way

So while the **project structure** is slightly more professional and opinionated than a blank beginner project, the **coding style itself** remains intentionally simple and compatible with the modular JavaScript you have learned.

Knex migrations and seeds are also included as an **advanced database management technique** often used in professional backend projects.

For your tasks, assignments and learning purposes, you are expected to:

- design your own database schema
- write your own SQL queries
- understand how your tables are structured
- continue working within the provided MVC structure

You should not rely blindly on the provided migrations if your assignment requires you to build your own schema.  
If needed, modify or remove the existing migrations and seeds to match your database assignments.

## Deploying

> Last tested: 2025-07-08

### Deploying a PostgreSQL database

From your Render.com Dashboard page, click the tile called PostGreSQL.

![](../images/render/database/step1.png)

In the next screen, fill in the marked fields, then scroll down.

![](../images/render/database/step2.png)

Select the "Free" tier. Then click "Create".

> Your database will be automatically deleted after 90 days, if you need it for longer simply recreate it following the same steps.

![](../images/render/database/step3.png)

On the next page, scroll down to the section "Connections".

![](../images/render/database/step4.png)

We need to copy the the following fields:

- Port
- Database
- Username
- Password
- External Database URL

We can put these into our `.env` file to test our database locally.

It's important to note that we need to extract only the host name from "External Database URL".  
If the value you copied was:

> postgres://my_user:EiwuEVDpdGzoDRXTquSSXNMHoVmCh1qG@dpg-cobfi7i1hbls73e0dkt0-a.frankfurt-postgres.render.com/my_database_u9be

Then what you want to extract is:

> dpg-cobfi7i1hbls73e0dkt0-a.frankfurt-postgres.render.com

Your `.env` file should look something like this in the end:

```
PORT=3001

DB_CLIENT=pg
DB_HOST=dpg-cobfi7i1hbls73e0dkt0-a.frankfurt-postgres.render.com
DB_PORT=5432
DB_USER=my_user
DB_PASSWORD=EiwuEVDpdGzoDRXTquSSXNMHoVmCh1qG
DB_DATABASE_NAME=my_database_u9be
```

You can run `npm run dev` and visit `http://localhost:3001/api` to verify that your local API server is able to connect to your database on Render.com.

> You can use the same variables to connect to the database using a PostgreSQL management tool (such as [pgAdmin](https://www.pgadmin.org/)) to test and setup your database.

### Deploying an API server

If you go back to your Dashboard you should now see your database in your list of deployed services. From here click "New" and then select "Web Service".

![](../images/render/api/step5.png)
![](../images/render/api/step6.png)

We want to deploy from a Git repository, this is called GitOps. Each time we push a new commit to the Git repository, Render will update your deployed service.

![](../images/render/api/step7.png)

If you cannot find your Git repository, you may need to re-configure your Github account to allow Render to see the repository you want to deploy from.

![](../images/render/api/step8.png)

Click "Connect" for the repository you want to use (the one that is based on this template).

![](../images/render/api/step9.png)

In the next page, fill in all the required fields.

![](../images/render/api/step10.png)
![](../images/render/api/step11.png)

When you reach the section about "Environment variables", click the button called "Add from .env" which opens a dialog. You can copy the content of your `.env` file into this dialog (except for the PORT variable), then click "Add variables".

![](../images/render/api/step12.png)
![](../images/render/api/step13.png)

The page should look something like this after.  
It's important here to change the value of the variable DB_USE_SSL from "false" to "true".  
Finish up by clicking "Create Web Service".

![](../images/render/api/step14.png)

In the next screen you'll see the output of your build step which is downloading your code and deploying it.

![](../images/render/api/step15.png)

Once you see the text "Your service is live" you can test your API with Postman by using the deployed URL, which should be something like `https://hyf-template-api.onrender.com/api`. You should see the output the response from your "/" route.

If you've got this far, you probably want to deploy your web app next. Head over to the README.md in your app directory for instructions.
