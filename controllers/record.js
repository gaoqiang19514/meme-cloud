import * as recordApi from '@/apis/record';
import { accountStorage } from '@/util';

const recordTable = uniCloud.database().collection('record');

class Controller {
  // TODO: 这里有问题，需要把update拆出来
  add({ date, name, time, target }) {
    const username = accountStorage.get();

    recordTable
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
          recordApi.add({ date, name, time, target });
          return;
        }

        if (len === 1) {
          recordApi.update({ date, name }, { value: data[0].value + time });
          return;
        }
      });
  }

  async newAdd({ date, name, time, target }) {
    recordApi.add({ date, name, time, target });
  }

  async update(query, payload) {
    await recordApi.update(query, payload);
  }

  async get(date, names = []) {
    const res = await recordApi.get(date, names);
    return res.result.data ?? [];
  }

  async newGet(query) {
    const res = await recordApi.newGet(query);
    return res.result.data ?? [];
  }
}

export default Controller;
