import React from 'react';
import { graphic } from 'echarts';
import type { EChartsOption } from 'echarts';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';

export interface LineBarChartProps extends Omit<ChartsProps, 'options'> {
  data: ChartData[];
  config?: ChartConfig;
}

export interface ChartData {
  label: string;
  value: number;
}

interface ChartConfig {

  /** 自定义颜色 */
  colors?: string[];

  /** 图表上边距 */
  gridTop?: number | string;

  /** 图表左边距 */
  gridLeft?: number | string;

  /** 图表右边距 */
  gridRight?: number | string;

  /** 图表下边距 */
  gridBottom?: number | string;

  /** y轴文本与图表的间距 */
  yLabelMargin?: number;

  /** y轴文本颜色 */
  yLabelTextColor?: string;

  /** 值的文字颜色 */
  valueColor?: string;

  /** 值的文字大小 */
  valueSize?: number;

  /** 值的位置 */
  valuePosition?: 'fixed' | 'auto';

  /** bar的大小 */
  barWidth?: number;
}

export const demoData: ChartData[] = [
  { label: '桂城街道', value: 99 },
  { label: '狮山镇', value: 98 },
  { label: '狮山镇', value: 70 },
  { label: '狮山镇', value: 60 },
  { label: '狮山镇', value: 50 },
  { label: '狮山镇', value: 36 },
  { label: '狮山镇', value: 36 },
];

function getChartOptionsByData(data: ChartData[], config: ChartConfig = {}): EChartsOption {
  const {
    colors = ['#FF5757', '#FF7F10', '#FF7F10', '#7F8491'],
    gridTop = 0,
    gridLeft = -80,
    gridRight = 0,
    gridBottom = -20,
    yLabelMargin = 100,
    barWidth = 8,
    yLabelTextColor = '#fff',
    valueColor = '#fff',
    valueSize = 16,
    valuePosition = 'fixed',
  } = config;
  const labels: string[] = [];
  const values: number[] = [];
  const cube: number = 20;

  data.forEach((it) => {
    labels.push(it.label);
    values.push(it.value);
  });

  const cubeStyles: Record<string, unknown> = {};
  const _colors = [...colors];
  const last = _colors.pop();
  const len = _colors.length;
  _colors.forEach((c, i) => {
    cubeStyles[`a${i}`] = {
      color: '#fff',
      backgroundColor: c,
      width: cube,
      height: cube,
      align: 'center',
      borderRadius: 0,
    };
  });

  const axisLabel = {
    color: valueColor,
    fontSize: valueSize,
    fontWeight: 500,
    fontFamily: 'DIN-Regular',
  };

  const options: EChartsOption = {
    grid: {
      top: gridTop,
      left: gridLeft,
      right: gridRight,
      bottom: gridBottom,
      containLabel: true,
    },
    tooltip: {
      show: false,
    },
    xAxis: {
      show: false,
      type: 'value',
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        data: labels,
        axisLabel: {
          align: 'left',
          margin: yLabelMargin,
          color: yLabelTextColor,
          fontSize: 19,
          formatter: (text, index: number) => {
            if (index < len) {
              return `{a${index}|${index + 1}}    ${text}`;
            }
            return `{b0|${index + 1}}    ${text}`;
          },
          rich: {
            ...cubeStyles,
            b0: {
              color: '#fff',
              backgroundColor: last,
              width: cube,
              height: cube,
              align: 'center',
              borderRadius: 0,
            },
          },
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
      {
        type: 'category',
        inverse: true,
        data: values,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        show: valuePosition === 'fixed',
        axisLabel: { ...axisLabel },
      },
    ],
    series: [
      {
        name: '值',
        type: 'bar',
        zlevel: 1,
        data: values,
        itemStyle: {
          borderRadius: 8,
          color: new graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#3336C7' },
            { offset: 1, color: '#00E5FF' },
          ]),
        },
        barWidth,
        barGap: 0,
        barCategoryGap: 0,
        label: {
          show: valuePosition === 'auto',
          position: 'right',
          ...axisLabel,
        },
      },
    ],
  };

  return options;
}

export function LineBarChart(props: LineBarChartProps) {
  const { data, config = {}, ...otherProps } = props;
  const opt = getChartOptionsByData(data, config);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}
