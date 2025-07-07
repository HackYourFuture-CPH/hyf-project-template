# The App package

This package sets up a [React](https://react.dev/) web app and uses [Vite](https://vitejs.dev/) to manage the bundling and serving of web assets.
The React app uses [React Router](https://reactrouter.com/en/main) for Single Page Application routing.

For development you can run the command `npm run dev` which uses `vite` to watch files so the web app updates each time you save a change.  
You can visit [http://localhost:3000](http://localhost:3000) to see the app running.

To prepare your application for deployment you can run `npm run build`.  
To preview your web app you can use `npx vite preview --port 3000`.

## Environment variables

You can set environment variables in the `.env` file or in the Render.com environment variables section.

## JSX

Vite has built in support for [JSX](https://www.w3schools.com/react/react_jsx.asp). Any file that contains JSX code should have the `.jsx` file extension.

## CSS

Vite has built in support for CSS imports, simply create a `.css` file and import it:

```
import "./main.css";
```

## Assets

Any asset linked in `index.html` should be placed in the `public` folder.  
For assets that are used by React components, they should be placed in the `assets` folder.  
You can import them into your files like this:

```
import hyfLogo from "../../assets/hyf.svg";
```

## Calling the API using `fetch` and the `api()` helper

When you need data from the API, you can use `fetch` but it's important to not hardcode the URLs since they will differ between your development environment and the deployment environment. For this we can use the `api()` helper function.

Assuming you've deployed your API somewhere and you've defined the following environment variable:

```
VITE_API_URL=https://my-cool-domain:1234

```

When you call `api('/nested')` the helper generates the following URL `https://my-cool-domain:1234/api/nested` which you can pass to `fetch`:

```
const response = await fetch(api('/nested'));
```

## Deploying a static web app

> Last tested: 2024-04-11

Follow the steps [here](../api/README.md#deploying) first to deploy your database and your web service.

Once you've done that, click "New" and this time select "Static Site".

![](../images/render/app/step16.png)
![](../images/render/app/step17.png)

Select the same repository as you used for the web service.

![](../images/render/app/step18.png)

Fill in the required fields and add the "VITE_API_URL" environment variable with the value based on the URL your web service got (for example `https://hyf-template-api.onrender.com/api`). Then click "Create Static Site".

![](../images/render/app/step19.png)
![](../images/render/app/step20.png)

In the next screen, wait until you see the text "Your site is live".  
Then navigate to "Redirects/Rewrites".

![](../images/render/app/step21.png)

Click "Add Rule" and input the below rule settings before clicking "Save Changes".

![](../images/render/app/step22.png)
![](../images/render/app/step23.png)

After this you should be able to test your web app in your browser on the URL shown, which should be something like `https://hyf-template-app.onrender.com/`.

If everything has been done correctly then your web app should be able to load data from your web service's API.
