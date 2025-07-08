# The API package

This package sets up a [Express](https://expressjs.com/) API server and a connection to a database (SQLite by default) using [Knex](https://knexjs.org/).

For development you can run the command `npm run dev` which uses `nodemon` to watch files and restarts the server when a change happens. You can find the API at [http://localhost:3001/api](http://localhost:3001/api). 

There is an example route set up at "/" which you can implement to quickly test the connection to the database.

There is no build step, so when deploying it is enough to just run `npm run start`.

## Environment variables

You can set environment variables in the `.env` file or in the Render.com environment variables section.

When you start a fresh project, check out `.env-template` to get started. Create a file called `.env` and copy the contents of the template as a starting point (or just run `cp .env-template .env`).

## Database clients

The package comes installed with an SQLite, MySQL, and PostgreSQL client. Here's a quick suggestion for use cases:
1. SQLite for quick, simple file-based storage
2. MySQL for more advanced data storage (requires you to run a database service)
3. PostgreSQL, similar to MySQL and used on our recommended hosting platform Render.com

You can decide which client to use by changing the `DB_CLIENT` environment variable. See `.env-template` for more info. 

## Advanced database management

You can get far with a simple `.sql` file to manage your database but if you'd prefer to manage your database with Knex, you can use [Knex Migrations](https://knexjs.org/guide/migrations.html) to set up your schema (as well as rollback schema changes across versions).  

You can also use [Knex Seeds](https://knexjs.org/guide/migrations.html#seed-files) to populate your database with data.  

Combined, these two techniques make it very easy to experiment with changes to your database or recover your database if something happens to it.  

It also makes it possible to share temporary schema changes with others during Pull Request testing.

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
