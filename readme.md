# expressRestRouter

The **expressRestRouter** provides a simple class that takes a Mongoose model and returns a RESTful Express router. It simplifies the process of creating RESTful APIs for your Mongoose models with built-in CRUD operations.

## Features

- Automatically generates RESTful routes for standard CRUD operations.
- Option to add global middleware for authentication, logging, etc.
- Pagination, sorting, and filtering capabilities for list queries.

## Installation

You can install the package using npm:

```bash
npm install expressrestrouter
```

Usage
Example
Here's a simple example of how to use the expressRestRouter in your Express application:

require('dotenv').config();
const db = require("./mongo.js"); // Database connection
const mongoose = require('mongoose');
const express = require('express');
const RestfulRouter = require('./src/RestfulRouter.js'); 

const app = express();
app.use(express.json());

// Define a simple Mongoose model
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Create a RESTful router for the User model
let restfulRouter = new RestfulRouter(User);

// Use the RESTful router for the '/users' endpoint
app.use('/users', restfulRouter.getRouter());

app.get('/', (req, res) => res.status(200).json({ message: "Welcome to ExpressRestRouter 0.0.1" }));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

API Manual

### API Manual

| HTTP Method | Route         | Description                           | Example Request                                                                                     |
|-------------|---------------|---------------------------------------|-----------------------------------------------------------------------------------------------------|
| GET         | `/`           | List all items                       | `GET /users?sort=-_id&limit=10&page=1`                                                             |
| GET         | `/:id`        | Get a single item by ID              | `GET /users/60c72b2f9b1d4a001f8e4b2c`                                                              |
| POST        | `/`           | Create a new item                    | `POST /users` with body `{ "email": "user@example.com", "password": "password123" }`             |
| PUT         | `/:id`        | Update an existing item by ID        | `PUT /users/60c72b2f9b1d4a001f8e4b2c` with body `{ "email": "newemail@example.com" }`             |
| DELETE      | `/:id`        | Delete an item by ID                 | `DELETE /users/60c72b2f9b1d4a001f8e4b2c`                                                          |


Here's the complete README content in a single block for you to copy and paste directly into your README.md file:

markdown
Copy code
# expressRestRouter

The **expressRestRouter** provides a simple class that takes a Mongoose model and returns a RESTful Express router. It simplifies the process of creating RESTful APIs for your Mongoose models with built-in CRUD operations.

## Features

- Automatically generates RESTful routes for standard CRUD operations.
- Option to add global middleware for authentication, logging, etc.
- Pagination, sorting, and filtering capabilities for list queries.

## Installation

You can install the package using npm:

```bash
npm install restful_express_router
```

Usage Example
Here's a simple example of how to use the expressRestRouter in your Express application:

```javascript

require('dotenv').config();
const db = require("./mongo.js"); // Database connection
const mongoose = require('mongoose');
const express = require('express');
const RestfulRouter = require('./src/RestfulRouter.js'); 

const app = express();
app.use(express.json());

// Define a simple Mongoose model
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Create a RESTful router for the User model
let restfulRouter = new RestfulRouter(User);

// Use the RESTful router for the '/users' endpoint
app.use('/users', restfulRouter.getRouter());

app.get('/', (req, res) => res.status(200).json({ message: "Welcome to ExpressRestRouter 0.0.1" }));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

```


## API Manual

<table>
    <thead>
        <tr>
            <th>HTTP Method</th>
            <th>Route</th>
            <th>Description</th>
            <th>Example Request</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>GET</td>
            <td>/</td>
            <td>List all items</td>
            <td>GET /users?sort=-_id&limit=10&page=1</td>
        </tr>
        <tr>
            <td>GET</td>
            <td>/:id</td>
            <td>Get a single item by ID</td>
            <td>GET /users/60c72b2f9b1d4a001f8e4b2c</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/</td>
            <td>Create a new item</td>
            <td>POST /users with body { "email": "user@example.com", "password": "password123" }</td>
        </tr>
        <tr>
            <td>PUT</td>
            <td>/:id</td>
            <td>Update an existing item by ID</td>
            <td>PUT /users/60c72b2f9b1d4a001f8e4b2c with body { "email": "newemail@example.com" }</td>
        </tr>
        <tr>
            <td>DELETE</td>
            <td>/:id</td>
            <td>Delete an item by ID</td>
            <td>DELETE /users/60c72b2f9b1d4a001f8e4b2c</td>
        </tr>
    </tbody>
</table>

<h3>Query Parameters for GET requests</h3>
<ul>
    <li><strong>sort:</strong> Specify the field to sort by (e.g., -createdAt for descending).</li>
    <li><strong>limit:</strong> Number of items to return (default is 10).</li>
    <li><strong>page:</strong> Specify the page number for pagination (default is 1).</li>
    <li><strong>fields:</strong> Specify fields to include in the response (e.g., email,password).</li>
    <li><strong>filters:</strong> Additional filters can be applied based on the model fields (e.g., {"active": true}).</li>
</ul>


## Error Handling
The library provides standard error responses:

 - 404: Item not found
 - 500: Internal server error

## License
This project is licensed under the MIT License.

