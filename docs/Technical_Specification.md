# **Travel Planner \- Technical Specification**

This document provides detailed technical specifications for the tasks outlined on our Trello board. It serves as the single source of truth for API contracts, implementation details, and acceptance criteria for the entire project.

## **Epoch 1 (Week 1): Public Site & Core APIs**

This week focuses on building the public-facing portion of the application. The goal is to have a functional, read-only site where users can browse all content.

### **Backend Tasks**

#### **B1.1: Project Setup & Server Initialization**

- **Goal:** Get the basic Node.js Express server running with essential middleware (CORS, JSON parser, logger).
- **Implementation Notes:**
  - Initialize a new Node.js project.
  - Install express, cors, morgan, and dotenv.
  - Create a main server.js or index.js file.
  - Configure cors() to allow requests from the frontend's origin.
  - Use express.json() to parse incoming JSON bodies.
  - Use morgan('dev') for logging HTTP requests to the console.
  - Create a GET /api/health test route that returns a { status: "ok" } JSON object.
- **Acceptance Criteria:**
  - \[x\] The server starts without errors.
  - \[x\] A request to GET /api/health returns a 200 status and the correct JSON response.

#### **B1.2: Database Connection & Test Route**

- **Goal:** Connect the server to the PostgreSQL database and confirm the connection works.
- **Implementation Notes:**
  - Install the pg package.
  - Create a dedicated module (e.g., db/index.js) to manage the database connection pool.
  - Use environment variables for all database credentials (PG_USER, PG_HOST, etc.).
  - Create a GET /api/db-test route that performs a simple query like SELECT NOW() to validate the connection.
- **Acceptance Criteria:**
  - \[x\] The server successfully connects to the database upon startup.
  - \[x\] The GET /api/db-test route returns a 200 status with the current timestamp from the database.

#### **B1.3: API \- Get All Tours (with Search, Filter, Sort)**

- **Goal:** Create a robust endpoint to fetch a paginated list of all tours, allowing for dynamic searching, filtering, and sorting.
- **API Contract:**

  - **Endpoint:** GET /api/tours
  - **Query Params (Optional):**
    - search (string): Search term applied to travel_plans.name and travel_plans.description.
    - destination (string): Exact match filter for travel_plans.destination.
    - sort (string): price-asc, price-desc, rating-desc.
    - page (integer, default: 1): The page number to retrieve.
    - limit (integer, default: 9): The number of items per page.
  - **Success Response (200 OK):**  
    {  
     "totalItems": 85,  
     "totalPages": 10,  
     "currentPage": 1,  
     "tours": \[  
     {  
     "id": "a1b2c3d4-...",  
     "name": "Grand European Tour",  
     "destination": "Europe",  
     "price_usd": "2400.00",  
     "duration_days": 14,  
     "cover_image_url": "https://...",  
     "average_rating": "4.5"  
     }  
     \]  
    }

- **Implementation Notes (Backend):**
  - The controller must dynamically build the SQL query based on provided params.
  - Use ILIKE for case-insensitive searching in PostgreSQL.
  - The average_rating needs a LEFT JOIN on tour_reviews and AVG(rating).
  - Pagination is implemented using LIMIT and OFFSET. OFFSET is (page \- 1\) \* limit.
  - A separate SELECT COUNT(\*) query is needed to get totalItems.
- **Acceptance Criteria:**
  - \[x\] Endpoint returns 200 with the correct JSON structure.
  - \[x\] All query parameters function as expected individually and in combination.
  - \[x\] The pagination fields are accurate.

#### **B1.4: API \- Get All Posts & Attractions (with Pagination)**

- **Goal:** Create endpoints to fetch lists of posts and attractions, ensuring both support pagination, search, and filtering.
- **API Contract (Posts):**
  - **Endpoint:** GET /api/posts
  - **Query Params:** search, category, sort, page, limit
  - **Response:** { "totalItems": ..., "totalPages": ..., "currentPage": ..., "posts": \[...\] }
- **API Contract (Attractions):**
  - **Endpoint:** GET /api/attractions
  - **Query Params:** search, location, page, limit
  - **Response:** { "totalItems": ..., "totalPages": ..., "currentPage": ..., "attractions": \[...\] }
- **Implementation Notes:**
  - The structure of the JSON response (with pagination metadata) should be identical to the tours endpoint.
  - The post response objects should include author_username via a JOIN with the users table.
