import api from '@/apis/task';
import { manipulateDate, getToday } from '@/util.js';

class Controller {
  constructor() {
    this.currentDateStr = manipulateDate(new Date());
  }

  async add({ name, target }) {
    uni.showLoading();
    await api.add({ name, target });
    uni.hideLoading();
  }

  update() { }

  async get() {
    const res = await api.get();
    return res.result.data ?? [];
  }

  setDate(date) {
    // 组织跳转到未来的日子
    const today = manipulateDate(new Date())
    const dayTimestamp = new Date(manipulateDate(date)).getTime()
    const todayTimestamp = new Date(today).getTime();

    if (dayTimestamp > todayTimestamp) {
      // 不允许切换到未来
      return;
    }


    this.currentDateStr = date;
  }
}

export default Controller;
