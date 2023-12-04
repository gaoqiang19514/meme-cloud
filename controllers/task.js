import api from '@/apis/task';

class Controller {
  async add({ name, target }) {
    uni.showLoading();
    await api.add({ name, target });
    window.location.reload()
  }

  update() {}

  get() {
    return api.get();
  }
}

export default Controller;