- **Acceptance Criteria:**
  - \[x\] Both /api/posts and /api/attractions are functional.
  - \[x\] All query parameters work as expected.
  - \[x\] Pagination is correctly implemented for both.

#### **B1.5: API \- Get Single Tour Details**

- **Goal:** Create an endpoint to fetch all detailed information for a single tour.
- **API Contract:**

  - **Endpoint:** GET /api/tours/:id
  - **Success Response (200 OK):**  
    {  
     "id": "a1b2c3d4-...",  
     "name": "Grand European Tour",  
     "description": "A classic tour of Europe's most iconic cities.",  
     "price_usd": "2400.00",  
     "start_date": "2025-09-01",  
     "end_date": "2025-09-14",  
     "destination": "Europe",  
     "cover_image_url": "https://...",  
     "flights": \[  
     { "airline": "Lufthansa", "price_usd": "600.00", "departure_airport": "JFK", "arrival_airport": "FRA" }  
     \],  
     "accommodations": \[  
     { "name": "Grand Hotel", "type": "hotel", "rating": "4.5", "price_per_night_usd": "150.00" }  
     \],  
     "reviews": \[  
     { "username": "jane_smith", "rating": 5, "content": "An amazing tour, highly recommended\!", "created_at": "..." }  
     \]  
    }

- **Implementation Notes:**
  - Use multiple parallel SQL queries (one for the main tour details, one for flights, one for accommodations, one for reviews) for simplicity and performance.
  - If no tour with the given :id is found, return a 404 Not Found status.
- **Acceptance Criteria:**
  - \[x\] Endpoint returns 200 with the complete tour data structure.
  - \[x\] Endpoint returns 404 for an invalid ID.

#### **B1.6: API \- Get Single Post & Attraction Details**

- **Goal:** Create endpoints for post and attraction detail pages.
- **API Contract (Post):**

  - **Endpoint:** GET /api/posts/:id
  - **Success Response (200 OK):**  
    {  
     "id": "e5f6g7h8-...",  
     "title": "Hiking the Cinque Terre",  
     "content": "My unforgettable hiking experience...",  
     "category": "Nature",  
     "created_at": "...",  
     "author_username": "jane_smith",  
     "photos": \[  
     { "image_url": "https://...", "caption": "A beautiful view" }  
     \],  
     "comments": \[  
     { "username": "john_doe", "content": "Looks like a beautiful hike\!", "created_at": "..." }  
     \]  
    }

- **API Contract (Attraction):**

  - **Endpoint:** GET /api/attractions/:id
  - **Success Response (200 OK):**  
    {  
     "id": "i9j0k1l2-...",  
     "title": "The Colosseum",  
     "content": "An iconic symbol of Imperial Rome...",  
     "location": "Rome",  
     "photos": \[  
     { "image_url": "https://...", "caption": "The Colosseum at dusk" }  
     \]  
    }

- **Acceptance Criteria:**
  - \[x\] Both endpoints return 200 with the correct data structure.
  - \[x\] Both endpoints return 404 for an invalid ID.

### **Frontend Tasks**

#### **F1.1: Setup Next.js Project & Reusable Layout**

- **Goal:** Initialize the frontend project with Next.js and Tailwind CSS, and create the core Header, Footer, and Layout components.
- **Implementation Notes:**
  - Create a \<Layout\> component that wraps page content.
  - The \<Header\> component should contain the main navigation links (/, /tours, /posts, etc.) and the user profile dropdown.
  - The \<Footer\> component contains static copyright info.
  - This Layout component will be used in pages/\_app.js.
- **Acceptance Criteria:**
  - \[x\] The Next.js project runs successfully.
  - \[x\] A consistent header and footer appear on all pages.

#### **F1.2: Build Homepage & 'All Items' Pages UI**

- **Goal:** Create the complete, static UI for the homepage (/) and all list pages (/tours, /posts, /attractions) using hard-coded data.
- **Implementation Notes:**
  - Create a reusable \<Card\> component that can be styled to represent a tour, post, or attraction based on props.
  - Build the UI for the search, filter, and sort controls on the list pages.
  - Build a static \<Pagination\> component UI.
- **Acceptance Criteria:**
  - \[x\] The homepage is visually complete with placeholder data.
  - \[x\] The /tours, /posts, and /attractions pages are visually complete with placeholder data and controls.

#### **F1.3: Create API Service & Connect All Public Pages**

