import { accountStorage } from '@/util';
import db from './db'

const memeTable = db.collection('meme');

export const list = () => {
  const username = accountStorage.get();

  return memeTable
    .where({
      username,
    })
    .get();
};

export const del = (query) => {
  return memeTable
    .where(query)
    .remove();
};

export const add = (query) => {
  return memeTable.add(query);
};

