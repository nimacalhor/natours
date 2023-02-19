# middlewares in mongoose

- [middlewares in mongoose](#middlewares-in-mongoose)
  - [document](#document)
    - [.pre()](#pre)
    - [.post()](#post)
  - [query](#query)
  - [aggregate](#aggregate)

there are four types of middlewares in mongoose

- document middleware
- query middleware
- aggregate
- model middleware

<!-- <a name="document" /> -->

## document

can act on the currently proccessed document

`we define it on the schema`

### .pre()

runs before .save() and .create
`not on insert many`

we can change and modify the document before it saves on the database

the `this keyword` in the callback function is the document

```javascript
schema.pre("save", function (next) {
  // do stuff
  return next();
});
```

Each function in a `presave middleware` has access to the `next() function` to continue and not block the middleware stack.
k

### .post()

post middleware function will be run after all `.pre()` middleware functions have been executed.
In this function, the finished document will be passed as an argument to the function argumants.

```javascript
schema.post("save", function (doc, next) {
  // do stuff
  return next();
});
```

`we can have multiple middlewares for one method`

<!-- <a name="query" /> -->

## query

metod : `find`

this key word referse to the query object so we can change it before it reches the database

```javascript
schema.pre("find", function (next) {
  this.find({ secretDate: { $ne: true } });
  return next();
});
```

this middleware will not work for `findOne`

**solution :**

```javascript
schema.pre(/^find/, function(next){ ... })
```

## aggregate

method : `aggregate`

this keyword refers to the aggregate object

aggregation array : `this.pipeline()`

```javascript
schema.pre("aggregate", function (next) {
  this.pipeline().ushift({
    $match: {
      secretData: { $ne: true },
    },
  });
  return next();
});
```
