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

  async update(query, payload) {
    // 需要先查找，当前任务是否存在date数据，否则会修改失败
    const res = await api.get(query.date, [query.name]);
    const len = res.result.data.length;

    if (len === 0) {
      // 需要用当前任务创建一条date数据，然后再进行更新
    }

    if (len === 1) {
      // 如果不存在当前数据，需要创建一条date用于修改
      await api.update(query, payload);
    }

    if (len > 1) {
      // 需要抛出异常
      throw new Error('查询到超过一条数据，无法定位到需要更新的数据');
    }
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
