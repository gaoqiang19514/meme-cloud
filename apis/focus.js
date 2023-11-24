import { accountStorage } from '@/util';

const username = accountStorage.get();
const dateTable = uniCloud.database().collection('date');

const add = ({ date, name, time, target }) => {
  const data = {
    value: time,
    date,
    name,
    target,
    username,
  };

  dateTable.add(data);
};

const update = (date, name, username, payload) => {
  dateTable
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
