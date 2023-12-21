import { accountStorage } from '@/util';
import db from './db';

const recordTable = db.collection('record');

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

export const totalValue = () => {
  const username = accountStorage.get();

  return uni.request({
    method: 'GET',
    url: `https://fc-mp-5fa4a496-0aa2-45a9-b89c-4054536ad7e7.next.bspapp.com/record/totalValue?username=${username}`,
  });
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
