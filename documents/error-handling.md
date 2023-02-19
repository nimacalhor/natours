# Error handling

table of content

- [Error handling](#error-handling)
  - [NDB](#ndb)
  - [handle unhandled routes](#handle-unhandled-routes)
  - [overview of error handling](#overview-of-error-handling)
    - [operational Errors](#operational-errors)
    - [programming Errors](#programming-errors)
  - [global error handling middleware](#global-error-handling-middleware)
  - [async handlers](#async-handlers)
  - [types of error responses](#types-of-error-responses)
  - [404](#404)
  - [errors related to database](#errors-related-to-database)
    - [invalid id](#invalid-id)
    - [duplicate key](#duplicate-key)
    - [Validation error](#validation-error)
  - [errors outside Express **Unhandled promise rejection**](#errors-outside-express-unhandled-promise-rejection)
  - [uncaught exceptions](#uncaught-exceptions)

---

## NDB

npm package that can be helpful while debugging

```bash
npm i ndb --global
```

```json
"scripts": {
    .
    .
    "debug": "ndb server.js"
}
```

## handle unhandled routes

```javascript
app.all("*", (req, res, next) =>
  res
    .status(404)
    .json(...)
);
```

---

## overview of error handling

there are two types of error that can happen in our app

### operational Errors

problems that will happen at some point and we can predict them in advance

- invalid path access
- validator fail
- failed to connect to the server
- request timeout
- ...

these errors usually depends on the internet , user, database and ...

### programming Errors

programming bugs in the code 👻

---

## global error handling middleware

in express.js we use a `global error handling middleware` as a central error handling point in the app to handle all errors in the app then send the correct response

when we declare `four parameters` for a middleware function in Express.js , it automatically knows that the function is an error handling one

```typescript
app.use(((err, req, res, next) => {
    ...
}) as ErrorRequestHandler);

```

by throwing an error in other handlers and pass an argument to the `next()` function we inform Express that we have an error

if the `next()` function receives any parameter express will automatically knows that an error occurred

```js
next(any);
```

---

## async handlers

for better and cleaner code its a good practice to have less nested code

so we write a function to handle all errors in async handlers

```js
const escortAsync = (asyncF) => {
  asyncF().catch((err) => next(err));
};
```

---

## types of error responses

we only want to send specific and complete error data while we are in `development mode`

more data in development

avoid unnecessary data in production

```js
if (process.env.NODE_ENV === "development")
  res.status(statusCode).json({
    status,
    message,
    stack,
    error: err,
  });
else if (process.env.NODE_ENV === "production")
  res.status(statusCode).json({
    status,
    message,
    data: null,
  });
```

---

## 404

```js
app.all("*", (req, res, next) =>
  ...
);
```

---

## errors related to database

- invalid document id `_id`
- duplicate key while creating document
- validation errors

we need to create an elegant error message for mongoDB related Errors because they are not very user friendly

### invalid id

when this error occurs by mongoose error object will contain the name property witch is set to `"CastError"`

- invalid key : `err.path`
- invalid value : `err.value`

### duplicate key

duplicate value for a key that supposed to be unique

we can identify this error by its error code `err.code` property

err.code: `11000`

the reasons why an Error might happen for unique paths

1. Duplicate documents already created in DB before defining this property
   You might have already added some duplicate data in the database so mongoose and MongoDB simply doesn't check unique field because it's already messed up

Delete the messed data from the MongoDB collections page to solve it

2. Auto Indexing or Create index is false
   If you wouldn't have specified to auto index the data
   which means to check for uniqueness, mongoose wouldn't do that

[full article](<(https://dev.to/akshatsinghania/mongoose-unique-not-working-16bf)>)

### Validation error

if the occurred error was related to the validation of the document, the `error.name` will be `**ValidationError**`

```js
if(err.name === "ValidationError") handleValidationError(...)
```

---

## errors outside Express **Unhandled promise rejection**

Some errors might happen outside our Express app, like MongoDB being down.
in that case we have no access to the error object and our `global error handler` is now useless

When there is an unhandled promise rejection in our app, the `process` global object will emit the promise rejection object, so we can subscribe to that event.

```js
process.on("unhandledRejection", (err: any) => {
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
```

---

## uncaught exceptions
code bugs that occurs during production
