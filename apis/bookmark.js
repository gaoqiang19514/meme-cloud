import { accountStorage } from '@/util';

const bookmarkTable = uniCloud.database().collection('bookmark');

const get = () => {
  const username = accountStorage.get();

  return bookmarkTable
    .where({
      username,
    })
    .get();
};

const del = (id) => {
  bookmarkTable
    .where({
      _id: id,
    })
    .remove();
};

const add = ({ name, url, img }) => {
  const username = accountStorage.get();

  const data = {
    name,
    url,
    img,
    username,
  };

  bookmarkTable.add(data);
};

export default {
  add,
  del,
  get,
};
