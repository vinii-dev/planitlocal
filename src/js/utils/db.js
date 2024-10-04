const wait = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

const db = (function() {
  /**
   * Cria a tabela de tarefas
   * @param {IDBDatabase} db 
   */
  const createTaskTable = (db) =>
    new Promise((resolve, reject) => {
      const store = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });

      store.createIndex('title', 'title', { unique: false });
      store.createIndex('description', 'description', { unique: false });
      store.createIndex('dueDate', 'dueDate', { unique: false });

      store.transaction.oncomplete = () => {
        resolve();
      }

      store.transaction.onerror = () => {
        reject('Failed to create task table');
      }
    });

  const setup = function() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('PlanItLocal');
      let db;

      request.onerror = (event) => reject(event.target.errorCode);
      request.onsuccess = (event) => resolve(event.target.result);

      request.onupgradeneeded = (event) => {
        db = event.target.result;

        createTaskTable(db)
          .then(() => resolve(db))
          .catch(error => reject(error));
      }
    });
  }

  /**
   * @type {IDBDatabase}
   */
  let _db;

  setup()
    .then(async (database) => {
      _db = database;
      console.log('Database setup complete');
    })
    .catch(error => console.error('Error setting up database:', error));

  const add = (name, obj) => {
    return new Promise(async (resolve, reject) => {
      while(!_db) {
        await wait(500);
      }

      const request = _db.transaction([name], 'readwrite').objectStore(name).add(obj);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Failed to add task');
    });
  }

  const remove = (name, id) => {
    return new Promise(async (resolve, reject) => {
      while(!_db) {
        await wait(500);
      }

      const request = _db.transaction([name], 'readwrite').objectStore(name).delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to remove task');
    });
  }

  const update = (name, id, obj) => {
    return new Promise(async (resolve, reject) => {
      while(!_db) {
        await wait(500);
      }

      const request = _db.transaction([name], 'readwrite').objectStore(name).put(obj, id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject('Failed to update task');
    });
  }

  const getAll = (name) => {
    return new Promise(async (resolve, reject) => {
      while(!_db) {
        await wait(500);
      }
      
      const request = _db.transaction([name], 'readonly').objectStore(name).getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Failed to get tasks');
    });
  }

  const get = (name, id) => {
    return new Promise(async (resolve, reject) => {
      while(!_db) {
        await wait(500);
      }
      
      const request = _db.transaction([name], 'readonly').objectStore(name).get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject('Failed to get tasks');
    });
  }

  return {
    add: (name, obj) => add(name, obj),
    remove: (name, id) => remove(name, id),
    update: (name, id, obj) => update(name, id, obj),
    getAll: (name) => getAll(name),
    get: (name, id) => get(name, id),
  };
})();

const namedDb = function(name) {
  const { add, remove, update, getAll, get } = db;

  return {
    add: (obj) => add(name, obj),
    remove: ( id) => remove(name, id),
    update: (id, obj) => update(name, id, obj),
    getAll: () => getAll(name),
    get: (id) => get(name, id),
  }
};
