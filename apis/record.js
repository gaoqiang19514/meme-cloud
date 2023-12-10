import { accountStorage } from '@/util';

const recordTable = uniCloud.database().collection('record');

export const add = ({ date, name, time, target }) => {
  const username = accountStorage.get();

  const data = {
    value: time,
    date,
    name,
    target,
    username,
  };

  recordTable.add(data);
};

export const update = (query, payload) => {
  const username = accountStorage.get();

  return recordTable
    .where({
      username,
      ...query,
    })
    .update(payload);
};

export const get = (query) => {
  const username = accountStorage.get();

  return recordTable
    .where({
      username,
      ...query,
    })
    .get();
};
