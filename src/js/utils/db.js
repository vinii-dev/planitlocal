import { setup } from "../db/setup.js";

/**
 * @type {IDBDatabase}
 */
let _db;

setup()
  .then(async (database) => {
    _db = database;
  });

const add = (name, obj) => {
  return new Promise((resolve, reject) => {
    const request = _db.transaction([name], 'readwrite').objectStore(name).add(obj);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Failed to add task');
  });
}

const remove = (name, id) => {
  return new Promise((resolve, reject) => {
    const request = _db.transaction([name],'readwrite').objectStore(name).delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject('Failed to remove task');
  });
}

const update = (name, id, obj) => {
  return new Promise((resolve, reject) => {
    const request = _db.transaction([name],'readwrite').objectStore(name).put(obj, id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject('Failed to update task');
  });
}

const getAll = (name) => {
  return new Promise((resolve, reject) => {
    const request = _db.transaction([name],'readonly').objectStore(name).getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Failed to get tasks');
  });
}

const get = (name, id) => {
  return new Promise((resolve, reject) => {
    const request = _db.transaction([name],'readonly').objectStore(name).get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject('Failed to get tasks');
  });
}

export const db = {
  add,
  update,
  remove,
  getAll,
  get,
}

export const namedDb = (name) => ({
  add: (obj) => add(name, obj),
  update: (id, obj) => update(name, id, obj),
  remove: (id) => remove(name, id),
  getAll: () => getAll(name),
  get: (id) => get(name, id),
})

window.db = db;
