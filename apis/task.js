import { accountStorage } from '@/util';

const username = accountStorage.get();
const taskTable = uniCloud.database().collection('task');

const add = async (payload) => {
  await taskTable.add({
    username,
    ...payload,
  });
};

const update = (date, name, username, payload) => {
  taskTable
    .where({
      date,
      name,
      username,
    })
    .update(payload);
};

const get = () => {
  return taskTable
    .where({
      username,
    })
    .get();
};

export default {
  add,
  update,
  get,
};
