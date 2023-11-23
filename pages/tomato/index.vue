<template>
  <div>
    <Header title="Tomato" />
    <div class="content">
      <div v-if="isCountDown">
        <div class="row">
          <div>倒计时中</div>
        </div>
        <div class="row">
          <div class="btn-box">
            <button @click="handleCancel">取消</button>
          </div>
        </div>
      </div>
      <div v-if="!isCountDown">
        <div class="row">
          <div class="form">
            <div class="form-item">
              <div>任务名：</div>
              <div class="form-options">
                <div
                  @click="handleSetValueByKey('name', '前端')"
                  :class="['form-option', { active: name === '前端' }]"
                >
                  前端
                </div>
                <div
                  @click="handleSetValueByKey('name', '英语')"
                  :class="['form-option', { active: name === '英语' }]"
                >
                  英语
                </div>
              </div>
            </div>
            <div class="form-item">
              <div>继续时间：</div>
              <div class="form-options">
                <div
                  @click="handleSetValueByKey('time', 10)"
                  :class="['form-option', { active: time === 10 }]"
                >
                  10
                </div>
                <div
                  @click="handleSetValueByKey('time', 15)"
                  :class="['form-option', { active: time === 15 }]"
                >
                  15
                </div>
                <div
                  @click="handleSetValueByKey('time', 25)"
                  :class="['form-option', { active: time === 25 }]"
                >
                  25
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="btn-box">
            <button @click="handleStart">启动</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  data() {
    return {
      name: '前端',
      time: 10,
      isCountDown: false,
    };
  },
  onLoad() {},
  methods: {
    handleSetValueByKey(key, value) {
      this[key] = value;
    },
    handleStart() {
      const { name, time } = this;

      this.isCountDown = true;
    },
    handleCancel() {
      this.isCountDown = false;
    },
  },
  components: {
    Header,
  },
};
</script>

<style>
.content {
  padding: 50px;
}
.row {
  display: flex;
  justify-content: center;
}

.form {
  padding: 20px;
}

.form-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  width: 300px;
}

.form-options {
  display: flex;
  align-items: center;
}

.form-option {
  cursor: pointer;
  background: #eee;
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 3px;
}

.active {
  color: #fff;
  background: green;
}

.btn-box {
  width: 300px;
}
</style>
