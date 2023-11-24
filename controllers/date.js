import api from '@/apis/focus';
import { accountStorage } from '@/util';

const username = accountStorage.get();
const dateTable = uniCloud.database().collection('date');

class Controller {

  // 这里有问题，需要把update拆出来
  add({ date, name, time, target }) {
    dateTable
      .where({
        date,
        name,
        username,
      })
      .get()
      .then((res) => {
        const data = res?.result?.data ?? [];
        const len = data.length;

        if (len === 0) {
          api.add({ date, name, time, target });
          return;
        }

        if (len === 1) {
          api.update(date, name, username, { value: data[0].value + time });
          return;
        }
      });
  }

  update() {}
}

export default Controller;
