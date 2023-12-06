import { accountStorage } from '@/util';

const taskTable = uniCloud.database().collection('task');

const add = async (payload) => {
  const username = accountStorage.get();
  await taskTable.add({
    username,
    ...payload,
  });
};

// TODO: 这里的username需要去掉
const update = (date, name, username, payload) => {
  taskTable
    .where({
      date,
      name,
      username: accountStorage.get(),
    })
    .update(payload);
};

const get = () => {
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
