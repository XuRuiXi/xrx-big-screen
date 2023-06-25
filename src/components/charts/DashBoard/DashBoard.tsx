/**
 * @author Jiang.Guoyuan
 * @create date 2021-04-06 15:00:00
 * @modify date 2021-04-12 11:19:08
 */
import pc from 'prefix-classnames';
import React, { useMemo } from 'react';
import type { IDigitalFlopProps } from '@/components/DigitalFlop/DigitalFlop';
import DigitalFlop from '@/components/DigitalFlop/DigitalFlop';
import { isValidPercent } from '@/utils/isValidValue';
import styles from './DashBoard.less';

type FilterDigitalFlopProps = Omit<IDigitalFlopProps, 'value'>;

/**
 * 渐变色配置
 */
type LinearGradientType = {
  rate: string;
  color: string;
};

/**
 * 样式配置
 */
type DashBoardStyleType = {
  radius?: number;
  borderWidth?: number;

  /* 默认样式1：红->蓝；默认样式2：蓝->红；自定义样式 */
  linearColor?: 'style1' | 'style2' | LinearGradientType[];

  /* 描述文字宽度，默认不传时为直径的 0.7 倍 */
  descriptionWidth?: number;
};
interface IDashBoardProps extends React.HTMLAttributes<HTMLDivElement> {

  /**
   * 仪表盘百分比值
   */
  percent: number;

  /**
   * 小数精度
   */
  decimals?: number;

  /**
   * 描述
   */
  description?: string;

  /**
   * 半个/整个仪表盘，默认为一半
   */
  isHalf?: boolean;

  /**
   * 翻牌器配置
   */
  flopOptions?: FilterDigitalFlopProps;

  /**
   * 样式配置
   */
  styleOptions?: DashBoardStyleType;

  /**
   * 描述样式配置
   */
  descriptionStyle?: React.CSSProperties;
}

// 默认渐变色1
const defaultLinearGradientConfig1: LinearGradientType[] = [
  {
    rate: '0%',
    color: '#FF444F',
  },
  {
    rate: '33%',
    color: '#FFBD00',
  },
  {
    rate: '66%',
    color: '#00DDFA',
  },
  {
    rate: '100%',
    color: '#3336C7',
  },
];

// 默认渐变色2
const defaultLinearGradientConfig2: LinearGradientType[] = [
  {
    rate: '0%',
    color: '#3336C7',
  },
  {
    rate: '33%',
    color: '#00E5FF',
  },
  {
    rate: '66%',
    color: '#FCC004',
  },
  {
    rate: '100%',
    color: '#FF5757',
  },
];

const getDefaultLinearColor = (linearColor: DashBoardStyleType['linearColor']) => {
  switch (linearColor) {
    case 'style1':
      return defaultLinearGradientConfig1;
    case 'style2':
      return defaultLinearGradientConfig2;
    default:
      return defaultLinearGradientConfig1;
  }
};

const px = pc('half-dash-board');

const DashBoard: React.FC<IDashBoardProps> = ({
  percent = 0,
  decimals,
  flopOptions,
  isHalf = true,
  description,
  style,
  className = '',
  styleOptions,
  descriptionStyle,
}) => {
  const {
    radius = 70,
    borderWidth = 10,
    linearColor,
    descriptionWidth = 2 * radius * 0.7,
  } = styleOptions ?? {};
  const _linearColor = useMemo(
    () =>
      !linearColor || typeof linearColor === 'string'
        ? getDefaultLinearColor(linearColor)
        : linearColor,
    [linearColor],
  );
  const diameter = useMemo(() => (radius + borderWidth) * 2, [radius, borderWidth]);
  const circleLen = useMemo(() => (isHalf ? 0.5 : 1) * 2 * Math.PI * radius, [isHalf, radius]);
  const dashOffset = useMemo(
    () => circleLen * (1 - (isValidPercent(percent) ? percent : 0) / 100),
    [circleLen, percent],
  );

  const getCirclePath = (): string =>
    `M ${borderWidth} ${radius + borderWidth} 
     a ${radius} ${radius} 0 1 1 ${radius * 2} 0 
     ${isHalf ? '' : `a ${radius} ${radius} 0 1 1 ${-radius * 2} 0`}`;

  return (
    <div
      className={`${styles[px()]} ${className}`}
      style={{ width: diameter, height: diameter / (isHalf ? 2 : 1) + (isHalf ? 10 : 0), ...style }}
    >
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        style={{ transform: `rotate(${isHalf ? 0 : 90}deg)` }}
      >
        <path
          d={getCirclePath()}
          strokeWidth={borderWidth}
          stroke="grey"
          fill="none"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="circle-linear" x1="0%" y1="0%" x2="100%" y2="0%">
            {_linearColor.map((item, index) => (
              <stop key={index} offset={item.rate} stopColor={item.color} />
            ))}
          </linearGradient>
        </defs>
        <path
          className={styles['linear-circle']}
          d={getCirclePath()}
          strokeWidth={borderWidth}
          strokeDasharray={circleLen}
          strokeDashoffset={dashOffset}
          stroke="url(#circle-linear)"
          fill="none"
          strokeLinecap="round"
          style={{ transition: 'all 1s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          top: isHalf ? 0 : 10,
          left: 0,
          width: diameter,
          height: diameter,
        }}
      >
        <div className={styles[px('content')]}>
          <div className={styles['flop-wrapper']}>
            <DigitalFlop
              value={percent}
              decimals={decimals}
              numStyle={{ fontSize: 28 }}
              formatter={{ suffix: <span style={{ fontSize: 28 }}>%</span> }}
              {...flopOptions}
            />
          </div>
          <div
            className={styles.description}
            style={{ width: descriptionWidth, ...descriptionStyle }}
          >
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

DashBoard.defaultProps = {
  decimals: 0,
  description: '',
  isHalf: true,
  flopOptions: {},
  styleOptions: {},
  descriptionStyle: {},
};

export default DashBoard;
