import api from '@/apis/task';
import { accountStorage } from '@/util';

const username = accountStorage.get();
const taskTable = uniCloud.database().collection('task');

class Controller {

  // 这里有问题，需要把update拆出来
  add({ date, name, time, target }) {
    api.add({ date, name, time, target });
  }

  update() {}
}

export default Controller;
