---
title: 'Making a Full-Stack Todo List'
date: '2021-06-20'
---

This article is about the many new things I learned while developing a full-stack to-do list. This app uses the MERN stack and is deployed on Heroku.

- [Github repo](https://github.com/HoangNguyen-CA/fullstack-todo-list)

## Backend

- Express
- Mongoose (MongoDB)

Using express, I created a REST API to handle HTTP requests and perform CRUD operations. For simplicity, all to-dos share a global collection in MongoDB; user-dependent data is not stored (yet).

### API Routes

The following routes are able to handle all API requests:

- GET `/api/todos/`
  - Fetches all to-dos
- POST `/api/todos/`
  - Adds a new to-do
- PUT `/api/todos/:id/`
  - Edits an existing to-do
- DELETE `/api/todos/:id/`
  - Deletes an existing to-do

### Asynchronous Code

I used the mongoose package to integrate MongoDB with express. Interacting with a database is an asynchronous operation and must be handled properly. I recently learned a new syntax for making asynchronous calls: async/await. The async/await syntax allows for asynchronous code to be written similarly to synchronous code. In my opinion, this new syntax is much cleaner and more convenient to use when compared to promises.

```js
/* async/await syntax */
async (req, res) => {
  try {
    const data = await Todo.findOne(); // Asynchronous call
  } catch (e) {
    // handle error
  }
};

/* promises syntax */
Todo.findOne()
  .then((data) => {})
  .catch((e) => {});
```

### Error Handling

I recently learned a new way to handle errors in an express app. This is done using a centralized error handling middleware. This middleware will automatically catch all synchronous errors that are thrown. Asynchronous errors must be handled differently, they must be passed into the next() function in each middleware to be handled. Using this middleware is convenient since all errors in the app will be processed and an appropriate response will be sent to the client.

```js
app.use((err, req, res, next) => {
  const { status = 500, message = 'Something Went Wrong!' } = err;
  res.status(status).json({ status, error: message });
});
```

Using a custom AppError class, errors can be thrown that contains a status code and a message, which will be sent to the handler.

```js
class AppError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
}
```

#### Asynchronous Errors

To properly catch and send asynchronous errors to the error handler, asynchronous code must be wrapped in a try/catch statement. To achieve this, I created a higher-order function that takes in an asynchronous function and catches all errors produced by it. The function then calls next(error) to send the error to the error handler. This function wraps around all route callbacks to catch all of their errors.

```js
const wrapAsync = (action) => (req, res, next) =>
  action(req, res, next).catch((error) => next(error));


router.get('/', wrapAsync(async (req, res, next) => {
    ...
  })
);
```

## Frontend

- React
- CSS Modules

### Styling

Using CSS Modules allows for CSS code to be modular and prevent conflicts between styling classes. Each React component has its own stylesheet which only applies locally. CSS module comes built-in with create-react-app. CSS module files must end with `.module.css` and can be imported into any react component. All of the styles become available from the imported object and can be used in the className property.

```css
/* styles.module.css*/
.bigFont {
  font-size: 1rem;
}
```

```js
/* App.js */
import styles from './styles.module.css';

function App() {
  return <p className={styles.bigFont}>hello world</p>;
}
```

#### Global Theme

To keep the colours consistent within my app, I needed a way to share variables between all of my CSS files. I used CSS custom properties(variables) to achieve this. CSS variables can be set in a global CSS file and be accessed from any CSS file on the page using the var() function.

```css
/* global.css*/
html {
  --colors-dark: #161616;
  --colors-primary: rgb(86, 12, 255);
  --colors-primary-dark: rgb(65, 0, 218);
  --colors-primary-light: #5a66ff;
  --colors-blue: #127bff;
  --colors-blue-dark: rgb(5, 99, 214);
  --colors-orange: #fe5413;
  --colors-orange-dark: #d13e04;
}

/* styles.module.css */

.orangeBackground {
  background-color: var(--colors-orange);
}
```

## Conclusion

Creating this app was a great learning experience. I made a lot of progress understanding how to write good and modular code.

Here is the site deployed to Heroku:

- [Todo List](https://hoangnguyen-todolist.herokuapp.com/)
