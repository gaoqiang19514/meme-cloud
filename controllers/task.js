import api from '@/apis/task';

class Controller {
  async add({ name, target }) {
    uni.showLoading();
    await api.add({ name, target });
    uni.hideLoading();
  }

  update() {}

  async get() {
    const res = await api.get();
    return res.result.data ?? [];
  }
}

export default Controller;
