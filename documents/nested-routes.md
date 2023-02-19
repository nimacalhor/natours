# nested routes

- [nested routes](#nested-routes)
  - [merge Params](#merge-params)

creating review for a tour for example :

`POST` _/tour/2395792/reviews_

getting reviews for a tour

`GET` _/tour/49023754/reviews_

get one review

`GET` _/tour/45829035/reviews/325423857_

```js
router.route("/:tourId/review").post(protect, restrictTo("user"), createReview);
```

## merge Params

`/tourRoutes` :

```js
const reviewRouter = require("./reviewRoutes");

router.use("/:tourId/review", reviewRouter);
```

by default each router only has access to its own params

`/reviewRoutes` :

```js
const router = express.Router({ mergeParams: true });

router.route("/").post(protect, restrictTo("user"), createReview);
```
