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

export function manipulateDate(inputDate, offset = 0) {
  const date = new Date(inputDate);
  date.setDate(date.getDate() + offset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDate(date) {
  const nextDate = date ? new Date(date) : new Date();

  const year = nextDate.getFullYear();
  const month = String(nextDate.getMonth() + 1).padStart(2, '0');
  const day = String(nextDate.getDate()).padStart(2, '0');

  // 格式化日期为"年-月-日"
  return `${year}-${month}-${day}`;
}

export function getMonthDatesUntilToday(date) {
  const today = date ? new Date(date) : new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const now = new Date();

  const monthDates = [];
  let currentDay = new Date(firstDayOfMonth);

  while (currentDay.getMonth() === today.getMonth() && currentDay <= now) {
    monthDates.push(formatDate(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  return monthDates.map((date) => ({ date }));
}

export function generateThisWeek(dateStr) {
  const now = new Date();
  const today = dateStr ? new Date(dateStr) : new Date();
  const monday = getDateInWeek(dateStr);

  // 创建包含一周日期的数组
  const weekDates = [];
  while (monday.getMonth() === today.getMonth() && monday <= now) {
    weekDates.push(formatDate(monday));
    monday.setDate(monday.getDate() + 1);
  }

  console.log('weekDates', weekDates)

  return weekDates.map((dateString, index) => {
    const dayOfWeek = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'][index];
    return {
      dayOfWeek: dayOfWeek,
      date: dateString,
    };
  });
}

/**
 * 表示特定日期格式 "YYYY-MM-DD" 的日期字符串
 * @typedef {string} DateFormat
 */

/**
 * 获取指定日期获取其所在星期中的星期一
 * @param {DateFormat} date 
 * @returns Date
 */
export function getDateInWeek(date) {
  const nextDate = new Date(date);
  const dayInMonth = nextDate.getDate();
  const dayInWeek = nextDate.getDay() || 7;

  // 核心是这句代码，为什么用当前所在月份中的排序减去当前所在星期中的排序就能得到当前是星期几呢？
  // 月份也是由星期堆砌起来的，所以，当你用dayInMonth减去dayInWeek时，得到的就是当前星期的开始
  nextDate.setDate(dayInMonth - dayInWeek + 1);
  return nextDate;
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
    return 0;
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
};

export const getMonthAndDay = (dateString) => {
  // 使用split函数将字符串分割成数组
  const dateArray = dateString.split('-');

  // 去掉数组中的第一个元素（年份）
  dateArray.shift();

  // 使用join函数将数组元素合并为字符串
  return dateArray.join('-');
};


export const getLevelClass = (value, target) => {
  const ratio = value / target;
  if (ratio < 1) {
    return '';
  }
  if (ratio === 1) {
    return 'l1-bg';
  }
  if (ratio <= 5) {
    return 'l2-bg';
  }
  if (ratio <= 10) {
    return 'l3-bg';
  }
  return 'l4-bg';
};
