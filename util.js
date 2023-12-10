export const accountStorage = {
  get: () => {
    return localStorage.getItem('username');
  },
  set: (value) => {
    localStorage.setItem('username', value);
  },
  remove: () => {
    localStorage.removeItem('username');
  },
};

// 辅助函数：如果数字小于10，在前面加上一个零
function padZero(number) {
  return number < 10 ? '0' + number : number;
}

export function manipulateDate(inputDate, offset = 0) {
  const date = new Date(inputDate);
  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 获取当天的年月日
 * @returns {String}
 */
export function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return year + '-' + month + '-' + day;
}

export const getTaskStatus = (finishedTaskLen, taskLen) => {
  // 没有任务
  if (taskLen === 0) {
    return 0
  }

  // 有任务，一个都没完成
  if (taskLen > 0 && finishedTaskLen === 0) {
    return 0;
  }

  // 有任务，部分完成
  if (taskLen > 0 && finishedTaskLen < taskLen) {
    return 1;
  }

  // 有任务，任务完成
  if (finishedTaskLen > 0 && finishedTaskLen >= taskLen) {
    return 2;
  }

  return 0;
}

export const getMonthAndDay = (dateString) => {
  // 使用split函数将字符串分割成数组
  const dateArray = dateString.split('-');

  // 去掉数组中的第一个元素（年份）
  dateArray.shift();

  // 使用join函数将数组元素合并为字符串
  return dateArray.join('-');
}

export const getLevelClass = (value, target) => {
  const ratio = value / target;
  if (ratio < 1) {
    return '';
  }
  if (ratio === 1) {
    return 'l1-bg'
  }
  if (ratio <= 5) {
    return 'l2-bg'
  }
  if (ratio <= 10) {
    return 'l3-bg'
  }
  return 'l4-bg'
}