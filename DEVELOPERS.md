# [BICEP](https://bicep.bumperapptive.com)

## DEVELOPER DOCUMENTATION

#### Dependencies
- [axios](https://www.npmjs.com/package/axios)
- [connect-flash](https://www.npmjs.com/package/connect-flash)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [cors](https://www.npmjs.com/package/cors)
- [debug](https://www.npmjs.com/package/debug)
- [express](https://www.npmjs.com/package/express)
- [express-session](https://www.npmjs.com/package/express-session)
- [hbs](https://www.npmjs.com/package/hbs)
- [helmet](https://www.npmjs.com/package/helmet)
- [http-errors](https://www.npmjs.com/package/http-errors)
- [morgan](https://www.npmjs.com/package/morgan)
- [multer](https://www.npmjs.com/package/multer)
- [mysql](https://www.npmjs.com/package/mysql)
- [node-sass-middleware](https://www.npmjs.com/package/node-sass-middleware)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [passport](https://www.npmjs.com/package/passport)
- [passport-local](https://www.npmjs.com/package/passport-local)
- [serve-favicon](https://www.npmjs.com/package/serve-favicon)
- [session-memory-store](https://www.npmjs.com/package/session-memory-store)

### Overview
- Bicep is driven by network calls, sending/pulling data to and from the BigCommerce API.
- The main components are **routes** and **views**.

- **Routes**:
    + In *MVC* terms, the routes are *controllers*.
    + Routes are set up as nested modules.
        - See [route anatomy](https://github.com/bumperactive-com/bicep/blob/master/DEVELOPERS.md#routes) below.
    + This avoids the problem of hunting through a large file for a particular route.
        - Since the routes contain most of the application logic, readability is very important.
    + Routes perform three main functions:
        1. Accept user input from the **view** and pass data into the BigCommerce API.
        2. Pull data from the BigCommerce API for passage into the **view**.
        3. Direct user from one **view** to another.

- **Views**:
    + In *MVC* terms, the views are *views*.
        - The BigCommerce API is the *model*.
    + Views reflect the BigCommerce API's scope:
        - *store* > *product* > *variants*
        - A separate view for each scope.
    + Views perform three main functions:
        1. Display data received from BigCommerce API
        2. Provide user input elements
        3. Compose request body for passage to a **route**
            + The **route** then forwards the request body to the BigCommerce API.
                - This is necessary as the BigCommerce API is designed for server-side consumption only.
---

### Anatomy

#### `/` (application root)
- [config.json](https://github.com/bumperactive-com/bicep/blob/master/config.json)
    + This file contains the hash, name, prefix and API credentials for each store.
    + To add a new store, create a new entry (alphabetized by store name).
        - Create a new API account on the store, name it **Bicep**.
        - Give the API account *modify* permissions for **Store Information & Settings** and **Products**.

- [activity.log](https://github.com/bumperactive-com/bicep/blob/master/activity.log)
    + This is an aptly-named log of user activity.
        - Log includes all PUT, POST, and DELETE requests.
        - GET requests are ignored.
    + Example:
        ```
        15/Jan/2020:17:43:24 +0000 [ben]: PUT(200) @/store/aun5zajpk7/edit/147 <76.253.73.241> 593.070ms
        15/Jan/2020:17:44:43 +0000 [lucas]: POST(302) @/login <76.253.73.219> 2.970ms
        ```
---

#### `/lib/`
- [lib/authenticate.js](https://github.com/bumperactive-com/bicep/blob/master/lib/authenticate.js)
    + This module checks whether user is logged in or not.
    + If so, returns `activeUser` value and allows access to application.
        - This authentication check is performed on ALL routes but `/login` and `/create`.
    + If not, restricts user to `/login` and `/create` routes.
        - Redirects user as needed.

- [lib/config.js](https://github.com/bumperactive-com/bicep/blob/master/lib/config.js)
    + This module reads [config.json](https://github.com/bumperactive-com/bicep/blob/master/config.json) into memory.
    + Returns store config object.

- [lib/dbconn.js](https://github.com/bumperactive-com/bicep/blob/master/lib/dbconn.js)
    + This module contains the configuration for the production database.
        - Can also be accessed when testing locally.
    + Uses the Node [MySQL](https://www.npmjs.com/package/mysql) driver.
---

#### `/public/`
- [public/fonts](https://github.com/bumperactive-com/bicep/tree/master/public/fonts)
    + This directory contains font assets.
        - Faster than importing from Google Fonts.

- [public/images](https://github.com/bumperactive-com/bicep/tree/master/public/images)
    + This directory contains static image assets (icons, logo and favicon).

- [public/javascript](https://github.com/bumperactive-com/bicep/tree/master/public/javascript)
    + This directory contains client-side javascript.
        - `api.js` is a wrapper for fetch(), used to pass data to routes.
        - `new.js` runs on product creation view.
        - `product.js` runs on product view.
        - `sku.js` runs on search by SKU view.
        - `store.js` runs on store view.
        - `variant.js` runs on product variant view.
    + Each script contains *set* and *push* functions.
        - *Set* functions take input values from DOM and compose them into request bodies.
        - *Push* functions take those request bodies and pass them to Bicep routes for processing.
    + `product.js` and `variant.js` also contain functions to manipulate DOM (toggling inputs, etc).

- [public/stylesheets](https://github.com/bumperactive-com/bicep/tree/master/public/stylesheets)
    + This directory contains a number of Sass stylesheet modules.
        - All imported into `style.sass`.
    + Stylesheets are compiled into CSS.
        - `style.css`
        - `style.css.map`
        - These files need to be re-compiled after making changes to stylesheets.
            + Otherwise changes will not take effect.
            + To re-compile, delete the CSS files and refresh a page in Bicep.
                - Updated `style.css` and `style.css.map` files should appear in directory.

- public/uploads
    + This directory stores all uploaded images.
        - Image uploads are saved to disk and the server-side file path is sent to BigCommerce.
        - Once the image has been uploaded to BigCommerce, it is no longer needed in the `/uploads` directory.
            + Clear out folder as needed.
---

#### `/routes/`
- [routes/index.js](https://github.com/bumperactive-com/bicep/blob/master/routes/index.js)
    + This file handles GET requests for application root (`/`), populating store index.

- [routes/store.js](https://github.com/bumperactive-com/bicep/blob/master/routes/store.js)
    + This file handles all requests to routes beginning with `/store`.
        ```
        /store/:hash
        /store/:hash/sort/sold
        ```
    + **Imports `edit` and `new` routes:**

    + [routes/new.js](https://github.com/bumperactive-com/bicep/blob/master/routes/new.js)
        - This file handles all requests related to product creation.
            ```
            /store/:hash/new/:templateId
            ```

    + [routes/edit.js](https://github.com/bumperactive-com/bicep/blob/master/routes/edit.js)
        - This file handles all requests related to product-level changes.
            ```
            /store/:hash/edit/:id
            /store/:hash/edit/:id/image
            ```
        - **Imports `modifier`, `option`, and `variant` routes:**

        - [routes/modifiers.js](https://github.com/bumperactive-com/bicep/blob/master/routes/modifiers.js)
            + This file handles all requests related to modifier creation/updates.
                ```
                /store/:hash/edit/:id/modifiers
                /store/:hash/edit/:id/modifiers/:modifierId
                /store/:hash/edit/:id/modifiers/:modifierId/:valueId
                ```

        - [routes/options.js](https://github.com/bumperactive-com/bicep/blob/master/routes/options.js)
            + This file handles all requests related to variant option changes.
                ```
                /store/:hash/edit/:id/options
                /store/:hash/edit/:id/options/:optionId/:valueId
                ```

        - [routes/variants.js](https://github.com/bumperactive-com/bicep/blob/master/routes/variants.js)
            + This file handles all requests related to variant option changes.
                ```
                /store/:hash/edit/:id/variants/:variantId
                ```

- [routes/sku.js](https://github.com/bumperactive-com/bicep/blob/master/routes/sku.js)
    + This file handles the *Search by SKU* functionality.
        ```
        /sku
        /sku/:sku
        ```

- [routes/login.js](https://github.com/bumperactive-com/bicep/blob/master/routes/login.js)
    + This file handles user authentication using Passport.
        ```
        /login
        ```

- [routes/create.js](https://github.com/bumperactive-com/bicep/blob/master/routes/create.js)
    + This file provides inputs for potential users to request login credentials.
    + Uses Nodemailer to send requested credentials to admin.
        - We don't want users to create accounts without review.
        ```
        /create
        ```
---

#### `/views/`

###### View Layout Template

- [views/layout.hbs](https://github.com/bumperactive-com/bicep/blob/master/views/layout.hbs)
    + Basic application layout template, always renders.
        - Includes header.
        - All other view templates render within `{{body}}` of `layout.hbs`.

###### Main Views

- [views/index.hbs](https://github.com/bumperactive-com/bicep/blob/master/views/index.hbs)
    + Application index display template, renders at application root.

- [views/store.hbs](https://github.com/bumperactive-com/bicep/blob/master/views/store.hbs)
    + Store index display template, renders after choosing a store from the index.

- [views/product.hbs](https://github.com/bumperactive-com/bicep/blob/master/views/product.hbs)
    + Product display template, renders when viewing a product.
    + [views/new.hbs](https://github.com/bumperactive-com/bicep/blob/master/views/new.hbs) is a simplified product view.
        - Specifically, a simplified view of the product template from which the new product is copied.

- [views/variant.hbs](https://github.com/bumperactive-com/bicep/blob/master/views/variant.hbs)
    + Product display template, renders when viewing a variant.

###### Other Views

- [views/create.hbs](https://github.com/bumperactive-com/bicep/blob/master/views/login.hbs)
    + Login creation form template, renders when unauthenticated user clicks *Sign Up* link on login page.

- [views/error.hbs](https://github.com/bumperactive-com/bicep/blob/master/views/error.hbs)
    + Error message display template, renders when an error is encountered.

- [views/login.hbs](https://github.com/bumperactive-com/bicep/blob/master/views/login.hbs)
    + Store login form template, renders at login prompt.

- [views/sku.hbs](https://github.com/bumperactive-com/bicep/blob/master/views/sku.hbs)
    + Search by SKU input, redirects to product page or displays error message.
---

### Deployment

- The project directory on the server (`~/bicep.bumperapptive.com/`) is a git repository.

- To deploy update, make sure local changes have been committed and pushed.

- Then, ssh into the server.
    + Run `ssh bac_bicep@bicep.bumperapptive.com` command.
        - Will be prompted for password, which can be found in IT Security KeePass.

    + Once connected to the server, run `cd bicep.bumperapptive.com`.
        - Then run `pwd` command to ensure you're in the correct directory.

    + Run `git pull bicep master` to pull in latest update.

    + Run `touch tmp/restart.txt` to restart Bicep via Passenger.
        - Changes will not take effect until Bicep has restarted.
