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

const update = (query, payload) => {
  // 可能会找不到当前日期的date数据 需要创建
  return dateTable.where({
    username,
    ...query
  }).update(payload);
};

const get = (date, names) => {
  return dateTable
    .where({
      username,
      date,
      name: uniCloud.database().command.in(names),
    })
    .get();
};

export default {
  get,
  add,
  update,
};