- **Goal:** Create a centralized API service file and replace all static data on public pages with live data from the backend.
- **Implementation Notes:**
  - Create a services/api.js file using axios or fetch.
  - Define functions like getTours(params), getPosts(params), etc.
  - On the list pages (e.g., pages/tours.js), use getServerSideProps to fetch the initial data based on URL query params. This ensures SEO and correct initial rendering.
- **Acceptance Criteria:**
  - \[x\] The homepage correctly displays the first few items fetched from the API.
  - \[x\] The list pages correctly display the first page of items from the API.

#### **F1.4: Implement Frontend Search, Filter, & Sort Logic**

- **Goal:** Make the search input, filter dropdowns, and sort dropdowns on the list pages functional.
- **Implementation Notes:**
  - Use the Next.js useRouter hook to manage state in the URL's query string.
  - When a user types in the search bar or changes a filter, use router.push to update the URL with the new query parameters.
  - Since the page uses getServerSideProps, Next.js will automatically re-run the data fetching with the new query params and re-render the page.
- **Example Logic:**  
  const router \= useRouter();

  function handleSearchChange(e) {  
   router.push({  
   pathname: '/tours',  
   query: { ...router.query, search: e.target.value, page: 1 },  
   });  
  }

- **Acceptance Criteria:**
  - \[x\] Changing any control updates the URL query string.
  - \[x\] The page re-renders with the correctly filtered/sorted data from the API.

#### **F1.5: Implement Frontend Pagination**

- **Goal:** Make the pagination controls on all list pages functional.
- **Implementation Notes:**
  - Create a reusable \<Pagination\> component.
  - It should receive currentPage, totalPages as props (from the API response).
  - When a page number is clicked, it should use router.push to update the page query parameter in the URL.
- **Acceptance Criteria:**
  - \[x\] The correct number of page buttons is displayed.
  - \[x\] Clicking a page number navigates to the correct URL and displays the corresponding data.
  - \[x\] "Previous" and "Next" buttons are disabled appropriately.

#### **F1.6: Build & Connect Dynamic Detail Pages**

- **Goal:** Create the UI for the detail pages (e.g., /tours/\[id\]) and connect them to the API.
- **Implementation Notes:**
  - Use dynamic routes in Next.js (e.g., pages/tours/\[id\].js).
  - Use getServerSideProps to fetch the data for the specific item based on the id from the context params.
  - Build the UI to display all the detailed information, including related data like reviews, comments, etc.
- **Acceptance Criteria:**
  - \[x\] Navigating to /tours/some-uuid correctly fetches and displays the details for that tour.
  - \[x\] A user-friendly "Not Found" page is shown if the API returns a 404\.

## **Epoch 2 (Week 2): User Accounts & Dashboard Functionality**

The objective for this epoch is to implement user authentication and the authenticated dashboard section. This includes registration, login, and all functionality for users to manage their own content.

### **Backend Tasks**

#### **B2.1: API \- User Registration & Login**

- **Goal:** Implement the endpoints for user registration and login.
- **Registration API Specification:Request:** POST /api/auth/register**Request Body:**{  
   "username": "newuser",  
   "email": "new@user.com",  
   "password": "strongpassword123",  
   "first_name": "New",  
   "last_name": "User"  
  }  
  **Success Response (201 Created):**{ "token": "your.jwt.here" }

- **Login API Specification:Request:** POST /api/auth/login**Request Body:**{  
   "username": "newuser",  
   "password": "strongpassword123"  
  }  
  **Success Response (200 OK):**{ "token": "your.jwt.here" }

- **Implementation Notes:**
  - Passwords must be hashed using bcryptjs before being stored.
  - The generated JWT payload should include the user's id and role.

#### **B2.2: Create JWT Authentication Middleware**

- **Goal:** Implement a reusable middleware to protect routes, ensuring access is restricted to authenticated users.
- **Implementation Notes:**
  - The middleware should extract the JWT from the Authorization: Bearer \<token\> header.
  - On successful verification, the decoded user payload should be attached to the req object (e.g., req.user).
  - If the token is missing or invalid, the middleware must respond with a 401 Unauthorized error.

#### **B2.3: API \- Get User's Personal Dashboard Data**

- **Goal:** Implement the protected endpoints required to populate the user dashboard.
- **Implementation Notes:**
  - All endpoints in this task must be protected by the JWT authentication middleware.
  - The user ID for all database queries will be sourced from req.user.id.
