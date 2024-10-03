/**
 * Cria a tabela de tarefas
 * @param {IDBDatabase} db 
 */
export default function(db){
  return new Promise((resolve, reject) => {
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
  })
}
