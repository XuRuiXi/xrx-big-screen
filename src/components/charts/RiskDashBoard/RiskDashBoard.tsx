/**
 * @author Jiang.Guoyuan
 * @create date 2021-04-14 10:45:03
 * @modify date 2021-04-14 10:45:03
 * @desc [风险系数] 仪表盘
 */
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
import { GaugeChart as EchartGaugeChart } from 'echarts/charts';
import { graphic } from 'echarts';
import React, { useEffect, useMemo, useState } from 'react';
import { isValidPercent } from '@/utils/isValidValue';
import Charts from '../Charts';
import styles from './RiskDashBoard.less';

echarts.use([EchartGaugeChart]);

interface IRiskDashBoardProps extends React.HTMLAttributes<HTMLDivElement> {

  /**
   * 百分比，传入 0-100 的值
   */
  percent: number;

  /**
   * 标题
   */
  title: string;

  /**
   * 大小
   */
  size?: number;

  /**
   * 进度大小
   */
  percentFontSize?: number;

  /**
   * 标题大小
   */
  titleFontSize?: number;

  /**
   * 数字自定义展示格式
   */
  format?: (percent: number) => string;
}

// 无指针、刻度的仪表盘样式
const gaugeBaseStyle = {
  splitLine: { show: false },
  axisLabel: { show: false },
  pointer: { show: false },
  axisTick: { show: false },
  detail: { show: false },
};

const getOptions = (percent: number): EChartsOption => {
  const options: EChartsOption = {
    tooltip: { show: false },
    series: [
      {
        ...gaugeBaseStyle,
        name: 'border-gauge',
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        radius: '90%',
        splitNumber: 0,
        axisLine: {
          lineStyle: {
            width: 3,
            color: [[1, ' rgba(22,128,206,0.1)']],
          },
        },
      },
      {
        ...gaugeBaseStyle,
        name: 'white-line',
        type: 'gauge',
        radius: '80%',
        axisLine: {
          show: percent !== 0,
          roundCap: true,
          lineStyle: {
            width: 3,
            color: [
              [percent > 50 ? 0.2 : (percent / 100) * 0.2, 'transparent'],
              [
                percent / 100,
                // @ts-expect-error
                new graphic.LinearGradient(0, 1, 1, 0, [
                  {
                    offset: 0,
                    color: 'rgba(255,255,255,0)',
                  },
                  {
                    offset: 0.6,
                    color: 'rgba(255,255,255,0.4)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(255,255,255,1)',
                  },
                ]),
              ],
            ],
          },
        },
      },
      {
        ...gaugeBaseStyle,
        name: 'progress',
        type: 'gauge',
        radius: '70%',
        pointer: {
          show: true,
          length: '100%',
          width: 3, // 指针粗细
          itemStyle: {
            color: '#FFF',
          },
        },
        axisLine: {
          show: true,
          roundCap: true,
          lineStyle: {
            color: [[1, '#007AFF']],
            width: 3,
            shadowColor: '#99CCFF',
            shadowBlur: 10,
          },
        },
        axisTick: {
          show: true,
          splitNumber: 2,
          distance: 0,
          length: 10,
          lineStyle: {
            color: '#347DFF',
            width: 2,
          },
        },
        splitLine: {
          show: true,
          length: 25,
          distance: 0,
          lineStyle: {
            width: 2,
            color: '#347DFF',
          },
        },
        data: [{ value: percent }],
      },
      {
        ...gaugeBaseStyle,
        name: 'shine-progress',
        type: 'gauge',
        radius: '70%',
        axisLine: {
          show: true,
          lineStyle: {
            color: [
              [
                percent / 100,
                // @ts-expect-error
                new graphic.LinearGradient(0, 1, 1, 0, [
                  {
                    offset: 0.3,
                    color: 'rgba(145,207,255,0)',
                  },
                  {
                    offset: 0.7,
                    color: 'rgba(145,207,255,0.2)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(145,207,255,0.2)',
                  },
                ]),
              ],
              [1, 'rgba(28,128,245,.0)'],
            ],
            width: 40,
          },
        },
      },
      {
        ...gaugeBaseStyle,
        name: 'progress-background',
        type: 'gauge',
        radius: '70%',
        axisLine: {
          show: true,
          lineStyle: {
            color: [[1, 'rgba(28,128,245,.1)']],
            width: 110,
          },
        },
      },
      {
        ...gaugeBaseStyle,
        name: 'inner-border',
        type: 'gauge',
        radius: '30%',
        axisLine: {
          lineStyle: {
            width: 5,
            color: [[1, ' rgba(22,128,206,0.1)']],
          },
        },
      },
    ],
  };

  return options;
};

const RiskDashBoard: React.FC<IRiskDashBoardProps> = ({
  percent,
  title = '安全风险系数',
  format,
  size = 314,
  percentFontSize = 46,
  titleFontSize = 28,
}) => {
  const [opt, setOpt] = useState<EChartsOption>();
  const _percent = useMemo(() => (isValidPercent(percent) ? percent : 0), [percent]);

  useEffect(() => {
    setOpt(getOptions(isValidPercent(_percent) ? _percent : 0));
  }, [_percent]);

  return (
    <div className={styles.root} style={{ position: 'relative', width: size, height: size }}>
      <Charts style={{ width: '100%', height: '100%' }} options={opt} />
      <div className={styles.content}>
        <div className={styles.percent} style={{ fontSize: percentFontSize }}>
          {typeof format === 'function' ? format(_percent) : _percent / 100}
        </div>
        <div className={styles.title} style={{ fontSize: titleFontSize }}>
          {title}
        </div>
      </div>
    </div>
  );
};

RiskDashBoard.defaultProps = {
  size: 10,
  percentFontSize: 10,
  titleFontSize: 16,
  format: (number: number) => String(number),
};

export default RiskDashBoard;
