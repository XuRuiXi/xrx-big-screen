/*
 * @Author: 听风
 * @Date: 2021-12-10 17:11:31
 * @Description: 公共类型
 */

// 地图点
export interface Point {

  /**
   * x 经度
   */
  x: number;

  /**
   * y 维度
   */
  y: number;

  /**
   * 半径大小
   */
  radius?: number;

  /**
   * 过滤的容差大小
   */
  distance?: number;

  /**
   * 图片url
   */
  url?: string;

  [key: string]: unknown;
}

// 图例数据
export interface LegendItem {
  title: string;
  count?: number;
  active?: boolean;
  points?: Point[];
  popupEnabled?: boolean;
  // 弹窗的宽高
  width?: number;
  height?: number;
  type?: string;
}

export interface LegendList {
  title: string;
  list: LegendItem[];
}
