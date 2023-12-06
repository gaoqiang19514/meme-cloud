import { accountStorage } from '@/util';

const dateTable = uniCloud.database().collection('date');

export const add = ({ date, name, time, target }) => {
  const username = accountStorage.get();
  const data = {
    value: time,
    date,
    name,
    target,
    username,
  };

  dateTable.add(data);
};

export const update = (query, payload) => {
  const username = accountStorage.get();
  // 可能会找不到当前日期的date数据 需要创建
  return dateTable
    .where({
      username,
      ...query,
    })
    .update(payload);
};

export const get = (date, names) => {
  const username = accountStorage.get();
  return dateTable
    .where({
      username,
      date,
      name: uniCloud.database().command.in(names),
    })
    .get();
};

export const newGet = (query) =>
  dateTable
    .where({
      username: accountStorage.get(),
      ...query,
    })
    .get();
