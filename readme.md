# restful_express_router

The **restful_express_router**  provides a simple class (**RestfulExpressRouter**) that takes a Mongoose model and returns a RESTful Express router. It simplifies the process of creating RESTful APIs for your Mongoose models with built-in CRUD operations.

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
//-- here it uses index.js but you have to use restful_express_router 
const RestfulRouter = require('./index.js'); 

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


<hr/>
## Middleware Functionality
The RestfulExpressRouter class allows for the use of both global middleware (applied to all routes) and route-specific middleware (applied to individual routes). When creating an instance of the router, you can define middleware for each CRUD route separately. This flexibility enables you to apply custom middleware for specific routes, such as authentication, logging, or validation, while still benefiting from global middleware that applies across all routes.

For example, you can specify middleware for the GET, POST, PUT, and DELETE routes independently, ensuring that each route handles its unique logic and authorization requirements.


<table>
    <thead>
        <tr>
            <th>Route</th>
            <th>Middleware Property</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>GET / (list all items)</td>
            <td>routeMiddleware.list</td>
            <td>Middleware for listing items</td>
        </tr>
        <tr>
            <td>GET /:id (get item by ID)</td>
            <td>routeMiddleware.getById</td>
            <td>Middleware for retrieving a single item by ID</td>
        </tr>
        <tr>
            <td>POST / (create new item)</td>
            <td>routeMiddleware.create</td>
            <td>Middleware for creating a new item</td>
        </tr>
        <tr>
            <td>PUT /:id (update item)</td>
            <td>routeMiddleware.update</td>
            <td>Middleware for updating an existing item</td>
        </tr>
        <tr>
            <td>DELETE /:id (delete item)</td>
            <td>routeMiddleware.delete</td>
            <td>Middleware for deleting an item by ID</td>
        </tr>
    </tbody>
</table>

## Advance Example

```javascript
require('dotenv').config();
const db = require("./mongo.js");
const mongoose = require('mongoose');
const express = require('express');
const RestfulExpressRouter = require('./index.js'); 
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
The library provides standard error responses:

 - 404: Item not found
 - 500: Internal server error

## License
This project is licensed under the MIT License.

## Author

Bilal Tariq

