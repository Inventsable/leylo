# leylo [![npm version](https://badge.fury.io/js/leylo.svg)](https://badge.fury.io/js/leylo) [![Known Vulnerabilities](https://snyk.io/test/github/Inventsable/leylo/badge.svg)](https://snyk.io/test/github/Inventsable/leylo)

Asynchronous utility functions for [Firestore](https://firebase.google.com/docs/firestore/quickstart) within [Vue CLI 3](https://cli.vuejs.org/).

| [Installation](#Installation) | [Requirements](#Requirements) | [Usage](#Usage) | [API](#API) |
| ----------------------------- | :---------------------------: | :-------------: | :---------: |


## Installation

```bash
npm install leylo
```

If not using Firebase Hosting, there's no need to `npm install firebase` or `npm install firebase-tools`. Just plug in the credentials within your `.env` and you're good to go!

---

## Requirements

You must have a `.env` file at the root of your Vue CLI 3 repo containing the following key/value pairs ([template available in this repo](https://github.com/Inventsable/leylo/blob/master/.env)):

```env
VUE_APP_FIREBASE_APIKEY=...
VUE_APP_FIREBASE_AUTHDOMAIN=...
VUE_APP_FIREBASE_DATABASEURL=...
VUE_APP_FIREBASE_PROJECTID=...
VUE_APP_FIREBASE_STORAGEBUCKET=...
VUE_APP_FIREBASE_MESSAGINGSENDERID=...
VUE_APP_FIREBASE_APPID=...
```

![](./assets/anno.png)

No quotation marks needed in `.env` the above

---

## Usage

```html
<script>
  // Within a .vue file
  import leylo from "leylo";

  export default {
    name: "yourComponent",
    // If using async/await, must define mounted/created/function as async
    async mounted() {
      let validation = await leylo.docExists("users", "Inventsable");
      console.log(validation); //  Returns true

      // All functions are thenable if not using async
      leylo.getDocById("users", "Inventsable").then(response => {
        console.log(response); //  Returns { name: 'Tom Scharstein', ... }
      });
    }
  };
</script>
```

---

# API

All methods are accessible as properties of `leylo`, as in `leylo.docExists(...)`.

<span style="font-size: 1.25rem">&nbsp;&nbsp;&nbsp;&nbsp;- [Global](#-global)<span><br>
<span style="font-size: 1.25rem">&nbsp;&nbsp;&nbsp;&nbsp;- [Retrieving Data](#-retreiving-data)<span><br>
<span style="font-size: 1.25rem">&nbsp;&nbsp;&nbsp;&nbsp;- [Adding Data](#-adding-data)<span><br>
<span style="font-size: 1.25rem">&nbsp;&nbsp;&nbsp;&nbsp;- [Deleting Data](#-deleting-data)<span><br>

## [◤](#api)&nbsp;&nbsp; Global

> [◤](#api)&nbsp;&nbsp; Click these arrows to return to the top of the API

> [▲](#-global)&nbsp;&nbsp; Click these arrows to return to the top of each segment

### [▲](#-global)&nbsp;&nbsp; `.db`

Returns `Object` of interior `Firestore` used for all queries.

```js
console.log(leylo.db);
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

<!-- <span style="float: right">[Back to API 2](#api)</span> -->

## [◤](#api)&nbsp;&nbsp; Retreiving Data

- [leylo.docExists()](#-docexistscollection-id)
- [leylo.collectionExists()](#-collectionexistscollection)
- [leylo.getDocById()](#-getdocbyidcollection-id-getdata)
- [leylo.getDocByField()](#-getdocbyfieldcollection-field-value-getdata)
- [leylo.getDocByQuery()](#-getdocbyquerycollection-field-query-value-getdata)
- [leylo.getAllDocsByField()](#-getalldocsbyfieldcollection-field-value-getdata)
- [leylo.getAllDocsByQuery()](#-getalldocsbyquerycollection-field-query-value-getdata)
- [leylo.getDocIdByField()](#-getdocidbyfieldcollection-field-value)
- [leylo.getDocRefByField()](#-getdocrefbyfieldcollection-field-value)
- [leylo.streamDocChangesById()](#-streamdocchangesbyidcollection-id-callback-getdata)

<br>

### [▲](#-retreiving-data)&nbsp;&nbsp; `.docExists(collection, id)`

Returns `Boolean` of whether document with specified `id` is found in Firestore

- `collection` **[String]** - Name of collection
- `id` **[String]** - Name/ID of document within collection

```js
// WITHIN ASYNC FUNCTION
let validation = await leylo.docExists("users", "Inventsable");
console.log(validation); //  Returns true

// OR THENABLE
leylo.docExists("users", "Inventsable").then(response => {
  console.log(response); // Returns true }
});
```

<br>

### [▲](#-retreiving-data)&nbsp;&nbsp; `.collectionExists(collection)`

Returns `Boolean` of whether collection with specified name is found in Firestore

- `collection` **[String]** - Name of collection

```js
let validation = await leylo.collectionExists("users");
console.log(validation); //  Returns true
```

<br>

### [▲](#-retreiving-data)&nbsp;&nbsp; `.getDocById(collection, id[, getData?])`

Returns `Object` with specified `id` in Firestore or `False` if not found

- `collection` **[String]** - Name of collection
- `id` **[String]** - Name/ID of document within collection
- `getData` **[Boolean]** (_Default: true_) - If `true` returns `documentSnapshot.data()` else returns `documentSnapshot`

```js
let user = await leylo.getDocById("users", "Inventsable");
console.log(user); //  Returns { name: 'Tom Scharstein', ... }
```

<br>

### [▲](#-retreiving-data)&nbsp;&nbsp; `.getDocByField(collection, field, value[, getData?])`

Returns `Object` with specified `field` = `value` in Firestore or `False` if not found

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `value` **[String]** - Value of key/field of target document
- `getData` **[Boolean]** (_Default: true_) - If `true` returns `documentSnapshot.data()` else returns `documentSnapshot`

```js
let user = await leylo.getDocByField("users", "name", "Tom Scharstein");
console.log(user); //  Returns { name: 'Tom Scharstein', ... }
```

<br>

### [▲](#-retreiving-data)&nbsp;&nbsp; `.getAllDocsByField(collection, field, value[, getData?])`

Returns `Array` of every `Object` with specified `field` = `value` in Firestore or `False` if none found

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `value` **[String]** - Value of key/field of target document
- `getData` **[Boolean]** (_Default: true_) - If `true` returns `documentSnapshot.data()` else returns `documentSnapshot`

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

### [▲](#-retreiving-data)&nbsp;&nbsp; `.getDocIdByField(collection, field, value)`

> Same as using `await leylo.getDocByField("users", "name", "Tom Scharstein", false).id`

Returns `String` of specified `field` = `value` document's `id` in Firestore or `False` if not found

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `value` **[String]** - Value of key/field of target document

```js
let user = await leylo.getDocIdByField("users", "name", "Tom Scharstein");
console.log(user); //  Returns 'Inventsable'
```

<br>

### [▲](#-retreiving-data)&nbsp;&nbsp; `.getDocRefByField(collection, field, value)`

> Same as using `await leylo.getDocByField("users", "name", "Tom Scharstein", false).ref.path`

Returns `String` with specified `field` = `value` document's path in Firestore or `False` if not found

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `value` **[String]** - Value of key/field of target document

```js
let user = await leylo.getDocRefByField("users", "name", "Tom Scharstein");
console.log(user); //  Returns 'users/Inventsable'
```

<br>

### [▲](#-retreiving-data)&nbsp;&nbsp; `.getDocByQuery(collection, field, query, value[, getData?])`

Returns first `Object` found with specified `field` `(query)` `value` in Firestore or `False` if not found

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `query` **[String]** - One of `==`, `>=`, `<=`, `>`, `<`, `array_contains` or valid Firebase query string
- `value` **[String]** - Value of key/field of target document
- `getData` **[Boolean]** (_Default: true_) - If `true` returns `documentSnapshot.data()` else returns `documentSnapshot`

```js
let placeTooHotToLiveIn = await leylo.getDocByQuery(
  "states",
  "temperature",
  ">="
  "110",
  false
);
placeTooHotToLiveIn.forEach(place => {
  console.log(place);  //  Returns DocumentSnapshot{ ... }
});
```

<br>

### [▲](#-retreiving-data)&nbsp;&nbsp; `.getAllDocsByQuery(collection, field, query, value[, getData?])`

Returns `Array` of every `Object` with specified `field` `(query)` `value` in Firestore or `False` if none found

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `query` **[String]** - One of `==`, `>=`, `<=`, `>`, `<`, `array_contains` or valid Firebase query string
- `value` **[String]** - Value of key/field of target document
- `getData` **[Boolean]** (_Default: true_) - If `true` returns `documentSnapshot.data()` else returns `documentSnapshot`

```js
let usersInArizona = await leylo.getAllDocsByQuery(
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

### [▲](#-retreiving-data)&nbsp;&nbsp; `.streamDocChangesById(collection, id[, callback, changeType, getData?])`

Returns result of passing document `Object` as parameter to `callback` every time the document is modified

- `collection` **[String]** - Name of collection
- `id` **[String]** - Name/ID of document within collection
- `callback` **[Function]** (_Default: null_) - Function to execute on every change to document
- `changeType` **[String]** (_Default: null_) - If `null` listen to all, else one of `added`, `modified`, or `removed`
- `getData` **[Boolean]** (_Default: true_) - If `true` passes `querySnapshot.docChanges().data()` to `callback` else passes `querySnapshot.docChanges()`

```js

// Can do this during created(), mounted() or some init function
let messages = await leylo.streamDocChangesById(
  "messages",
  "chatroomA",
  newdata => {
    // Executes every time a field is added or modified to this document
    console.log("Document has changed to:");
    console.log(newdata);
  }
);

let userList = await leylo.streamDocChangesById(
  "users",
  "chatroomA",
  this.addUser,
  'added',
  false
);

// Passing the data from above stream into one of our component's methods:
methods: {
  addUser(doc) {
    console.log(doc.data())
  }
}

```

<br>

### [▲](#-retreiving-data)&nbsp;&nbsp; `.streamDocChangesByField(collection, field, value[, callback, changeType, getData?])`

Returns **every matching** result of passing document `Object` as parameter to `callback` every time the document is modified.

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `value` **[String]** - Value of key/field of target document
- `callback` **[Function]** (_Default: null_) - Function to execute on every change to document
- `changeType` **[String]** (_Default: null_) - If `null` listen to all, else one of `added`, `modified`, or `removed`
- `getData` **[Boolean]** (_Default: true_) - If `true` passes `querySnapshot.docChanges().data()` to `callback` else passes `querySnapshot.docChanges()`

```js
let userList = await leylo.streamDocChangesById(
  "users",
  "chatroomA",
  this.addUser,
  "added",
  false
);
```

<br>

### [▲](#-retreiving-data)&nbsp;&nbsp; `.streamDocChangesByQuery(collection, field, query, value[, callback, changeType, getData?])`

Returns **every matching** result of passing document `Object` as parameter to `callback` every time the document is modified

- `collection` **[String]** - Name of collection
- `field` **[String]** - Name of key/field of target document
- `query` **[String]** - One of `==`, `>=`, `<=`, `>`, `<`, `array_contains` or valid Firebase query string
- `value` **[String]** - Value of key/field of target document
- `callback` **[Function]** (_Default: null_) - Function to execute on every change to document
- `changeType` **[String]** (_Default: null_) - If `null` listen to all, else one of `added`, `modified`, or `removed`
- `getData` **[Boolean]** (_Default: true_) - If `true` passes `querySnapshot.docChanges().data()` to `callback` else passes `querySnapshot.docChanges()`

```js
let userList = await leylo.streamDocChangesById(
  "users",
  "chatroomA",
  this.addUser,
  "added",
  false
);
```

<br>

### [▲](#-retreiving-data)&nbsp;&nbsp; `.streamCollection(collection[, callback, changeType, getData?])`

Returns **every matching** result of passing document `Object` as parameter to `callback` every time the collection is modified

- `collection` **[String]** - Name of collection
- `callback` **[Function]** (_Default: null_) - Function to execute on every change to document. If `null`, returns direct `Object` according to `getData` parameter
- `changeType` **[String]** (_Default: null_) - If `null` listen to all, else one of `added`, `modified`, or `removed`
- `getData` **[Boolean]** (_Default: true_) - If `true` passes `querySnapshot.docChanges().data()` to `callback` else passes `querySnapshot.docChanges()`

```js
let userStream = await leylo.streamCollection("users", res => {
  console.log("user detected:");
  console.log(res); // Returns { name: 'Tom Scharstein', ... }
});

let messageStream = await leylo.streamCollection(
  "messages",
  res => {
    console.log("New message added:");
    console.log(res);
  },
  "added",
  false
);

// Pass all modified documents of collection to specified handleMessage() method:
let editStream = await leylo.streamCollection(
  "messages",
  this.handleMessage,
  "modified"
);

// If needing to access documentQuery with no changeType specified, assign null:
let editStream2 = await leylo.streamCollection(
  "messages",
  this.handleMessage,
  null,
  false
);
```

<br>

---

## [◤](#api)&nbsp;&nbsp; Adding Data

**Todo**

---

## [◤](#api)&nbsp;&nbsp; Deleting Data

**Todo**

---
