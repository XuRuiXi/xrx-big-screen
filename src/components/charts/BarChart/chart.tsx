import React, { useRef, useEffect } from 'react';
import type {
  ECharts,
  EChartsOption,
  BarSeriesOption,
  TitleComponentOption,
  LegendComponentOption,
} from 'echarts';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';
import { getColorFromArray } from '../Charts/utils';
import type { ColorLike } from '../Charts/utils';

export type DataItem = {
  label: string;
  data: Record<string, number>;
};

interface ChartData {
  keys: string[];
  list: DataItem[];
}

export interface BarChartProps extends Omit<ChartsProps, 'options'> {
  data: ChartData;
  config?: ChartConfig;
}

interface ChartConfig {
  colors?: ColorLike[];

  /** 图标标题 */
  title?: string;

  /** 图标标题颜色 */
  titleColor?: string;

  /** 图标标题文字大小 */
  titleSize?: number;

  /** 图标标题文字粗细 */
  titleWeight?: number;

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

  /** 同组bar的间距 */
  barGap?: string | number;

  /** bar的圆角，单数字为四角统一值，或四个角 */
  barRadius?: number | [number, number, number, number];

  /** 是否显示图例 */
  showLegend?: boolean;

  /** 图例的图标圆角 */
  legendItemSize?: number;

  /** 图例的文案字体大小 */
  legendTextSize?: number;

  /** 图例的文案字体颜色 */
  legendTextColor?: string;

  /* 图例位置 */
  legendPosition?: {
    top?: string | number;
    right?: string | number;
    bottom?: string | number;
    left?: string | number;
  };

  /** x坐标文案大小 */
  xLabelSize?: number;

  /** x坐标文案颜色 */
  xLabelColor?: string;

  /** y坐标文案大小 */
  yLabelSize?: number;

  /** y坐标文案颜色 */
  yLabelColor?: string;

  /** x轴坐标点击事件 */
  xLabelEvent?: (item: DataItem, event: unknown) => void;

  /** 是否显示 tooltip */
  showTooltip?: boolean;

  /** hover bar 时是否显示值 */
  hoverValue?: boolean;

  /** x坐标文本旋转角度 */
  xLabelRotate?: number;
}

function getChartOptionsByData(data: ChartData, config: ChartConfig = {}): EChartsOption {
  const { keys, list = [] } = data;
  const {
    title,
    titleColor = '#00E5FF',
    titleSize = 20,
    titleWeight = 500,
    colors = ['#39B5CC', '#512AFB', '#6B7077', '#F1B805'],
    gridTop = 40,
    gridLeft = 10,
    gridRight = 0,
    gridBottom = 10,
    barWidth = 10,
    showLegend = true,
    barGap = '100%',
    barRadius = [10, 10, 0, 0],
    legendItemSize = 10,
    legendTextSize = 18,
    legendTextColor = '#fff',
    legendPosition = {
      top: 0,
      right: 0,
    },
    xLabelSize = 18,
    xLabelColor = '#C3C3C4',
    yLabelSize = 18,
    yLabelColor = '#C3C3C4',
    xLabelEvent,
    showTooltip = true,
    hoverValue = false,
    xLabelRotate = 0,
  } = config;
  const labels: string[] = [];
  const series: BarSeriesOption[] = [];
  const dataMap: Record<string, number[]> = {};

  list.forEach((it) => {
    labels.push(it.label);
    keys.forEach((key) => {
      dataMap[key] ??= [];
      dataMap[key].push(it.data[key]);
    });
  });

  keys.forEach((key) => {
    series.push({
      z: 2,
      name: key,
      type: 'bar',
      roundCap: true,
      xAxisIndex: 0,
      barWidth,
      barGap,
      label: {
        show: false,
        position: 'top',
        fontFamily: 'DIN-Regular',
        borderWidth: 0,
        color: '#fff',
      },
      itemStyle: {
        borderRadius: barRadius,
      },
      labelLayout: {},
      data: dataMap[key],
      emphasis: {
        label: {
          show: hoverValue,
        },
      },
    });
  });

  const titleOption: TitleComponentOption | undefined = title ?
    {
      text: title,
      textStyle: {
        color: titleColor,
        fontSize: titleSize,
        fontWeight: titleWeight,
      },
    } :
    undefined;

  const legend: LegendComponentOption | undefined = showLegend ?
    {
      z: 4,
      show: true,
      data: keys,
Z      icon: 'circle',
      textStyle: {
        color: legendTextColor,
        fontSize: legendTextSize,
      },
      itemHeight: legendItemSize,
      selectedMode: false,
      ...legendPosition,
    } :
    undefined;

  const option: EChartsOption = {
    color: getColorFromArray(colors),
    grid: {
      top: gridTop,
      left: gridLeft,
      right: gridRight,
      bottom: gridBottom,
      containLabel: true,
    },
    xAxis: [
      {
        data: labels,
        type: 'category',
        name: '组',
        boundaryGap: true,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: xLabelColor,
          fontSize: xLabelSize,
          // align: 'center',
          interval: 0,
          rotate: xLabelRotate,
          formatter(value, index) {
            const chuncks = value.match(/.{1,1}/g);
            return chuncks.join('\n');
          },
        },
        triggerEvent: !!xLabelEvent,
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisTick: { show: false },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#0E4262',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted',
            color: '#0E4262',
          },
        },
        axisLabel: {
          color: yLabelColor,
          fontSize: yLabelSize,
        },
      },
    ],
    title: titleOption,
    legend,
    series: [...series],
    // @ts-expect-error
    tooltip: showTooltip ?
      {
        trigger: 'item',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderWidth: 0,
        textStyle: {
          color: '#fff',
        },
        position: (pos, params, div, rect, size) => {
          const [px, py] = pos;
          const obj: Record<string, unknown> = {
            top: pos[1],
            left: undefined,
            right: undefined,
            bottom: undefined,
          };

          if (py + size.contentSize[1] > size.viewSize[1]) {
            obj.top = size.viewSize[1] - size.contentSize[1];
          }

          if (px < size.contentSize[0]) {
            obj.left = px;
          } else if (px + size.contentSize[0] > size.viewSize[0]) {
            obj.right = size.viewSize[0] - px;
          } else {
            return [pos[0], obj.top];
          }

          return obj;
        },
      } :
      undefined,
  };

  return option;
}

export function BarChart(props: BarChartProps) {
  const { data, config = {}, ...otherProps } = props;
  const { xLabelEvent } = config;
  const chart = useRef<ECharts>(null);
  const opt = getChartOptionsByData(data, config);
  useEffect(() => {
    if (xLabelEvent && chart.current) {
      chart.current.on('click', (event) => {
        const { value } = event;
        const { list } = data;
        const item = list.find(i => i.label === value);
        if (item) xLabelEvent(item, event);
      });
    }
  }, [chart.current, xLabelEvent]);

  return <Charts ref={chart} className="b100x100" options={opt} {...otherProps} />;
}
