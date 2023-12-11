'use strict';

const add = () => {
  return 'add';
};

const update = () => {
  return 'update';
};

const get = () => {
  return 'get';
};

const actions = {
  add,
  update,
  get,
};

exports.main = async (event) => {
  // event为客户端上传的参数
  console.log('event : ', event);

  return actions[event.action](event);
};
