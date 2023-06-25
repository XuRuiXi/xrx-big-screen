/**
 * @author Jiang.Guoyuan
 * @create date 2021-04-25 14:02:16
 * @modify date 2021-04-25 14:15:37
 * @desc 数字翻牌器
 */
import { useInterval } from 'ahooks';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import CountUp from 'react-countup';
import styles from './DigitalFlop.less';

/**
 * 预设尺寸大小
 */
export type SizeType = 'small' | 'middle' | 'large';
export interface IDigitalFlopProps {

  /**
   * 数值
   */
  value: number;

  /**
   * 翻牌时间
   */
  duration?: number;

  /**
   * 尺寸
   * 默认为 middle
   */
  size?: SizeType | 'size20' | 'size32';

  /**
   * 小数位数
   */
  decimals?: number;

  /**
   * 翻牌数字颜色
   * 默认为 #FFF 白色
   */
  color?: '#FCC004' | '#00E5FF' | '#FFFFFF' | '#52FF9A';

  /**
   * 自定义前缀 后缀
   */
  formatter?: DigitalFormatter;

  /**
   * 翻牌数字样式
   */
  numStyle?: React.CSSProperties;

  /**
   * numberWrapper样式
   */
  numberWrapStyle?: React.CSSProperties;

  /**
   * 是否开启千位分隔符
   */
  hasThousandSplit?: boolean;

  /**
   * 数字点击事件
   */
  onClick?: (e: React.MouseEvent) => void;

  /**
   * 是否开启定时翻牌
   * 默认开启
   */
  timing?: boolean;

  /**
   * 定时间隔时间
   * 默认为2分钟
   */
  interval?: number;

  /**
   * 定时翻牌的最小值
   * 默认为 100
   */
  minIntervalValue?: number;
  className?: string;
  style?: React.CSSProperties;
}

type DigitalFormatter = {
  prefix?: string | React.ReactNode;
  suffix?: string | React.ReactNode;
};

const DigitalFlop: React.FC<IDigitalFlopProps> = (props) => {
  const {
    value,
    duration,
    size,
    hasThousandSplit,
    color = '#FFFFFF',
    formatter = {},
    numStyle = {},
    decimals = 0,
    className = '',
    timing = true,
    interval: _interval = 2 * 60 * 1000,
    minIntervalValue = 100,
    style,
    numberWrapStyle,
    onClick,
  } = props;
  const { prefix, suffix } = formatter;
  const _value = isNaN(Number(value)) ? 0 : Number(value);

  const [start, setStart] = useState<number>(0);
  const [interval, setInterval] = useState<number | null | undefined>(_interval);
  // 定时翻牌计数器
  const count = useRef<number>(0);
  // 缓存上一次的值
  const prev = useRef<number>(_value);

  useInterval(() => {
    count.current++;
    if (prev.current !== _value) {
      count.current = 0;
      prev.current = _value;
    } else {
      setStart(count.current % 2 === 0 ? _value * 0.5 : _value * 1.5);
    }
  }, interval);

  useEffect(() => {
    if (timing) {
      setInterval(() => (_value > minIntervalValue ? _interval : null));
    } else {
      setInterval(() => null);
    }
  }, [_value]);

  const getSizeClassName = () => `${size ? size : 'middle'}Flop`;

  return (
    <div className={`${styles.root} ${className}`} style={style} onClick={onClick}>
      <div className={styles.numberWrapper} style={numberWrapStyle}>
        {typeof prefix === 'string' ? (
          <span className={styles[getSizeClassName()]}>{prefix}</span>
        ) : (
          prefix
        )}
        {useMemo(
          () => (
            <CountUp
              // @ts-expect-error
              style={{ color, ...numStyle }}
              className={styles[getSizeClassName()]}
              separator={hasThousandSplit ? ',' : ''}
              start={start}
              end={_value}
              preserveValue
              duration={duration ? duration : 2}
              decimals={decimals}
            />
          ),
          [start, _value, color, numStyle],
        )}
        {typeof suffix === 'string' ? (
          <span className={styles[getSizeClassName()]}>{suffix}</span>
        ) : (
          suffix
        )}
      </div>
    </div>
  );
};

export default DigitalFlop;
