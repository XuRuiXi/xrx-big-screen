import React from 'react';
import type { EChartsOption } from 'echarts';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';

type ChartData = {
  label: string;
  value: number | string;
}[];

export interface PyramidChartProps extends Omit<ChartsProps, 'options'> {
  data: ChartData;
  config?: ChartConfig;
}

interface ChartConfig {

  /** 自定义颜色 */
  colors?: string[];

  /** 图表上边距(可控制三角形的大小) */
  gridTop?: number | string;

  /** 图表左边距(可控制三角形的大小) */
  gridLeft?: number | string;

  /** 图表右边距(可控制三角形的大小) */
  gridRight?: number | string;

  /** 图表下边距(可控制三角形的大小) */
  gridBottom?: number | string;

  /** 大小是否平均 */
  average?: boolean;

  /** 标签字体颜色 */
  labelTextColor?: string;

  /** 标签线的颜色 */
  labelLineColor?: string;

  /** 标签的x坐标(默认：90%，当标签太长，可以调整该值) */
  labelPoX?: string | number;

  /** 值的字体大小 */
  valueTextSize?: number;

  /** 值的字体颜色 */
  valueTextColor?: string;

  /** 标签的字体大小 */
  labelTextSize?: number;
}

interface _ChartRenderData {
  name: string;
  value: number;
  title: string;
}

function getChartOptionsByData(data: ChartData, config: ChartConfig = {}): EChartsOption {
  const _data = data.sort((a, b) => ~~a.value - ~~b.value);
  const list: _ChartRenderData[] = [];
  const {
    average = true,
    labelTextColor = '#FFFFFF',
    labelLineColor = '#FFFFFF80',
    labelPoX = '90%',
    labelTextSize = 18,
    valueTextSize = 18,
    valueTextColor = '#fff',
  } = config;

  const { length } = _data;

  _data.forEach((it, i) => {
    let value: number;
    if (average) {
      value = (100 / length) * (i + 1);
    } else {
      value = ~~it.value;
    }
    list.push({
      value,
      name: ` ${it.label}`,
      title: `${it.value}`,
    });
  });

  const {
    colors = ['#004EFF', '#00E5FF', '#512AFB'],
    gridTop = 0,
    gridLeft = 0,
    gridRight = 80,
    gridBottom = 0,
  } = config;

  const option: EChartsOption = {
    color: colors,
    series: [
      {
        type: 'funnel',
        data: list,
        sort: 'ascending',
        top: gridTop,
        left: gridLeft,
        right: gridRight,
        bottom: gridBottom,
        label: {
          show: true,
          color: labelTextColor,
          fontSize: labelTextSize,
        },
        labelLayout: {
          x: labelPoX,
          align: 'left',
        },
        labelLine: {
          lineStyle: {
            type: 'dashed',
            color: labelLineColor,
          },
        },
        itemStyle: {
          borderWidth: 0,
        },
      },
      {
        type: 'funnel',
        data: list,
        sort: 'ascending',
        top: gridTop,
        left: gridLeft,
        right: gridRight,
        bottom: gridBottom,
        label: {
          show: true,
          color: valueTextColor,
          fontSize: valueTextSize,
          position: 'inner',
          formatter: ({ data: d }) => {
            const { title } = d as { title: string };
            return `${title}`;
          },
        },
        labelLayout: {
          align: 'center',
        },
        itemStyle: {
          borderWidth: 0,
          color: 'transparent',
        },
        z: 100,
      },
    ],
  };

  return option;
}

export function PyramidChart(props: PyramidChartProps) {
  const { data, config = {}, ...otherProps } = props;
  const opt = getChartOptionsByData(data, config);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}
