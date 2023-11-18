export const accountStorage = {
  get: () => {
    return localStorage.getItem('username');
  },
  set: (value) => {
    localStorage.setItem('username', value);
  },
  remove: () => {
    localStorage.removeItem('username')
  }
}

// 辅助函数：如果数字小于10，在前面加上一个零
function padZero(number) {
  return number < 10 ? "0" + number : number;
}

export function getCurrentFormattedDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = padZero(currentDate.getMonth() + 1); // 月份是从0开始计数的，所以要加1
  const day = padZero(currentDate.getDate());

  // 将年、月、日拼接成字符串，使用-分隔
  const formattedDate = year + "-" + month + "-" + day;

  return formattedDate;
}