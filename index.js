import db from "./init.js";
import firebase from "firebase/app";
import firestore from "firebase/firestore";

let leylo;
export default (leylo = {
  // GLOBAL
  db: db,

  // RETRIEVING DATA
  docExists: async function(collection, id) {
    return await db
      .collection(collection)
      .where(db.app.firebase_.firestore.FieldPath.documentId(), "==", id)
      .get()
      .then(snapshot => {
        return snapshot.docs.length > 0;
      });
  },
  collectionExists: async function(collection) {
    return await db
      .collection(collection)
      .get()
      .then(snapshot => {
        return snapshot.docs.length > 0;
      });
  },
  getDocById: async function(collection, id, getData = true) {
    return await db
      .collection(collection)
      .where(db.app.firebase_.firestore.FieldPath.documentId(), "==", id)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return getData ? snapshot.docs[0].data() : snapshot.docs[0];
      });
  },
  getDocRefByField: async function(collection, field, value) {
    return await db
      .collection(collection)
      .where(field, "==", value)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return snapshot.docs[0].ref.path;
      });
  },
  getDocIdByField: async function(collection, field, value) {
    return await db
      .collection(collection)
      .where(field, "==", value)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return snapshot.docs[0].id;
      });
  },
  getAllDocsByField: async function(collection, field, value, getData = true) {
    return await db
      .collection(collection)
      .where(field, "==", value)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return Promise.all(
          snapshot.docs.map(doc => {
            return getData ? Promise.resolve(doc.data()) : Promise.resolve(doc);
          })
        );
      });
  },
  getDocByField: async function(collection, field, value, getData = true) {
    return await db
      .collection(collection)
      .where(field, "==", value)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return getData ? snapshot.docs[0].data() : snapshot.docs[0];
      });
  },
  getDocByQuery: async function(
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
        return getData ? snapshot.docs[0].data() : snapshot.docs[0];
      });
  },
  getAllDocsByQuery: async function(
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
            return getData ? Promise.resolve(doc.data()) : Promise.resolve(doc);
          })
        );
      });
  },
  streamDocChangesById: async function(
    collection,
    id,
    callback = null,
    changeType = null,
    getData = true
  ) {
    return await db
      .collection(collection)
      .where(db.app.firebase_.firestore.FieldPath.documentId(), "==", id)
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot.empty)
            return Promise.reject(
              new Error(
                `No document with id of ${id} was found in ${collection}`
              )
            );
          return Promise.all(
            querySnapshot.docChanges().map(change => {
              changeType = changeType ? changeType.toLowerCase() : null;
              if (!changeType || change.type == changeType) {
                if (!callback)
                  return getData
                    ? Promise.resolve(change.doc.data())
                    : Promise.resolve(change.doc);
                else
                  return getData
                    ? Promise.resolve(callback(change.doc.data()))
                    : Promise.resolve(callback(change.doc));
              } else {
                if (!/^modified|added|removed$/.test(changeType))
                  return Promise.reject(
                    new Error(
                      `'${changeType}' is not a supported change type. Must be one of 'modified', 'added', or 'removed'.`
                    )
                  );
              }
            })
          );
        },
        error => {
          return new Error(error);
        }
      );
  },
  streamDocChangesByField: async function(
    collection,
    field,
    value,
    callback = null,
    changeType = null,
    getData = true
  ) {
    return await db
      .collection(collection)
      .where(field, "==", value)
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot.empty)
            return Promise.reject(
              new Error(
                `No document with ${field} == ${value} was found in ${collection}`
              )
            );
          return Promise.all(
            querySnapshot.docChanges().map(change => {
              changeType = changeType ? changeType.toLowerCase() : null;
              if (!changeType || change.type == changeType) {
                if (!callback)
                  return getData
                    ? Promise.resolve(change.doc.data())
                    : Promise.resolve(change.doc);
                else
                  return getData
                    ? Promise.resolve(callback(change.doc.data()))
                    : Promise.resolve(callback(change.doc));
              } else {
                if (!/^modified|added|removed$/.test(changeType))
                  return Promise.reject(
                    new Error(
                      `'${changeType}' is not a supported change type. Must be one of 'modified', 'added', or 'removed'.`
                    )
                  );
              }
            })
          );
        },
        error => {
          return new Error(error);
        }
      );
  },
  streamDocChangesByQuery: async function(
    collection,
    field,
    query,
    value,
    callback = null,
    changeType = null,
    getData = true
  ) {
    return await db
      .collection(collection)
      .where(field, "==", value)
      .onSnapshot(
        querySnapshot => {
          if (querySnapshot.empty)
            return Promise.reject(
              new Error(
                `No document with ${field} ${query} ${value} was found in ${collection}`
              )
            );
          return Promise.all(
            querySnapshot.docChanges().map(change => {
              changeType = changeType ? changeType.toLowerCase() : null;
              if (!changeType || change.type == changeType) {
                if (!callback)
                  return getData
                    ? Promise.resolve(change.doc.data())
                    : Promise.resolve(change.doc);
                else
                  return getData
                    ? Promise.resolve(callback(change.doc.data()))
                    : Promise.resolve(callback(change.doc));
              } else {
                if (!/^modified|added|removed$/.test(changeType))
                  return Promise.reject(
                    new Error(
                      `'${changeType}' is not a supported change type. Must be one of 'modified', 'added', or 'removed'.`
                    )
                  );
              }
            })
          );
        },
        error => {
          return new Error(error);
        }
      );
  },
  getCollection: async function(collection, getData = true) {
    return await db
      .collection(collection)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return Promise.all(
          snapshot.docs.map(doc => {
            return getData ? Promise.resolve(doc.data()) : Promise.resolve(doc);
          })
        );
      });
  },
  streamCollection: async function(
    collection,
    callback = null,
    changeType = null,
    getData = true
  ) {
    return await db.collection(collection).onSnapshot(
      querySnapshot => {
        if (querySnapshot.empty)
          return Promise.reject(new Error(`${collection} does not exist`));
        return Promise.all(
          querySnapshot.docChanges().map(change => {
            changeType = changeType ? changeType.toLowerCase() : null;
            if (!changeType || change.type == changeType) {
              if (!callback)
                return getData
                  ? Promise.resolve(change.doc.data())
                  : Promise.resolve(change.doc);
              else
                return getData
                  ? Promise.resolve(callback(change.doc.data()))
                  : Promise.resolve(callback(change.doc));
            } else {
              if (!/^modified|added|removed$/.test(changeType))
                return Promise.reject(
                  new Error(
                    `'${changeType}' is not a supported change type. Must be one of 'modified', 'added', or 'removed'.`
                  )
                );
            }
          })
        );
      },
      error => {
        return new Error(error);
      }
    );
  },

  // DELETING
  deleteCollection: async function(collection) {
    return await db
      .collection(collection)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return Promise.all(
          snapshot.docs.map(doc => {
            return doc.ref.delete()
              ? Promise.resolve(true)
              : Promise.reject(false);
          })
        );
      });
  },
  deleteDocById: async function(collection, id) {
    return await db
      .collection(collection)
      .where(db.app.firebase_.firestore.FieldPath.documentId(), "==", id)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return Promise.all(
          snapshot.docs.map(doc => {
            return doc.ref.delete()
              ? Promise.resolve(true)
              : Promise.reject(false);
          })
        );
      });
  },
  deleteAllDocsByField: async function(collection, field, value) {
    return await db
      .collection(collection)
      .where(field, "==", value)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return Promise.all(
          snapshot.docs.map(doc => {
            return doc.ref.delete()
              ? Promise.resolve(true)
              : Promise.reject(false);
          })
        );
      });
  },
  deleteAllDocsByQuery: async function(collection, query, field, value) {
    return await db
      .collection(collection)
      .where(field, query, value)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return Promise.all(
          snapshot.docs.map(doc => {
            return doc.ref.delete()
              ? Promise.resolve(true)
              : Promise.reject(false);
          })
        );
      });
  },
  deleteFieldByDocId: async function(collection, id, field) {
    return await db
      .collection(collection)
      .doc(id)
      .update({
        [field]: db.app.firebase_.firestore.FieldValue.delete()
      })
      .then(() => {
        return true;
      })
      .catch(err => {
        return err;
      });
  },
  deleteAllFieldsContainingValue: async function(collection, field, value) {
    return await db
      .collection(collection)
      .where(field, "==", value)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return Promise.all(
          snapshot.docs.map(doc => {
            doc.ref
              .update({
                [field]: db.app.firebase_.firestore.FieldValue.delete()
              })
              .then(() => {
                return Promise.resolve(true);
              })
              .catch(err => {
                return Promise.reject(err);
              });
          })
        );
      });
  },
  deleteAllFieldsByQuery: async function(collection, field, query, value) {
    return await db
      .collection(collection)
      .where(field, query, value)
      .get()
      .then(snapshot => {
        if (!snapshot.docs.length) return false;
        return Promise.all(
          snapshot.docs.map(doc => {
            doc.ref
              .update({
                [field]: db.app.firebase_.firestore.FieldValue.delete()
              })
              .then(() => {
                return Promise.resolve(true);
              })
              .catch(err => {
                return Promise.reject(err);
              });
          })
        );
      });
  },

  // ADDING
  setDocByPath: async function(path, data, overwrite = false) {
    return overwrite
      ? await db
          .doc(path)
          .set(data)
          .then(() => {
            return Promise.resolve(true);
          })
          .catch(err => {
            return Promise.reject(err);
          })
      : await db
          .doc(path)
          .set(data, { merge: true })
          .then(() => {
            return Promise.resolve(true);
          })
          .catch(err => {
            return Promise.reject(err);
          });
  },
  setAllDocsByPath: async function(overwrite, ...docs) {
    return Promise.all(
      docs.map(doc => {
        return this.setDocByPath(doc[0], doc[1], overwrite);
      })
    );
  },
  setDocById: async function(collection, id, data, overwrite = false) {
    return overwrite
      ? await db
          .collection(collection)
          .doc(id)
          .set(data)
          .then(() => {
            return Promise.resolve(true);
          })
          .catch(err => {
            return Promise.reject(err);
          })
      : await db
          .collection(collection)
          .doc(id)
          .set(data, { merge: true })
          .then(() => {
            return Promise.resolve(true);
          })
          .catch(err => {
            return Promise.reject(err);
          });
  },
  setAllDocsById: async function(collection, overwrite, ...docs) {
    return Promise.all(
      docs.map(doc => {
        return this.setDoc(collection, doc[0], doc[1], overwrite);
      })
    );
  },
  setFieldByPath: async function(path, value) {
    path = path.split("/");
    if (path.length !== 3)
      return new Error(`${path} must be three tiers: col/doc/field`);
    let newfield = path[2];
    return await db
      .collection(path[0])
      .doc(path[1])
      .set(
        {
          [newfield]: value
        },
        { merge: true }
      )
      .then(() => {
        return Promise.resolve(true);
      })
      .catch(err => {
        return Promise.reject(err);
      });
  },
  setFieldById: async function(collection, id, field, newvalue) {
    return await db
      .collection(collection)
      .doc(id)
      .set(
        {
          [field]: newvalue
        },
        { merge: true }
      )
      .then(() => {
        return Promise.resolve(true);
      })
      .catch(err => {
        return Promise.reject(err);
      });
  },
  addDoc: async function(collection, data) {
    return await db
      .collection(collection)
      .add(data)
      .then(ref => {
        return Promise.resolve(ref);
      })
      .catch(err => {
        return Promise.reject(err);
      });
  },
  addAllDocs: async function(collection, ...docs) {
    return Promise.all(
      docs.map(entry => {
        return this.addDoc(collection, entry);
      })
    );
  }
});
