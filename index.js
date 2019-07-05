import db from "./init.js";
const docId = db.app.firebase_.firestore.FieldPath.documentId();

async function docExists(collection, id) {
  return await db
    .collection(collection)
    .where(docId, "==", id)
    .get()
    .then(snapshot => {
      return snapshot.docs.length > 0;
    });
}

async function collectionExists(collection) {
  return await db
    .collection(collection)
    .get()
    .then(snapshot => {
      return snapshot.docs.length > 0;
    });
}

async function getDocById(collection, id) {
  return await db
    .collection(collection)
    .where(docId, "==", id)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      return snapshot.docs[0].data();
    });
}

async function getAllDocsByField(collection, field, value) {
  return await db
    .collection(collection)
    .where(field, "==", value)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      return Promise.all(
        snapshot.docs.map(doc => {
          return Promise.resolve(doc.data());
        })
      );
    });
}

async function getDocByField(collection, field, value) {
  return await db
    .collection(collection)
    .where(field, "==", value)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      return snapshot.docs[0].data();
    });
}

async function queryDocByField(collection, field, query, value) {
  return await db
    .collection(collection)
    .where(field, query, value)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      return snapshot.docs[0].data();
    });
}
async function queryAllDocsByField(collection, field, query, value) {
  return await db
    .collection(collection)
    .where(field, query, value)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      return Promise.all(
        snapshot.docs.map(doc => {
          return Promise.resolve(doc.data());
        })
      );
    });
}

async function getCollection(collection) {
  return await db
    .collection(collection)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      return Promise.all(
        snapshot.docs.map(doc => {
          return Promise.resolve(doc.data());
        })
      );
    });
}

const leylo = {
  db: db,
  docExists: docExists,
  getDocById: getDocById,
  getDocByField: getDocByField,
  getAllDocsByField: getAllDocsByField,
  queryDocByField: queryDocByField,
  queryAllDocsByField: queryAllDocsByField,
  collectionExists: collectionExists,
  getCollection: getCollection
};
export default leylo;
