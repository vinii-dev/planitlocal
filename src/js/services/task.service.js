import { namedDb } from "../utils/db";

const TASK_OBJ_NAME = 'tasks';
const db = namedDb(TASK_OBJ_NAME);

// const add = (task) => db.add(task);
// const edit = (id, task) => db.add(id, task);
// const remove = (id) => db.add(TASK_OBJ_NAME);
// const getAll = () => db.getAll(TASK_OBJ_NAME);
// const get = (id) => db.get(TASK_OBJ_NAME, id);

export default db;
