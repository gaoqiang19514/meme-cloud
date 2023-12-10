import { accountStorage } from '@/util';

const taskTable = uniCloud.database().collection('task');

export const add = (payload) => {
  const username = accountStorage.get();
  taskTable.add({
    username,
    ...payload,
  });
};

// TODO: 这里的username需要去掉
export const update = (date, name, username, payload) => {
  taskTable
    .where({
      date,
      name,
      username: accountStorage.get(),
    })
    .update(payload);
};

export const get = () => {
  const username = accountStorage.get();
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
