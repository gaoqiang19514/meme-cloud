import { accountStorage } from '@/util';

const memeTable = uniCloud.database().collection('meme');

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

