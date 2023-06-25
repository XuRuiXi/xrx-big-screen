/*
 * @Author: Gavin
 * @Date: 2021-05-24 15:59:47
 * @LastEditTime: 2022-01-24 16:14:16
 * @FilePath: /data-screen-fe/src/utils/index.ts
 * @Description:
 */

// 将类似202102格式的月份转为中文 2月
export const moonthId2Label = (moonthId) => {
  const moonthString = String(moonthId).slice(4);
  return `${Number(moonthString)}月`;
};

// 根据number大小自动换算单位
export const getUnit = (number: number | string, toFixed?: number) => {
  const num = Number(number);
  if (!Number.isFinite(num)) {
    return {
      number: '-',
      unit: '',
    };
  }
  if (num > 100000000) {
    return {
      number: (num / 100000000).toFixed(toFixed ?? 2),
      unit: '亿',
    };
  } else if (num > 10000) {
    return {
      number: (num / 10000).toFixed(toFixed ?? 2),
      unit: '万',
    };
  }
  return {
    number: num,
    unit: '',
  };
};

// 小数转百分数
export const numberToPercent = (number: string | number) => {
  const point = Number(number);
  return `${(point * 100 || 0).toFixed(0)}%`;
};

// 根据身份证号判断性别
export const getSex = (idCard: string): string =>
  parseInt(idCard.slice(16, 17), 10) % 2 === 1 ? 'man' : 'women';

// 多次调用仅执行一次的函数
export const once = function(fn: (...params: unknown[]) => void, name: string) {
  let caller = true;
  return (...params: unknown[]) => {
    if (caller) {
      caller = false;
      fn(params);
    }
  };
};

// 手机号脱敏，展示前3后4
export const formatterTel = (phone: number | string) =>
  String(phone).replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2');

// 移除url域名
export const removeUrlHost = (url: string) => url.replace(/^http:\/\/[^/]+/, '');
