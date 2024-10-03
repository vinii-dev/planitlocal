import { createTaskTable } from "./migrations/index.js";

export const setup = function() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PlanItLocal');
    let db;

    request.onerror = (event) => reject(event.target.errorCode);
    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      // rodando migrações de ./migrations
      createTaskTable(db)
        .then()
        .catch(error => reject(error));

      resolve(db);
    }
  });
}
