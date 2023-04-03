# Express-1.2 Assignment
Building a CRUD server with in memory storage

- [Express-1.2 Assignment](#express-12-assignment)
- [Overview: How to read what we already have](#overview-how-to-read-what-we-already-have)
  - [Where to start?](#where-to-start)
  - [index.js: Starting server](#indexjs-starting-server)
  - [server.js: Required modules](#serverjs-required-modules)
  - [server.js: Static Assets and Body Parsing](#serverjs-static-assets-and-body-parsing)
  - [server.js: our Model middleware](#serverjs-our-model-middleware)
  - [server.js: DELETE all route](#serverjs-delete-all-route)
  - [model-book.js](#model-bookjs)
    - [Wait, where did my books go?](#wait-where-did-my-books-go)
- [Question 1: GET /books](#question-1-get-books)
- [Question 2: POST /books](#question-2-post-books)
- [Question 3: GET /books/:id](#question-3-get-booksid)
- [Question 4: PATCH /books/:id](#question-4-patch-booksid)
- [🚨 DEBUG: Fix Book.delete()! 🚨](#-debug-fix-bookdelete-)
- [Question 5: DELETE /books/:id](#question-5-delete-booksid)
- [Bonus:  Fetch to create](#bonus--fetch-to-create)


Welcome to the world of Express! As you'll see in the next few days, it's a lot to cover, but luckily it's all patterns! The most important of which is `CRUD`:
- Create = Make new resources
- Read = Load existing resources
- Update = Take an existing resource and modify it
- Delete = Destroy resources

Once you get a feel for CRUD, you'll be amazed how much of the web is built off these 4 simple actions.

# Overview: How to read what we already have
BEFORE you skip down to the questions section of the page, let's talk about what we *already* have in this repo. A lot more than usual!

> **Don't worry, no matter how many files there are, we always take it one piece at a time**

## Where to start?
Whenever dropping into a new repo with existing code, look in the `package.json` for a starting point (usually whatever `npm start` refers to). What does it say? It looks like it points to `src/index.js`, let's start there (remember `nodemon` is the same as `node` it just restarts our server on save, so we don't have to).

## index.js: Starting server
At the top of the file is where we `require` all the different modules we need. Looks like we're only `requiring` a server and getting it started. We're using [environment variables](https://nodejs.dev/en/learn/how-to-read-environment-variables-from-nodejs/) to read `PORT` and `HOST`, but setting defaults. Our `listen` callback tells our server where to listen for requests, and prints a link for us to click in the console. Alright, since the only thing we're importing here is `server.js`, let's look at that next.

## server.js: Required modules
This time we're `requiring` the `express`, `path`, and `model-books` modules. Before diving into those, it can be helpful to read *this* file to gain more context. Let's continue in `server.js` for now.

## server.js: Static Assets and Body Parsing
We're using `express` and `path` to handle our `Static Assets` (client html/js/css) with some built in [middleware](https://expressjs.com/en/guide/writing-middleware.html).

```js
const app = express();

const publicDir = path.join(__dirname, '..', 'public');
const staticServer = express.static(publicDir);
app.use(staticServer);

app.use(express.json());
```

Don't worry too much about these yet, just know that [express.static](https://expressjs.com/en/starter/static-files.html) means when we go to `http://localhost:8080` we'll be able to see our `index.html` and anything else in the `public` file.

As for `express.json()`, it lets us parse out the `req.body` property. Remember since both have `app.use()` without a file path, *they apply to the whole app*.

> Order matters when registering routes and middleware! First registered, first hit.

## server.js: our Model middleware
This is our custom middleware, all it does is add our `Book` model as a property to `req`.

## server.js: DELETE all route
The only other thing left in `server.js`, besides the export, is a `DELETE` all route. There's a comment that says we only need this for testing, so we can ignore it for the assignment. Maybe we can reference some things in this later like the `.status` and `.send` methods? (hint: do that)

## model-book.js
A "Model" is a class that refers specifically to a real thing, or "entity." So, a class that handles fetches probably wouldn't be called a model, but a class that tracks our book data would definitely be called the `Book` model. In our case, this model is responsible for some helpful methods like creating, reading, updating, and deleting books. ...wait that's CRUD!

You may not be super comfortable with [Static class methods](https://www.w3schools.com/js/js_class_static.asp), but all you need to know is that the *class* `Book` has methods on it that *don't* require the `new` keyword to use.

```js
const theHobbit = new Book('The Hobbit');

console.log(Book.list());
// [ Book { id: 1, title: 'The Hobbit' } ]
console.log(Book.find(theHobbit.id));
// { id: 1, title: 'The Hobbit' }
console.log(Book.editTitle(theHobbit.id, 'The Hobbit 2'));
// { id: 1, title: 'The Hobbit 2' }
console.log(Book.delete(theHobbit.id));
// true
console.log(Book.list());
// []


console.log(Book.#all)
// NO! This is an error, you have to use Book.list()
// this way, no one can mess with our list of books!
```

Also, that funky `#all` means it's a [*private* class property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields). No one outside can access it, that's why we call `Book.list()` externally, and not just `Book.all`.

OK! Let's run `npm i` and `npm start` in our terminal, get our Postman ready for queries, and start building! You can also do `npm run test:w` to have Jest continuously test your server on save.

### Wait, where did my books go?
Since we're using in memory storage, our data isn't permanent. As long as our server is running, we have access to same Books data. However, when the server restarts, all that data will be reset. We'll use DBs next week, but for now keep this behavior in mind. It's not a bug, it's simply how things work.

# Question 1: GET /books
First up, lets create a route that returns a list of all our books. Let's make it a `GET` request because we don't need to *send* a body. If we have no books, then our API should send back an empty array.

- **HTTP Verb:** GET
- **url:** /books
- **expected response:** An array of `Books` or an empty array
- **status code**: Always `200`

If you need some clues about `send`ing responses and `status` codes, check out the `delete` route!

----------------------------------------------------------------


# Question 2: POST /books
Now that we can read our books, we should be able to send over some data and create them. If we `POST`ed data like

```json
{ "title": "The Great Gatsby" }
```

We would expect our server to return that information *plus* an id:
```json
{ "id":1, "title": "The Great Gatsby" }
```

Also, since we're creating a resource, we want a status code of `201`. [Look at the cats for fun](https://http.cat)

- **HTTP Verb:** POST
- **url:** /books
- **expect request:** An object with a `title` property
- **expected response:** A single `Book` object
- **status code**: Always `201`

----------------------------------------------------------------


# Question 3: GET /books/:id
Now it's time to get into using `dynamic routing` with [route parameters](https://expressjs.com/en/guide/routing.html#route-parameters). In order to get a *single* specific book, we have to send over the book's id in the url as a `parameter`.

So if I made a get request to `/books/2`, I would expect:

```json
{ "id": 2, "title": "Some book" }
```

However, what if someone requests a resource that doesn't exist? In that case we want to send a `404`, and a body that's just the text "Not Found"

- **HTTP Verb:** GET
- **url:** /books/:id
- **expected response:** A single `Book` object OR the text "Not Found"
- **status code**: Either `200` or `404`

> HINT: I bet there's a specific method that can *just* send a status Code and auto set the body text.

----------------------------------------------------------------


# Question 4: PATCH /books/:id
Here we are, the *hardest* request. It takes a specific HTTP verb, a dynamic route for an id, body data in the request, *and* sends a 404 if there was no resource to update.

So if a resource exists, and we hit `/books/3` with a `PATCH` and this body:

```json
{ "title": "The Hunger Games: More money Edition" }
```

We would expect back a `200` status, and the updated record:

```json
{ "id": 3, "title": "The Hunger Games: More money Edition" }
```

If however we hit a non-existent id, `/books/123123`, we just get a `404` and a `Not Found` body.

- **HTTP Verb:** PATCH
- **url:** /books/:id
- **expect request:** An object with a `title` property
- **expected response:** A single `Book` object OR the text "Not Found"
- **status code**: Either `200` or `404`

Notice that the id is in the route parameter and not the body. With a `PATCH` request, the id isn't usually required (if the API is sticking to conventions).

# 🚨 DEBUG: Fix Book.delete()! 🚨
Ah, shoot. I just noticed we can't build our `DELETE` route until we fix the underlying `Book.delete` method. Check out the `/tests/debug.spec.js` file to see what's failing. Ideally, we should be able to pass an `id` into `Book.delete()` and *only* that book would be deleted. I'd recommend making a `playground.js` file to mess around with the model.

# Question 5: DELETE /books/:id
OK! Now that the `Book.delete()` is fixed, let's make the last route.With `DELETE` routes, they just send a status code of `204` and an empty body or a `404` and a "Not Found" body.

- **HTTP Verb:** DELETE
- **url:** /books/:id
- **expected response:** An empty response OR the text "Not Found"
- **status code**: Either `204` or `404`

# Bonus:  Fetch to create
Hungry for more? If all your tests are passing, here's a challenge for you: create a form in `/public/index.html` to create a new book.

It should have:
- A label
- A text input
- A submit button that sends `{ "title": "whatever" }` via `POST`
- On a successful submission, clear the form, and re-render the books to see your new book!

Only attempt the bonus if you *fully* understand everything about the server.
