# leylo [![npm version](https://badge.fury.io/js/leylo.svg)](https://badge.fury.io/js/leylo) [![Known Vulnerabilities](https://snyk.io/test/github/Inventsable/leylo/badge.svg)](https://snyk.io/test/github/Inventsable/leylo)

| [Installation](#installation) | [Requirements](#requirements) | [Usage](#usage) | [📚 API](#-api) |
| ----------------------------- | :---------------------------: | :-------------: | :-------------: |


Asynchronous utility functions for [Firestore](https://firebase.google.com/docs/firestore/quickstart) within [Vue CLI 3](https://cli.vuejs.org/).

## ▸ Installation

```bash
npm install leylo
```

If not using Firebase Hosting, there's no need to `npm install firebase` or `npm install firebase-tools`. Just plug in the credentials within your `.env` and you're good to go!

---

## ▸ Requirements

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

## ▸ Usage

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

## 📚 API

All methods are accessible as properties of `leylo`, as in `leylo.docExists(...)`.

<span style="font-size: 1.25rem; font-weight: 500;">&nbsp;&nbsp;&nbsp;&nbsp;📗 [Global](#--global)<span><br>
<span style="font-size: 1.25rem; font-weight: 500;">&nbsp;&nbsp;&nbsp;&nbsp;📙 [Retrieving Data](#--retreiving-data)<span><br>
<span style="font-size: 1.25rem; font-weight: 500;">&nbsp;&nbsp;&nbsp;&nbsp;📘 [Adding Data](#--adding-data)<span><br>
<span style="font-size: 1.25rem; font-weight: 500;">&nbsp;&nbsp;&nbsp;&nbsp;📕 [Deleting Data](#--deleting-data)<span><br>

## [◤](#-api)&nbsp;&nbsp; 📗 Global

> [◤](#-api)&nbsp;&nbsp; Click these arrows to return to the top of the API

### &nbsp;&nbsp; `.db`

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

## [◤](#-api)&nbsp;&nbsp; 📙 Retreiving Data

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
- [leylo.streamDocChangesByField()](#-streamdocchangesbyfieldcollection-field-value-callback-changetype-getdata)
- [leylo.streamDocChangesByQuery()](#-streamdocchangesbyquerycollection-field-query-value-callback-changetype-getdata)
- [leylo.getCollection()](#-getcollectioncollection-getdata)
- [leylo.streamCollection()](#--streamcollectioncollection-callback-changetype-getdata)
- leylo.streamPath

<br>

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.docExists(collection, id)`

> &nbsp;&nbsp;[▲](#--global)&nbsp;&nbsp; Click these arrows to return to the top of each segment

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

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.collectionExists(collection)`

Returns `Boolean` of whether collection with specified name is found in Firestore

- `collection` **[String]** - Name of collection

```js
let validation = await leylo.collectionExists("users");
console.log(validation); //  Returns true
```

<br>

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.getDocById(collection, id[, getData?])`

Returns `Object` with specified `id` in Firestore or `False` if not found

- `collection` **[String]** - Name of collection
- `id` **[String]** - Name/ID of document within collection
- `getData` **[Boolean]** (_Default: true_) - If `true` returns `documentSnapshot.data()` else returns `documentSnapshot`

```js
let user = await leylo.getDocById("users", "Inventsable");
console.log(user); //  Returns { name: 'Tom Scharstein', ... }
```

<br>

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.getDocByField(collection, field, value[, getData?])`

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

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.getAllDocsByField(collection, field, value[, getData?])`

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

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.getDocIdByField(collection, field, value)`

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

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.getDocRefByField(collection, field, value)`

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

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.getDocByQuery(collection, field, query, value[, getData?])`

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

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.getAllDocsByQuery(collection, field, query, value[, getData?])`

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

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.streamDocChangesById(collection, id[, callback, changeType, getData?])`

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

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.streamDocChangesByField(collection, field, value[, callback, changeType, getData?])`

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

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.streamDocChangesByQuery(collection, field, query, value[, callback, changeType, getData?])`

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

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.getCollection(collection[, getData?])`

Returns `Object` with specified `id` in Firestore or `False` if not found

- `collection` **[String]** - Name of collection
- `getData` **[Boolean]** (_Default: true_) - If `true` returns `documentSnapshot.data()` else returns `documentSnapshot`

```js
// Simple grab all documents within a collection:
let userList = await leylo.getCollection("userList");
console.log(userList); // Returns [{…}, {…}, {…}, {…}, {…}]

//
let doSomethingEveryUser = leylo
  .getCollection("userList", false)
  .then(users => {
    users.forEach(user => {
      console.log(`${user.id} is at ${user.ref.path} and contains:`); // Inventsable is at userList/Inventsable and contains
      console.log(user.data()); // Returns Object with document contents { ... }
    });
  });

let doSomethingAsyncForList = await leylo.getCollection("userList", false);
console.log("This prints at the top");
Promise.all(
  doSomethingAsyncEveryUser.map(user => {
    console.log(`This prints in the middle: ${user.id}`); // This prints in the middle: Inventsable
    Promise.resolve(true);
  })
);
console.log(`This prints at the bottom`);
// Now continue to next code
```

<br>

### &nbsp;&nbsp;[▲](#--retreiving-data)&nbsp;&nbsp; `.streamCollection(collection[, callback, changeType, getData?])`

Returns **every matching** result of passing document `Object` as parameter to `callback` every time the collection is modified

- `collection` **[String]** - Name of collection
- `callback` **[Function]** (_Default: null_) - Function to execute on every change to document. If `null`, returns direct `Object` according to `getData` parameter
- `changeType` **[String]** (_Default: null_) - If `null` listen to all, else one of `added`, `modified`, or `removed`
- `getData` **[Boolean]** (_Default: true_) - If `true` passes `querySnapshot.docChanges().data()` to `callback` else passes `querySnapshot.docChanges()`

```js
let streamUsers = await leylo.streamCollection("users", res => {
  console.log("User detected:");
  console.log(res); // Returns { name: 'Inventsable', ... }
});

let streamWelcomeNewUsers = await leylo.streamCollection(
  "users",
  user => {
    console.log(`${user.id} at ${user.ref.path}: Wecome ${user.data().name}!`);
  },
  "added",
  false
);

// Passing document reference to handleChange() method whenever any doc is modified within collection:
let streamEditsToAnyUser = await leylo.streamCollection(
  "user",
  this.handleChange,
  "modified",
  false
);

// If needing to access documentQuery with no changeType specified, assign null:
let streamAllUserEvents = await leylo.streamCollection(
  "messages",
  this.handleMessage,
  null, // if null handle all events, else "modified", "added", or "removed"
  false
);
```

<br>

---

## [◤](#api)&nbsp;&nbsp; 📘 Adding Data

- [leylo.addDoc()](#-)
- [leylo.addAllDocs()](#-)
- [leylo.setDocByPath()](#-)
- [leylo.setAllDocsByPath()](#-)
- [leylo.setDocById()](#-)
- [leylo.setAllDocsById()](#-)
- [leylo.setFieldByPath()](#-)
- [leylo.setFieldById()](#-)

<br>

### &nbsp;&nbsp;[▲](#--adding-data)&nbsp;&nbsp; `.addDoc(collection, data)`

Returns `DocumentReference` result of writing new document with auto-generated id to `collection`

- `collection` **[String]** - Name of collection
- `data` **[Object]** - Contents of document to write

```js
let user = await leylo.addDoc("users", {
  name: "Random",
  location: "Random"
});

console.log(user); //  Returns DocumentSnapshot{ ... }
console.log(user.id); //  Returns 'cmeJ6JeoTCIfvMvgE2ru', auto-generated id
console.log(user.ref.path); //  Returns 'users/cmeJ6JeoTCIfvMvgE2ru'
console.log(user.data()); //  Returns { name: 'Random', location: 'Random' }
```

<br>

### &nbsp;&nbsp;[▲](#--adding-data)&nbsp;&nbsp; `.addAllDocs(collection, ...docs)`

<!-- Returns **every matching** result of passing document `Object` as parameter to `callback` every time the collection is modified -->

- `collection` **[String]** - Name of collection
- `docs` **[Array]** - Array containing `Object`s to be written as documents (without ids)

```js
let newUsers = await leylo.addAllDocs(
  "users",
  ...[{ name: "SomeGuy" }, { name: "SomeGirl" }]
);
console.log(docsCreatedWithGeneratedIds); // Returns [DocumentReference, DocumentReference]
```

<br>

### &nbsp;&nbsp;[▲](#--adding-data)&nbsp;&nbsp; `.setDocByPath(path, data[, overwrite?])`

Returns `Boolean` of whether the document was successfully written to Firestore collection

- `path` **[String]** - Path in the form collection/document
- `data` **[Object]** - Contents of document to write or append
- `overwrite` **[Boolean]** (_Default: false_) - If `false`, merge new `data` with pre-existing document or overwrite if it already exists, but if `true` replace document entirely with new `data`

```js
// If user 'Inventsable' already has content but no location, merge it as a new field:
let setLocation = await leylo.setDocByPath("users/Inventsable", {
  location: "Colorado"
});
console.log(setLocation); //  Returns true

// If location already existed, rewrite it's contents to the new value:
let rewriteLocation = await leylo.setDocByPath("users/Inventsable", {
  location: "Washington"
});
console.log(rewriteLocation); //  Returns true

// If overwrite is true, replace document at path entirely:
let rewriteUserData = await leylo.setDocByPath(
  "users/Inventsable",
  {
    name: "Tom Scharstein",
    location: "Tempe",
    status: "Working"
  },
  true
);

console.log(rewriteUserData); //  Returns true
```

<br>

### &nbsp;&nbsp;[▲](#--adding-data)&nbsp;&nbsp; `.setAllDocsByPath(overwrite, ...docs)`

Returns `Array` of `Boolean`s the length of `docs` array for whether document was successfully written to Firestore

- `data` **[Object]** - Contents of document to write or append
- `overwrite` **[Boolean]** (_Default: false_) - If `false`, merge new `data` with pre-existing document or overwrite if it already exists, but if `true` replace document entirely with new `data`

```js
// Each data is an array in the form [ 'path', contents]
let users = [
  ["users/Inventsable", { name: "Tom" }],
  ["users/somePerson", { name: "John" }],
  ["users/someOtherPerson", { name: "Jane" }]
];

let writeUsers = await leylo.setAllDocsByPath(true, ...users);
console.log(writeUsers); // Returns [true, true, true]

let newLocations = [
  ["users/Inventsable", { location: "Arizona" }],
  ["users/somePerson", { location: "Arizona" }],
  ["users/someOtherPerson", { location: "Arizona" }]
];

let mergeNewLocations = await leylo.setAllDocsByPath(false, ...newLocations);
console.log(writeUsers); // Returns [true, true, true]
```

<br>

### &nbsp;&nbsp;[▲](#--adding-data)&nbsp;&nbsp; `.setDocById(collection, id, data[, overwrite?])`

Returns `Boolean` of whether the document was successfully written to Firestore collection

- `collection` **[String]** - Name of collection
- `id` **[String]** - Name/ID of document within collection
- `data` **[Object]** - Contents of document to write
- `overwrite` **[Boolean]** (_Default: false_) - If `false`, merge new `data` with pre-existing document, but if `true` replace document entirely with new `data`

```js
let setAnotherLocation = await leylo.setDocById(
  "users",
  "Inventsable",
  { location: "Colorado" },
  false
);
console.log(setAnotherLocation);
```

<br>

### &nbsp;&nbsp;[▲](#--adding-data)&nbsp;&nbsp; `.setAllDocsById(collection, overwrite, ...docs)`

Returns `Array` of `Boolean`s the length of `docs` array for whether document was successfully written to Firestore

- `collection` **[String]** - Name of collection
- `overwrite` **[Boolean]** (_Default: false_) - If `false`, merge new `data` with pre-existing document, but if `true` replace document entirely with new `data`
- `docs` **[Array]** - Contents of document to write as `[ 'id', contents ]`

```js
// Each document is an array in the form [ 'id', contents]
let users = [
  ["Inventsable", { name: "Tom" }],
  ["SomeNameHere", { name: "John" }],
  ["ScreenName", { name: "Jane" }]
];

let writeUsers = await leylo.setAllDocsById("users", true, ...users);
console.log(writeUsers); // Returns [true, true, true]
```

<br>

### &nbsp;&nbsp;[▲](#--adding-data)&nbsp;&nbsp; `.setFieldByPath(path, value)`

Returns `Boolean` of whether the field was successfully written to `path`

- `path` **[String]** - Path in the form collection/document/field
- `value` **[Any]** - New value to write to specified `path`

```js
let updateUserLocation = await leylo.setFieldByPath(
  "users/Inventsable/location",
  "Alaska"
);
console.log(updateUserLocation); //  Returns true
```

<br>

### &nbsp;&nbsp;[▲](#--adding-data)&nbsp;&nbsp; `.setFieldById(collection, id, field, value)`

Returns `Boolean` of whether the field was successfully written to `path`

- `collection` **[String]** - Name of collection
- `id` **[String]** - Name/ID of document within collection
- `field` **[String]** - Name of key within document
- `value` **[Any]** - New value to write to specified `path`

```js
let setNewLocation = await leylo.setFieldByDocId(
  "users",
  "Inventsable",
  "location",
  "Colorado"
);
console.log(setNewLocation);
```

<br>

---

## [◤](#api)&nbsp;&nbsp; 📕 Deleting Data

- [leylo.deleteCollection()](#-)
- [leylo.deleteDocById()](#-)
- [leylo.deleteAllDocsByField()](#-)
- [leylo.deleteAllDocsByQuery()](#-)
- [leylo.deleteFieldByDocId()](#-)
- [leylo.deleteAllFieldsContainingValue()](#-)
- [leylo.deleteAllFieldsByQuery()](#-)

---
