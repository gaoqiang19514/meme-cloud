import { accountStorage } from '@/util';

const username = accountStorage.get();
const bookmarkTable = uniCloud.database().collection('bookmark');

const get = () => {
  return bookmarkTable.where({
    username,
  }).get();
};


const del = (id) => {
  bookmarkTable.where({
    _id: id,
  }).remove();
};

const add = ({ name, url, img }) => {
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
