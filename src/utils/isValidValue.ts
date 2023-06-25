/**
 * @author Jiang.Guoyuan
 * @create date 2021-04-12 11:26:10
 * @modify date 2021-04-12 11:26:10
 * @desc 存放判断是否符合有效值的一些方法
 */

/**
 * @param percent 百分比
 * @description 是否有效百分比
 */
export const isValidPercent = (percent: number) => percent > 0 && percent <= 100;
