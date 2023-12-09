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
  // 可能会找不到当前日期的date数据 需要创建
  return recordTable
    .where({
      username,
      ...query,
    })
    .update(payload);
};

export const get = (date, names) => {
  const username = accountStorage.get();
  return recordTable
    .where({
      username,
      date,
      name: uniCloud.database().command.in(names),
    })
    .get();
};

export const newGet = (query) =>
  recordTable
    .where({
      username: accountStorage.get(),
      ...query,
    })
    .get();