- **API Endpoints to Create:**
  - GET /api/users/me/profile: Returns the logged-in user's profile object.
  - GET /api/users/me/trips: Returns an array of trip objects created by the user.
  - GET /api/users/me/posts: Returns an array of post objects created by the user.
  - GET /api/users/me/favorites: Returns an array of the user's favorited items.
  - GET /api/users/me/reviews: Returns an array of reviews written by the user.

#### **B2.4: API \- Get User's AI Trip History**

- **Goal:** Implement a protected endpoint to retrieve a user's previously generated AI trips.
- **API Specification:Request:** GET /api/users/me/ai-history**Success Response (200 OK):**\[  
   {  
   "requestId": "a1b2c3d4-...",  
   "request_text": "A 5-day cultural trip to Paris for 2 people...",  
   "generated_at": "2025-08-15T10:00:00Z",  
   "itinerary_data": {  
   "title": "Cultural Discovery of Paris",  
   "days": \[  
   { "day": 1, "title": "Arrival and Montmartre", "activities": \["...", "..."\] }  
   \]  
   }  
   }  
  \]

#### **B2.5: API \- Create, Update, Delete Own Content**

- **Goal:** Implement the protected APIs that allow users to perform CRUD operations on their own trips and posts.
- **Implementation Notes:**
  - All endpoints must be protected by the JWT middleware.
  - For PUT and DELETE operations, an ownership check is mandatory. The controller must verify that req.user.id matches the owner_id of the content being modified. If not, a 403 Forbidden error must be returned.
- **API Endpoints to Create:**
  - POST /api/trips
  - PUT /api/trips/:id
  - DELETE /api/trips/:id
  - POST /api/posts
  - PUT /api/posts/:id
  - DELETE /api/posts/:id

#### **B2.6: API \- Update User Profile**

- **Goal:** Implement an endpoint that allows a user to update their profile information.
- **API Specification:Request:** PUT /api/users/me/profile**Request Body:**{  
   "first_name": "John Updated",  
   "last_name": "Doe Updated",  
   "email": "john.doe.new@example.com",  
   "phone_number": "555-123-4567"  
  }  
  **Success Response (200 OK):** The updated user profile object.

### **Frontend Tasks**

#### **F2.1: Build Login/Register Pages & Auth Context**

- **Goal:** Build the UI for the login and registration pages. Implement a global AuthContext for managing user authentication state.
- **Implementation Notes:**
  - The AuthContext will manage the user object and JWT. It should provide methods like login(), register(), and logout() that interface with the API.
  - The JWT should be persisted in localStorage to maintain the user's session.

#### **F2.2: Build Protected Dashboard Layout & Pages**

- **Goal:** Create the UI for the user dashboard section, including the sidebar layout. Ensure these pages are accessible only to authenticated users.
- **Implementation Notes:**
  - Implement a route protection mechanism (e.g., a Higher-Order Component or a hook) that checks the AuthContext and redirects unauthenticated users to the /login page.

#### **F2.3: Connect Dashboard to Display User Data**

- **Goal:** Integrate the dashboard pages with the API to fetch and display the logged-in user's data.
- **Implementation Notes:**
  - Each dashboard page should use a useEffect hook to fetch its specific data (e.g., GET /api/users/me/trips).
  - All API requests must include the JWT in the Authorization header.

#### **F2.4: Implement Full CRUD for 'My Trips' & 'My Posts'**

- **Goal:** Implement the full Create, Read, Update, and Delete functionality on the "My Trips" and "My Posts" dashboard pages.
- **Implementation Notes:**
  - Create reusable components for the modal (\<Modal\>) and forms (\<TripForm\>, \<PostForm\>).
  - Implement a confirmation dialog before executing a delete operation.
  - After any CUD operation, the data on the page must be re-fetched to reflect the changes.

#### **F2.5: Implement 'My Profile' Update Functionality**

- **Goal:** Enable users to edit and save their profile information on the /dashboard/profile page.
- **Implementation Notes:**
  - The profile form should be pre-filled with the user's current data.
  - Form submission should call the PUT /api/users/me/profile endpoint.
  - Display a success notification to the user upon a successful update.

## **Epoch 3 (Week 3): Interactions, Admin Panel & Final Polish**

The objective for the final epoch is to implement user-to-content interactions, build the administrative back-office, and conduct final testing and refinement of the application.

### **Backend Tasks**

#### **B3.1: API \- Add Comments & Reviews**

- **Goal:** Implement endpoints to allow authenticated users to add comments to posts and reviews to tours.
- **Add Comment API Specification:Request:** POST /api/posts/:id/comments**Request Body:**{ "content": "This was a great article\!" }  
  **Success Response (201 Created):** The newly created comment object.
