import React from 'react';
import type {
  EChartsOption,
  BarSeriesOption,
  LegendComponentOption,
  GraphicComponentOption,
} from 'echarts';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';

export interface ChartData {
  keys: string[];
  list: {
    label: string;
    value?: string | number;
    data: Record<string, number>;
  }[];
}

export interface StackChartProps extends Omit<ChartsProps, 'options'> {
  data: ChartData;
  config?: ChartConfig;
}

interface ChartConfig {

  /** 标题 */
  title?: string;

  /** 自定义颜色 */
  colors?: string[];

  /** 标题X位置 */
  titleX?: number;

  /** 标题Y位置 */
  titleY?: number;

  /** 图表上边距 */
  gridTop?: number | string;

  /** 图表左边距 */
  gridLeft?: number | string;

  /** 图表右边距 */
  gridRight?: number | string;

  /** 图表下边距 */
  gridBottom?: number | string;

  /** bar的大小 */
  barWidth?: number;

  /** 是否显示图例 */
  showLegend?: boolean;

  /** 图例图标大小 */
  legendShapeSize?: number;

  /** 是否显示总值 */
  showTotalValue?: boolean;

  /** 额外的图例配置 */
  extraLegendConfig?: LegendComponentOption;
}

export function getChartOptionsByData(data: ChartData, config: ChartConfig = {}): EChartsOption {
  const { keys, list = [] } = data;
  const {
    title,
    colors = ['#004EFF', '#00E5FF', '#512AFB'],
    gridTop = 40,
    gridLeft = 0,
    gridRight = 20,
    gridBottom = 0,
    barWidth = 8,
    showLegend = true,
    titleX = 0,
    titleY = 4,
    legendShapeSize = 10,
    showTotalValue = true,
    extraLegendConfig = {},
  } = config;
  const labels: string[] = [];
  const values: Record<string, unknown> = {};
  const series: BarSeriesOption[] = [];
  const dataMap: Record<string, number[]> = {};
  list.forEach((it) => {
    labels.push(it.label);
    values[it.label] = it.value;
    keys.forEach((k) => {
      dataMap[k] ??= [];
      dataMap[k].push(it.data[k]);
    });
  });
  keys.forEach((key, i) => {
    let borderRadius: number | number[] = 0;
    if (!i) {
      borderRadius = [barWidth, 0, 0, barWidth];
    } else if (i + 1 === keys.length) {
      borderRadius = [0, barWidth, barWidth, 0];
    }
    series.push({
      name: key,
      type: 'bar',
      stack: 'total',
      barWidth,
      itemStyle: { borderRadius },
      label: {
        show: true,
        position: 'top',
        verticalAlign: 'bottom',
        color: '#fff',
        fontSize: 14,
        fontFamily: 'DIN-Regular',
      },
      data: dataMap[key],
    });
  });

  const legend: LegendComponentOption | undefined = showLegend
    ? {
      z: 4,
      show: true,
      top: 0,
      right: 0,
      data: keys,
      // @ts-expect-error
      icon: 'circle',
      textStyle: {
        color: '#FFF',
        fontSize: 16,
      },
      selectedMode: false,
      itemHeight: legendShapeSize,
      ...(extraLegendConfig || {}),
    }
    : undefined;

  const graphic: GraphicComponentOption | undefined = title
    ? {
      type: 'text',
      x: titleX,
      y: titleY,
      style: {
        text: title,
        fontSize: 20,
        fontWeight: 600,
        fill: '#00E5FF',
      },
    }
    : undefined;

  const option: EChartsOption = {
    color: colors,
    grid: {
      top: gridTop,
      left: gridLeft,
      right: showTotalValue ? gridRight : -40,
      bottom: gridBottom,
      containLabel: true,
    },
    xAxis: [
      {
        type: 'value',
        show: false,
      },
    ],
    yAxis: [
      {
        type: 'category',
        inverse: true,
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
        data: labels,
        axisLabel: {
          color: '#fff',
          fontSize: 20,
        },
      },
    ],
    legend,
    series: [
      ...series,
      {
        type: 'bar',
        data: list.map(({ data: d }) => Object.values(d).reduce((t, n) => t + n, 0)),
        barWidth,
        barGap: '-100%',
        color: 'transparent',
        label: {
          show: showTotalValue,
          position: 'right',
          color: '#FBB600',
          fontSize: 20,
          fontFamily: 'DIN-Regular',
          formatter: (i) => {
            const v = (values[i.name] ?? i.value) as number;
            return `${v}`;
          },
        },
      },
    ],
    graphic,
  };

  return option;
}

export function StackChart(props: StackChartProps) {
  const { data, config = {}, ...otherProps } = props;
  const opt = getChartOptionsByData(data, config);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}
