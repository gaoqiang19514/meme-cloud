import { accountStorage } from '@/util';
import db from './db';

const bookmarkTable = db.collection('bookmark');

export const list = () => {
  const username = accountStorage.get();

  return bookmarkTable
    .where({
      username,
    })
    .get();
};

export const del = (query) => {
  return bookmarkTable.where(query).remove();
};

export const add = (query) => {
  const username = accountStorage.get();

  const data = {
    ...query,
    username,
  };

  bookmarkTable.add(data);
};
