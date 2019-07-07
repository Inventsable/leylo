import db from "./init.js";

let leylo;
export default (leylo = {
  // GLOBAL
  db: db,

  // RETRIEVING DATA
  getPath: async function(path, getData = true) {
    if (/\//.test(path)) {
      path = path.split("/");
      if (path.length > 1 && path.length < 3) {
        return await this.getDocById(path[0], path[1], getData);
      } else if (path.length == 3) {
        let field = path[2];
        let doc = await this.getDocById(path[0], path[1], getData);
        return getData ? doc[field] : doc.data()[field];
      } else {
        return new Error(`Paths with ${path.length} depths not supported`);
      }
    } else {
      return await this.getCollection(path);
    }
  },
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
  getDocPathByField: async function(collection, field, value) {
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
            return Promise.resolve(getData ? doc.data() : doc);
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
            return Promise.resolve(getData ? doc.data() : doc);
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
                  return Promise.resolve(
                    getData ? change.doc.data() : change.doc
                  );
                else
                  return Promise.resolve(
                    callback(getData ? change.doc.data() : change.doc)
                  );
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
                  return Promise.resolve(
                    getData ? change.doc.data() : change.doc
                  );
                else
                  return Promise.resolve(
                    callback(getData ? change.doc.data() : change.doc)
                  );
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
                  return Promise.resolve(
                    getData ? change.doc.data() : change.doc
                  );
                else
                  return Promise.resolve(
                    callback(getData ? change.doc.data() : change.doc)
                  );
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
            return Promise.resolve(getData ? doc.data() : doc);
          })
        );
      });
  },
  streamPath: async function(path, callback, changeType, getData = true) {
    let collection, doc, stream, catcher;
    if (/\//.test(path)) {
      path = path.split("/");
      collection = path[0];
      doc = path[1];
    }
    if (!doc) {
      stream = await db.collection(path).onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          db.collection(collection)
            .get()
            .then(snapshot => {
              if (!snapshot.docs.length) {
                return stream();
              }
            });
        } else {
          catcher = Promise.all(
            querySnapshot.docChanges().map(change => {
              changeType = changeType ? changeType.toLowerCase() : null;
              if (!changeType || change.type == changeType) {
                if (!callback)
                  return Promise.resolve(
                    getData ? change.doc.data() : change.doc
                  );
                else
                  return Promise.resolve(
                    callback(getData ? change.doc.data() : change.doc)
                  );
              } else {
                if (!/^modified|added|removed$/.test(changeType))
                  return Promise.reject(
                    new Error(
                      `'${changeType}' is not a supported change type. Must be one of 'modified', 'added', or 'removed'.`
                    )
                  );
              }
            })
          ).then(results => {
            Promise.resolve([results, stream]);
          });
        }
      });
    } else {
      stream = await db.collection(collection).onSnapshot(querySnapshot => {
        if (querySnapshot.empty) {
          db.collection(collection)
            .doc(doc)
            .get()
            .then(snapshot => {
              if (!snapshot.docs.length) {
                return stream();
              }
            });
        } else {
          catcher = Promise.all(
            querySnapshot.docChanges().map(change => {
              changeType = changeType ? changeType.toLowerCase() : null;
              if (!changeType || change.type == changeType) {
                if (!callback)
                  return Promise.resolve(
                    getData ? change.doc.data() : change.doc
                  );
                else
                  return Promise.resolve(
                    callback(getData ? change.doc.data() : change.doc)
                  );
              } else {
                if (!/^modified|added|removed$/.test(changeType))
                  return Promise.reject(
                    new Error(
                      `'${changeType}' is not a supported change type. Must be one of 'modified', 'added', or 'removed'.`
                    )
                  );
              }
            })
          ).then(results => {
            Promise.resolve([results, stream]);
          });
        }
      });
    }
    return stream;
  },
  streamCollection: async function(
    collection,
    callback = null,
    changeType = null,
    getData = true
  ) {
    let stream = await db.collection(collection).onSnapshot(
      querySnapshot => {
        if (querySnapshot.empty) {
          db.collection(collection)
            .get()
            .then(snapshot => {
              if (!snapshot.docs.length) {
                return stream();
              }
            });
        }
        return Promise.all(
          querySnapshot.docChanges().map(change => {
            changeType = changeType ? changeType.toLowerCase() : null;
            if (!changeType || change.type == changeType) {
              if (!callback)
                return Promise.resolve(
                  getData ? change.doc.data() : change.doc
                );
              else
                return Promise.resolve(
                  callback(getData ? change.doc.data() : change.doc)
                );
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
    return stream;
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
  deleteAllDocsByQuery: async function(collection, field, query, value) {
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
  setPath: async function(path, data, overwrite = false) {
    if (Array.isArray(data))
      return Promise.resolve(
        new Error(
          `Data parameter should not be an array. Use an iterable method like leylo.setAllDocsByPath() instead.`
        )
      );
    if (/\//.test(path)) {
      path = path.split("/");
      if (path.length < 3) {
        return await this.setDocById(path[0], path[1], data, overwrite);
      } else if (path.length == 3) {
        return await this.setFieldByPath(path.join("/"), data, overwrite);
      } else {
        return Promise.resolve(
          new Error(
            `${path} should only be 2 - 3 tiers, as in col/doc or col/doc/field.`
          )
        );
      }
    } else {
      return await this.addDoc(path, data, overwrite);
    }
  },
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
    if (!/\//.test(path))
      return new Error(
        `${path} must be in the form: collection/document/field`
      );
    path = path.split("/");
    if (path.length !== 3)
      return new Error(
        `${path} must be three tiers: collection/document/field`
      );
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
