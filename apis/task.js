import { accountStorage } from '@/util';

const username = accountStorage.get();
const taskTable = uniCloud.database().collection('task');

const add = ({ date, name, time, target }) => {
  const data = {
    value: time,
    date,
    name,
    target,
    username,
  };

  taskTable.add(data);
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

export default {
  add,
  update,
};