- **Add Review API Specification:Request:** POST /api/tours/:id/reviews**Request Body:**{ "rating": 5, "content": "This tour was amazing\!" }  
  **Success Response (201 Created):** The newly created review object.

#### **B3.2: API \- Add/Remove Favorites**

- **Goal:** Implement endpoints that allow an authenticated user to add an item to their favorites or remove it.
- **Add Favorite API Specification:Request:** POST /api/favorites**Request Body:**{  
   "item_id": "a1b2c3d4-...",  
   "item_type": "tour"  
  }  
  **Success Response (201 Created):** A success message.
- **Remove Favorite API Specification:Request:** DELETE /api/favorites/:itemId**Success Response (200 OK):** A success message.

#### **B3.3: Create Admin Middleware & Admin APIs**

- **Goal:** Implement an admin-specific authorization middleware and all backend APIs required for the Admin Panel.
- **Implementation Notes:**
  - The isAdmin middleware must run after the primary JWT authentication middleware and verify that req.user.role \=== 'admin'. Unauthorized requests should receive a 403 Forbidden error.
  - All /api/admin/\* routes must be protected by both middlewares.
- **Admin API Endpoints to Create:**
  - GET /api/admin/users: List all users.
  - DELETE /api/admin/users/:id: Delete a specific user.
  - POST /api/admin/tours: Create a new tour.
  - PUT /api/admin/tours/:id: Update any existing tour.
  - DELETE /api/admin/tours/:id: Delete any existing tour.
  - Plus equivalent CRUD endpoints for managing all posts and attractions.

#### **B3.4: API \- AI Planner (Mock Response)**

- **Goal:** Implement the AI planner endpoint to accept user input, save the request, and return a hard-coded, mock itinerary.
- **API Specification:Request:** POST /api/planner/generate**Request Body:** Contains all user selections from the trip planner form.**Success Response (200 OK):** A detailed, structured JSON object representing a full itinerary.
- **Implementation Notes:**
  - This endpoint must create corresponding entries in the travel_plans, ai_requests, and trip_itineraries tables.

#### **B3.5: Implement Global Error Handling Middleware**

- **Goal:** Implement a final, catch-all error handling middleware to ensure server stability.
- **Implementation Notes:**
  - This middleware must be the last one registered in the Express application.
  - It requires a signature of (err, req, res, next).
  - It should log the full error for debugging and return a generic 500 Internal Server Error JSON response to the client.

### **Frontend Tasks**

#### **F3.1: Implement Commenting & Reviewing Features**

- **Goal:** Implement the UI and logic for users to post and view comments and reviews on detail pages.
- **Implementation Notes:**
  - The forms for submitting new comments or reviews should only be rendered for authenticated users.
  - Upon successful submission, the list of comments/reviews on the page should be re-fetched to display the new entry without a page reload.

#### **F3.2: Implement Favoriting Feature**

- **Goal:** Implement the client-side logic for the "favorite" (heart) icon on all relevant components.
- **Implementation Notes:**
  - The AuthContext should store a Set of the user's favorite item IDs to enable synchronous UI updates.
  - Clicking the heart icon should trigger the relevant API call and, upon success, update the favorites Set in the context, causing all relevant icons to re-render.

#### **F3.3: Build & Connect Admin Panel**

- **Goal:** Build the complete UI for the Admin Panel and integrate it with the administrative APIs.
- **Implementation Notes:**
  - A separate AdminLayout should be created. All pages under /admin must be protected by a route guard that verifies user?.role \=== 'admin'.
  - The UI should feature tables for displaying data with controls for all CRUD operations.

#### **F3.4: Connect AI Planner Page**

- **Goal:** Implement the functionality of the AI Trip Planner page, including form submission and rendering of the mock itinerary.
- **Implementation Notes:**
  - The form submission button should be disabled for unauthenticated users.
  - A loading state must be displayed to the user while the API request is in progress.
  - Create components to render the structured JSON itinerary in a user-friendly format.

#### **F3.5: Final Testing & Responsive Polish**

- **Goal:** Conduct comprehensive end-to-end testing and resolve any remaining bugs or responsive design issues.
- **Implementation Notes:**
  - Perform manual testing for all features from three user perspectives: public visitor, authenticated user, and admin.
  - Test the application on various screen sizes to ensure a consistent and usable experience on mobile, tablet, and desktop devices.
  - Address any console errors and ensure all forms have appropriate validation.
