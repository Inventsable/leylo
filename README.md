# leylo (WIP)

Asynchronous utility functions for Firestore within Vue CLI 3.

## Installation

```bash
npm install leylo
```

---

## Requirements

You must have a `.env` file at the root of your Vue CLI 3 repo containing the following key/value pairs:

```env
VUE_APP_FIREBASE_KEY=...
VUE_APP_FIREBASE_AUTHDOMAIN=...
VUE_APP_FIREBASE_DATABASEURL=...
VUE_APP_PROJECTID=...
VUE_APP_FIREBASE_BUCKET=...
VUE_APP_MESSAGINGSENDERID=...
VUE_APP_ID=...
```

![](./assets/anno.png)

No quotation marks needed

---

## Usage

```html
// Within a .vue file
<script>
  import leylo from "leylo";

  export default {
    name: "yourComponent",
    // If using async/await, must define mounted/created/function as async
    async mounted() {
      let validation = await leylo.docExists("users", "Inventsable");
      console.log(validation); //  Returns true

      // All functions are thenable if not using async
      leylo.docExists("users", "Inventsable").then(response => {
        console.log(response); //  Returns true
      });
    }
  };
</script>
```

---

# API

All methods are accessible as properties of `leylo`, as in `leylo.docExists(...)`.

## Global

### `.db`

Returns `Object` of interior `Firestore` used for all queries.

```js
let db = leylo.db;
console.log(db);
// Returns Firestore {_queue: AsyncQueue, INTERNAL: {…}, _config: FirestoreConfig, _databaseId: DatabaseId, _dataConverter: UserDataConverter, …}
```

Can be used as an alias to any custom `Firestore` [query](https://googleapis.dev/nodejs/firestore/latest/Query.html) or method:

```js
let query = leylo.db.collection("col");

query
  .orderBy("foo")
  .endAt(42)
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(documentSnapshot => {
      console.log(`Found document at ${documentSnapshot.ref.path}`);
    });
  });
```

---

## Retreiving Data

### `.docExists(collection, id)`

Returns `Boolean` of whether document with specified `id` is found in Firestore

- `collection` **[String]** - Name of collection
- `id` **[String]** - Name/ID of document within collection

```js
// WITHIN ASYNC FUNCTION
let validation = await leylo.docExists("users", "Inventsable");
console.log(validation); //  Returns true

// OR THENABLE
leylo.docExists("users", "Inventsable").then(response => {
  console.log(response); //  Returns true
});
```

<br>

### `.collectionExists(collection)`

Returns `Boolean` of whether collection with specified name is found in Firestore

- `collection` **[String]** - Name of collection

```js
let validation = await leylo.collectionExists("users");
console.log(validation); //  Returns true
```

<br>

### `.getDocById(collection, id)`

Returns `Object` with specified `id` in Firestore or `False` if not found

- `collection` **[String]** - Name of collection
- `id` **[String]** - Name/ID of document within collection

```js
let user = await leylo.getDocById("users", "Inventsable");
console.log(user); //  Returns { name: 'Tom Scharstein', ... }
```

<br>

### `.getDocByField(collection, field, value)`

Returns `Object` with specified `field` = `value` in Firestore or `False` if not found

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `value` **[String]** - Value of key/field of target document

```js
let user = await leylo.getDocByField("users", "name", "Tom Scharstein");
console.log(user); //  Returns { name: 'Tom Scharstein', ... }
```

<br>

### `.getAllDocsByField(collection, field, value)`

Returns `Array` of every `Object` with specified `field` = `value` in Firestore or `False` if none found

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `value` **[String]** - Value of key/field of target document

```js
let usersInArizona = await leylo.getAllDocsByField(
  "users",
  "location",
  "Arizona"
);
// Returns [ ... ]
usersInArizona.forEach(user => {
  console.log(user); //  Returns { name: 'Tom Scharstein', ... }
});
```

<br>

### `.queryDocByField(collection, field, query, value)`

Returns first `Object` found with specified `field` `(query)` `value` in Firestore or `False` if not found

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `query` **[String]** - One of `==`, `>=`, `<=`, `>`, `<`, or valid Firebase query string
- `value` **[String]** - Value of key/field of target document

```js
let placeTooHotToLiveIn = await leylo.queryDocByField(
  "states",
  "temperature",
  ">="
  "110"
);
placeTooHotToLiveIn.forEach(place => {
  console.log(place);  //  Returns { name: 'Arizona', ... }
});
```

<br>

### `.queryAllDocsByField(collection, field, query, value)`

Returns `Array` of every `Object` with specified `field` `(query)` `value` in Firestore or `False` if none found

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `query` **[String]** - One of `==`, `>=`, `<=`, `>`, `<`, or valid Firebase query string
- `value` **[String]** - Value of key/field of target document

```js
let usersInArizona = await leylo.queryAllDocsByField(
  "users",
  "location",
  "==",
  "Arizona"
);
// Returns [ ... ]
usersInArizona.forEach(user => {
  console.log(user); //  Returns { name: 'Tom Scharstein', ... }
});
```

<br>

---

## Setting Data

**Todo**

---
