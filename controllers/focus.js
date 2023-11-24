import api from '@/apis/focus';
import { accountStorage } from '@/util';

const username = accountStorage.get();
const dateTable = uniCloud.database().collection('date');

class Controller {
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
}

export default Controller;
