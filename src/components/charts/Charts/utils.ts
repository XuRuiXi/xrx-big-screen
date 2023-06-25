import { graphic } from 'echarts';

export type ColorLike = string | [string, string];
export type ZColor = graphic.LinearGradient | string;

/**
 * 颜色转换
 * @param colors 字符串颜色
 * @returns 符合 Echarts 的颜色值
 */
export function getColorFromArray(
  colors: ColorLike[],
  direction: [number, number, number, number] = [0, 0, 0, 1],
): ZColor[] {
  const res: ZColor[] = [];
  colors.forEach((color) => {
    if (Array.isArray(color)) {
      const { length } = color;
      const ll: { offset: number; color: string }[] = [];
      color.forEach((c, i) => {
        ll.push({ offset: i / (length - 1), color: c });
      });
      res.push(new graphic.LinearGradient(...direction, ll));
    } else {
      res.push(color);
    }
  });
  return res;
}

export function color2AColor(color: string, alpha: number = 1): string {
  if (/^#[0-9a-fA-f]{8}$/.test(color)) return color;
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  let _alpha = Math.round(255 * alpha).toString(16);
  if (_alpha.length < 2) {
    _alpha = `0${_alpha}`;
  }
  if (reg.test(color)) {
    if (color.length > 6) {
      return `${color}${_alpha}`;
    }
    const c = color.replace(/#/, '').split('');
    return c.reduce((t, n) => `${t}${n}${n}`, '');
  }

  return color;
}
