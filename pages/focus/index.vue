<template>
  <div class="page">
    <div class="date-btns">
      <div class="date-btn" @click="onPrev">上一天</div>
      <div class="date">
        {{currentDateStr}}
      </div>
      <div :class="['date-btn', {'disabled': disabledNextBtn}]" @click="onNext">下一天</div>
    </div>
    <ul class="items">
      <li class="item" v-for="item in items" :key="item._id" @click="onClick(item._id)">
        <div class="progress" :style="{ width: `${(item.value / item.target) * 100}%` }" />
        <span>{{ item.name}}</span>
        <span class="cell">
          <span>{{ item.value }}分钟</span><span>{{ (item.value / item.target) * 100 | percent }}%</span>
        </span>
      </li>
    </ul>
    <uni-popup ref="popup">
      <ul class="options">
        <li class="option" v-for="item in options" :key="item" @click="onPlus(item)">{{ item }}</li>
      </ul>
    </uni-popup>
  </div>
</template>

<script>
  import {
    accountStorage,
    getCurrentFormattedDate,
    manipulateDate,
  } from '@/util.js'

  export default {
    data() {
      return {
        currentId: '',
        db: uniCloud.database().collection("focus"),
        currentDateStr: manipulateDate(new Date()),
        items: [],
        options: [25, 10],
      }
    },
    filters: {
      percent(value) {
        return value.toFixed(2);
      }
    },
    computed: {
      disabledNextBtn() {
        return manipulateDate(new Date()) === this.currentDateStr;
      }
    },
    onLoad() {
      const {
        currentDateStr,
      } = this;
      this.loadData(currentDateStr)
    },

    methods: {
      onPrev() {
        const {
          currentDateStr,
        } = this;

        const previousDay = manipulateDate(currentDateStr, -1);
        this.currentDateStr = previousDay
        this.loadData(previousDay)
      },
      onNext() {
        const {
          currentDateStr,
        } = this;

        const nextDay = manipulateDate(currentDateStr, 1);
        this.currentDateStr = nextDay
        this.loadData(nextDay)
      },
      onPlus(value) {
        const {
          currentId
        } = this;

        this.items = this.items.map(item => ({
          ...item,
          value: item._id === currentId ? item.value + value : item.value
        }))

        this.update();
      },
      async update() {
        const {
          db,
          items,
          currentId
        } = this;

        const target = items.find(item => item._id === currentId)
        const res = await db.where({
          _id: currentId,
        }).update({
          value: target.value,
        })
      },
      dialogConfirm() {

        this.$refs.message.open()
      },
      dialogClose() {
        console.log('点击关闭')
      },
      onClick(_id) {
        this.currentId = _id;
        this.$refs.popup.open()
      },
      async loadData(currentDateStr) {
        const {
          db,
        } = this;

        const username = accountStorage.get();
        uni.showLoading()

        const res = await db.where({
          date: currentDateStr,
          user_id: username
        }).get()

        const newData = [{
          date: currentDateStr,
          user_id: username,
          value: 0,
          target: 60,
          name: '前端',
        }, {
          date: currentDateStr,
          user_id: username,
          value: 0,
          target: 60,
          name: '英语',
        }]

        // 没有当天数据,自动创建
        if (res.result.data.length === 0) {
          const res2 = await db.add(newData)
          const nextNewData = newData.map((item, index) => ({
            ...item,
            _id: res.result.data[index]
          }))
          this.items = nextNewData
        } else {
          this.items = res.result.data
        }
        uni.hideLoading()
      }
    }
  }
</script>

<style>
  * {
    padding: 0;
    margin: 0;
  }

  ul {
    list-style: none;
  }

  .page {
    display: flex;
    flex-direction: column;
    padding: 50px;
  }

  .items {
    width: 500px;
  }

  .item {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 3px;
    border: 1px solid #eaeaea;
  }

  .cell {
    display: flex;
    flex-direction: column;
  }

  .progress {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    height: 100%;
    width: 50%;
    border-radius: 3px;
    background: limegreen;
  }

  .options {
    display: flex;
  }

  .option {
    cursor: pointer;
    padding: 10px 20px;
    background: #fff;
    border-radius: 3px;
    margin: 0 10px;
    border: 1px solid #ccc;
  }

  .date-btns {
    display: flex;
    margin-bottom: 20px;
  }

  .date {
    padding: 15px 20px;
    margin: 0 10px;
    border-radius: 3px;
  }

  .date-btn {
    cursor: pointer;
    padding: 15px 20px;
    border: 2px solid #ccc;
    border-radius: 3px;
  }
  
  .disabled {
    background: #ccc;
    cursor: not-allowed;
    pointer-events: none;
  }
</style>