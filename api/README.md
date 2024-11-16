# Usage

```javascript
node index.js
```

# Thoughts behind the code

-Structure: "MVC" (Model-View-Controller) - Layered Architecture.
-Separation of Concerns: Using separate operations from authentication operations
-Modularity: With separate controllers, the code becomes more modular and easier to manage.
-Scalability: This split allows each controller to grow independently, which is helpful as your application scales.
-added JWT coookie authentication for 1hour

# Endpoint log

ENDPOINTS

for testing( this just return a text, it doesnt contact the db)

https://wflance-production.up.railway.app/api/nested/

To list all users: (this has access denied until login is done)

GET

https://wflance-production.up.railway.app/api/users

To create users

POST

https://wflance-production.up.railway.app/api/users

role_name can be only “Client“ or “Developer”

example request:

{
"name":"test8",
"email": "test8@test.com",
"password": "test",
"phone": "12345678",
"role_name": "Client"
}
Example response:

{
"message": "User created successfully!",
"user": {
"id": 11,
"name": "test",
"email": "test@test.com",
"password": "$2b$10$t69sFWQgjc4Dlc0gyhmC4.oor9u2lMbd0nSoCuyv7znBUUr01Ut9u",
"phone": "12345678",
"createdAt": "2024-11-10T18:06:06.718Z",
"role_id": 2
}
}

To insert mail and password and get back userData:

it inserts a cooking for 1 hour

POST

https://wflance-production.up.railway.app/api/login

Example response:

{
"success": true,
"message": "Login successful",
"user": {
"id": 11,
"name": "test",
"email": "test@test.com",
"password": "$2b$10$t69sFWQgjc4Dlc0gyhmC4.oor9u2lMbd0nSoCuyv7znBUUr01Ut9u",
"phone": "12345678",
"createdAt": "2024-11-10T18:06:06.718Z"
}
}
to LOGOUT:
it deletes the cookie

POST

https://wflance-production.up.railway.app/api/logout

---

find and test all api documentation at:
https://wflance-production.up.railway.app/docs/api-docs

# Testing with Mocha

```javascript

 npx mocha test/api.test.cjs

```

adjust the id of the delete api test, its commented out in the end
