import api from '@/apis/task';

class Controller {
  async add({ name, target }) {
    uni.showLoading();
    await api.add({ name, target });
    uni.hideLoading();
  }

  update() {}

  get() {
    return api.get();
  }
}

export default Controller;
