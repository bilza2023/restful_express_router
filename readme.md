# restful_express_router

The **restful_express_router** is a lightweight, flexible Node.js package that streamlines the creation of RESTful APIs by automatically generating Express routes for your Mongoose models. With minimal setup, it provides a complete CRUD (Create, Read, Update, Delete) API interface, making it perfect for rapid development while maintaining customization options.

```bash
Main objective is to keep things very simple and provide a boilerplate to create RESTful Express Routers using mongoose 
```
## Features

- **Automatic Route Generation**: Creates standardized RESTful endpoints for all CRUD operations
- **Flexible Middleware Support**: Add custom middleware for authentication, logging, or any other purpose
- **Advanced Query Capabilities**: Built-in support for:
  - Pagination
  - Sorting
  - Field selection
  - Custom filters
- **Customizable**: Easy to extend with additional routes and custom handlers
- **MongoDB/Mongoose Integration**: Seamless integration with your existing Mongoose models

## Installation

Install the package using npm:

```bash
npm install restful_express_router
```

## Usage Example

Below is a basic example demonstrating how to create a complete REST API for a User model:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const RestfulExpressRouter = require('restful_express_router'); 

const app = express();
app.use(express.json());

// Define a simple Mongoose model
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

let restfulExpressRouter = new RestfulExpressRouter(User);

app.use('/users', restfulExpressRouter.getRouter());

app.get('/', (req, res) => res.status(200).json({ message: "Welcome to ExpressRestRouter 0.0.1" }));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


```

## API Manual

### Available Endpoints

<table>
    <thead>
        <tr>
            <th>HTTP Method</th>
            <th>Route</th>
            <th>Description</th>
            <th>Example Request</th>
            <th>Success Response</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>GET</td>
            <td>/</td>
            <td>List all items with pagination</td>
            <td>GET /users?sort=-_id&limit=10&page=1</td>
            <td>200: { data: [...], total: 100, page: 1, limit: 10 }</td>
        </tr>
        <tr>
            <td>GET</td>
            <td>/:id</td>
            <td>Retrieve single item by ID</td>
            <td>GET /users/60c72b2f9b1d4a001f8e4b2c</td>
            <td>200: { _id: "...", ... }</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/</td>
            <td>Create new item</td>
            <td>POST /users { "email": "user@example.com" }</td>
            <td>201: { _id: "...", ... }</td>
        </tr>
        <tr>
            <td>PUT</td>
            <td>/:id</td>
            <td>Update existing item</td>
            <td>PUT /users/60c72b2f9b1d4a001f8e4b2c { "email": "new@example.com" }</td>
            <td>200: { _id: "...", ... }</td>
        </tr>
        <tr>
            <td>DELETE</td>
            <td>/:id</td>
            <td>Remove item</td>
            <td>DELETE /users/60c72b2f9b1d4a001f8e4b2c</td>
            <td>200: { message: "Item deleted successfully" }</td>
        </tr>
    </tbody>
</table>

### Query Parameters

When retrieving lists (GET /), the following query parameters are supported:

- **sort** (string): Sort by any field. Prefix with `-` for descending order
  - Example: `sort=-createdAt` or `sort=email`
- **limit** (number): Number of items per page (default: 10)
  - Example: `limit=20`
- **page** (number): Page number for pagination (default: 1)
  - Example: `page=2`
- **fields** (string): Comma-separated list of fields to include
  - Example: `fields=email,createdAt`
- **filters**: Any model field can be used as a filter
  - Example: `status=active&role=admin`

## Middleware Functionality

The RestfulExpressRouter provides a flexible middleware system that allows you to:
- Add authentication to specific routes
- Log requests
- Validate input data
- Transform responses
- Handle errors

### Middleware Configuration

Each route type can have its own middleware chain:

<table>
    <thead>
        <tr>
            <th>Route Type</th>
            <th>Middleware Property</th>
            <th>Common Use Cases</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>List (GET /)</td>
            <td>middlewareForList</td>
            <td>Pagination, filtering, authorization</td>
        </tr>
        <tr>
            <td>Get by ID (GET /:id)</td>
            <td>middlewareForGetById</td>
            <td>Authorization, data validation</td>
        </tr>
        <tr>
            <td>Create (POST /)</td>
            <td>middlewareForCreate</td>
            <td>Input validation, authorization</td>
        </tr>
        <tr>
            <td>Update (PUT /:id)</td>
            <td>middlewareForUpdate</td>
            <td>Authorization, input validation</td>
        </tr>
        <tr>
            <td>Delete (DELETE /:id)</td>
            <td>middlewareForDelete</td>
            <td>Authorization, cascade deletion</td>
        </tr>
    </tbody>
</table>

## Advanced Example

The following example demonstrates how to implement authentication, logging, and custom routes:

```javascript
require('dotenv').config();
const db = require("./mongo.js");
const mongoose = require('mongoose');
const express = require('express');
const RestfulExpressRouter = require('restful_express_router'); 
const jwt = require('jsonwebtoken');
const login = require('./src/login.js');

const UserSchema = require('./src/UserSchema.js');
const User = mongoose.model('User', UserSchema);

//////////////////////////////
const app = express();
app.use(express.json());

//==Middlewhere
const logRequest = (req, res, next) => {
  // debugger;
  console.log(`Request Method: ${req.method}, URL: ${req.url}`);
  next(); // Proceed to the next middleware or route handler
};


// Middleware  for Auth
const authenticateJWT = (req, res, next) => {
  debugger;
    const token = req.headers['authorization']?.split(' ')[1]; 
    if (!token) {
        return res.sendStatus(403); // Forbidden if no token
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          console.log(`Verified: ${req.method}, URL: ${req.url}`);
            return res.sendStatus(403); // Forbidden if token is not valid
        }
        
        req.user = user; // Save user info in request object
        next(); // Proceed to the next middleware or route handler
    });
};

///////////////////////////////////////////////
let restfulExpressRouter = new RestfulExpressRouter(User);

restfulExpressRouter.middlewareForList = [logRequest];
restfulExpressRouter.middlewareForGetById = [logRequest];
restfulExpressRouter.middlewareForUpdate = [authenticateJWT];

restfulExpressRouter.addExtraRoute(
  {
    method: 'post',
    path: '/login',
    middlewares: [], // Optional: add any middlewares
    handler: async function(req, res) {
      debugger;
      const rez =  await login(req,res);
      return rez;
      // res.status(200).json({ message: 'This is an additional route (login)' });
    }
  }
);

////----Here it all comes together
app.use('/users', restfulExpressRouter.getRouter());

app.get('/', (req, res) => res.status(200).json({ message: "Welcome to ExpressRestRouter 0.0.1" }));

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

```

## Error Handling

The router provides consistent error responses:

- **404**: Resource not found
  - Returned when requesting non-existent items
- **500**: Internal server error
  - Returned for database errors or unexpected issues
- **400**: Bad request
  - Returned for invalid input data
- **403**: Forbidden
  - Returned for authentication/authorization failures

## License

This project is licensed under the MIT License.

## Author

Bilal Tariq