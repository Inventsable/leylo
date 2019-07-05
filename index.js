import db from "./init.js";

async function docExists(collection, id) {
  return await db
    .collection(collection)
    .where(db.app.firebase_.firestore.FieldPath.documentId(), "==", id)
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

async function getDocById(collection, id, getData = true) {
  return await db
    .collection(collection)
    .where(db.app.firebase_.firestore.FieldPath.documentId(), "==", id)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      if (getData) return snapshot.docs[0].data();
      else return snapshot.docs[0];
    });
}

async function getDocRefByField(collection, field, value) {
  return await db
    .collection(collection)
    .where(field, "==", value)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      return snapshot.docs[0].ref.path;
    });
}

async function getDocIdByField(collection, field, value) {
  return await db
    .collection(collection)
    .where(field, "==", value)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      return snapshot.docs[0].id;
    });
}

async function getAllDocsByField(collection, field, value, getData = true) {
  return await db
    .collection(collection)
    .where(field, "==", value)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      return Promise.all(
        snapshot.docs.map(doc => {
          if (getData) return Promise.resolve(doc.data());
          else return Promise.resolve(doc);
        })
      );
    });
}

async function getDocByField(collection, field, value, getData = true) {
  return await db
    .collection(collection)
    .where(field, "==", value)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      if (getData) return snapshot.docs[0].data();
      else return snapshot.docs[0];
    });
}

async function queryDocByField(
  collection,
  field,
  query,
  value,
  getData = true
) {
  return await db
    .collection(collection)
    .where(field, query, value)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      if (getData) return snapshot.docs[0].data();
      else return snapshot.docs[0];
    });
}
async function queryAllDocsByField(
  collection,
  field,
  query,
  value,
  getData = true
) {
  return await db
    .collection(collection)
    .where(field, query, value)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      return Promise.all(
        snapshot.docs.map(doc => {
          if (getData) return Promise.resolve(doc.data());
          else return Promise.resolve(doc);
        })
      );
    });
}

async function streamDocChanges(
  collection,
  id,
  callback = null,
  getData = true
) {
  return await db
    .collection(collection)
    .where(db.app.firebase_.firestore.FieldPath.documentId(), "==", id)
    .onSnapshot(querySnapshot => {
      return Promise.all(
        querySnapshot.docChanges().map(change => {
          if (!callback) {
            if (getData) return Promise.resolve(change.doc.data());
            else return Promise.resolve(change.doc);
          } else {
            if (getData) return Promise.resolve(callback(change.doc.data()));
            else return Promise.resolve(callback(change.doc));
          }
        })
      );
    });
}

async function getCollection(collection, getData = true) {
  return await db
    .collection(collection)
    .get()
    .then(snapshot => {
      if (!snapshot.docs.length) return false;
      return Promise.all(
        snapshot.docs.map(doc => {
          if (getData) return Promise.resolve(doc.data());
          else return Promise.resolve(doc);
        })
      );
    });
}

const leylo = {
  db: db,
  docExists: docExists,
  getDocById: getDocById,
  getDocByField: getDocByField,
  getDocRefByField: getDocRefByField,
  getDocIdByField: getDocIdByField,
  getAllDocsByField: getAllDocsByField,
  streamDocChanges: streamDocChanges,
  queryDocByField: queryDocByField,
  queryAllDocsByField: queryAllDocsByField,
  collectionExists: collectionExists,
  getCollection: getCollection
};
export default leylo;
