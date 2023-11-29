import api from '@/apis/bookmark';

class Controller {
  constructor() {
    this.items = [];
  }

  async add({ name, url, img }) {
    await api.add({ name, url, img });
  }

  async get() {
    const res = await api.get();

    this.items = res.result.data ?? [];
  }

  async del(id) {
    await api.del(id);
  }

  update() { }
}

export default Controller;
