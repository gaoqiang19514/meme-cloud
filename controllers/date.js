import * as api from '@/apis/date';
import { accountStorage } from '@/util';

const dateTable = uniCloud.database().collection('date');

class Controller {
  // TODO: 这里有问题，需要把update拆出来
  add({ date, name, time, target }) {
    const username = accountStorage.get();

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
          api.update({ date, name }, { value: data[0].value + time });
          return;
        }
      });
  }

  async newAdd({ date, name, time, target }) {
    api.add({ date, name, time, target });
  }

  async update(query, payload) {
    await api.update(query, payload);
  }

  async get(date, names = []) {
    const res = await api.get(date, names);
    return res.result.data ?? [];
  }

  async newGet(query) {
    const res = await api.newGet(query);
    return res.result.data ?? [];
  }
}

export default Controller;
