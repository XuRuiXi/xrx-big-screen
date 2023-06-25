import React from 'react';
import { graphic } from 'echarts';
import type { EChartsOption } from 'echarts';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';

export interface RankChartProps extends Omit<ChartsProps, 'options'> {

  /** 数据源 */
  data: ChartData[];

  /** 图表配置 */
  config?: ChartConfig;
}

export interface ChartData {
  label: string;
  value: number;
}

export interface ChartConfig {

  /** 图表最大值，默认为传入数据中的最大值 */
  max?: number;

  /** 文本布局 */
  layout?: 'vertical' | 'horizontal';

  /** 值的后缀；如：%、¥、$ */
  valueSuffix?: string;

  /** 图表上边距 */
  gridTop?: number | string;

  /** 图表左边距 */
  gridLeft?: number | string;

  /** 图表右边距 */
  gridRight?: number | string;

  /** 图表下边距 */
  gridBottom?: number | string;
}

function getChartOptionsByData(data: ChartData[], config: ChartConfig): EChartsOption {
  const labels: string[] = [];
  const values: number[] = [];
  const {
    max,
    layout = 'vertical',
    valueSuffix = '',
    gridTop = 20,
    gridLeft = 0,
    gridRight = 5,
    gridBottom = -20,
  } = config;
  let maxValue: number = max ?? 0;
  data.forEach((it) => {
    labels.push(it.label);
    values.push(it.value);
  });

  if (!maxValue) {
    maxValue = data.reduce((c, n) => Math.max(c, n.value), 0);
  }

  const options: EChartsOption = {
    grid: {
      top: gridTop,
      left: gridLeft,
      right: gridRight,
      bottom: gridBottom,
      containLabel: layout === 'horizontal',
    },
    tooltip: { show: false },
    xAxis: {
      show: false,
      type: 'value',
    },
    yAxis: [
      {
        type: 'category',
        data: labels,
        inverse: true,
        axisLabel: {
          inside: layout === 'vertical',
          align: layout === 'vertical' ? 'left' : 'right',
          verticalAlign: layout === 'vertical' ? 'bottom' : 'middle',
          fontSize: 20,
          lineHeight: 48,
          color: '#fff',
          margin: layout === 'horizontal' ? 10 : 0,
        },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      {
        type: 'category',
        inverse: true,
        data: values,
        axisTick: { show: false },
        axisLine: { show: false },
        show: true,
        axisLabel: {
          margin: layout === 'horizontal' ? 10 : 4,
          inside: layout === 'vertical',
          verticalAlign: layout === 'vertical' ? 'bottom' : 'middle',
          color: '#00E5FF',
          fontSize: 20,
          lineHeight: 40,
          fontWeight: 'bold',
          fontFamily: 'DIN-Regular',
          formatter: valueSuffix ? (v, i) => `${v}${valueSuffix}` : undefined,
        },
      },
    ],
    series: [
      {
        name: '值',
        type: 'bar',
        zlevel: 2,
        data: values,
        itemStyle: {
          borderRadius: 6,
          color: new graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#3336C7' },
            { offset: 1, color: '#00E5FF' },
          ]),
        },
        barWidth: 6,
        barGap: 20,
        barCategoryGap: 20,
      },
      {
        name: '背景',
        type: 'bar',
        zlevel: 1,
        barGap: '-100%',
        barWidth: 6,
        itemStyle: {
          borderRadius: 6,
          color: '#262D3C',
        },
        data: values.map(() => maxValue),
        legendHoverLink: false,
      },
    ],
  };

  return options;
}

export function RankChart(props: RankChartProps) {
  const { data, config = {}, ...othersProps } = props;
  const opt = getChartOptionsByData(data, config);
  return <Charts className="b100x100" options={opt} {...othersProps} />;
}
