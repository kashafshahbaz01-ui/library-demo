```markdown
**Library Book Lending API**

This project is a full-featured RESTful backend API built with Node.js, Express, and MongoDB. It manages a digital library database, featuring user authentication, automatic password hashing, dynamic book checking status, query pagination, and advanced aggregate analytics dashboard metrics.



**🚀 How to Run It Locally**

 1. Install Dependencies
Run the following command in your terminal to install the necessary node modules:
```bash
npm install

```

2. Configure Environment Variables

Create a `.env` file in the root directory of the project and add the following keys:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/library-demo
JWT_SECRET=mySuperSecretLibraryKey12345

```

3. Run Development Server

Start the server locally with automated live reload monitoring via `nodemon`:

```bash
npm run dev

```

**🔀 Complete API Endpoint Documentation**

### 🔐 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description | Request Body (JSON) |
| --- | --- | --- | --- | --- |
| **POST** | `/api/auth/register` | Public | Registers a new member profile. Automatically hooks password encryption. | `{"name": "...", "email": "...", "password": "..."}` |
| **POST** | `/api/auth/login` | Public | Validates credentials and returns a secure JWT validation token string. | `{"email": "...", "password": "..."}` |

### 📚 2. Library Inventory & Public Endpoints (`/api/books`)

| Method | Endpoint | Access | Description | URL Query Strings / Params |
| --- | --- | --- | --- | --- |
| **GET** | `/api/books` | Public | Lists library inventory with dynamic Mongoose `.skip()` and `.limit()` page formatting. | `?page=1&limit=5` |
| **GET** | `/api/books/:id` | Public | Fetches detailed info on a single book record by its ID, with fully populated borrower fields. | Includes target book `:id` string |

### 🔄 3. Protected Member Relationship Endpoints (`/api/books`)

*Requires passing an Authorization Header:* `Bearer <YOUR_JWT_TOKEN>`

| Method | Endpoint | Access | Description | Conditions Met |
| --- | --- | --- | --- | --- |
| **POST** | `/api/books/:id/borrow` | Member / Admin | Marks an available book as borrowed and links the active caller's ID to `borrowedBy`. | Cannot borrow already checked-out items. |
| **POST** | `/api/books/:id/return` | Owner / Admin | Resets book status to `available` and clears out active ownership bindings. | **Ownership Guard:** Locked exclusively to original borrower or system admins. |
| **GET** | `/api/books/member/profile/borrowed` | Member / Admin | Fetches checking history listing only items currently held by the logged-in user. | Dual relationship lookup logic. |
| **PUT** | `/api/books/:id` | Member / Admin | Updates a specific book record's data values. | Standard resource update. |

### 📊 4. Admin Exclusive Endpoints (`/api/books`)

*Requires passing an Authorization Header containing a user profile where* `"role": "admin"`

| Method | Endpoint | Access | Description | Response Details |
| --- | --- | --- | --- | --- |
| **GET** | `/api/books/dashboard/analytics` | Admin Only | Processes system analytics tracking via advanced database `$facet` pipeline query grouping. | Total inventory counters, breakdown by status type, and list of unreturned titles. |
| **POST** | `/api/books` | Admin Only | Seeds a brand new book entry into the library catalog. | `{"title": "...", "author": "..."}` |
| **DELETE** | `/api/books/:id` | Admin Only | Permanently eliminates a book document entry out of the collection. | Removes item from database index. |


## 🧪 Testing with Postman

1. Import or create a collection referencing the endpoints listed in the tables above.
2. When testing **Protected** or **Admin Only** routes, navigate to the **Authorization** tab, select **Bearer Token**, and paste the token string retrieved from the `/api/auth/login` step.

```

```


