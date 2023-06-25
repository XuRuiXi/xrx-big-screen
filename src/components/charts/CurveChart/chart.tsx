import React from 'react';
import { graphic } from 'echarts';
import type {
  EChartsOption,
  SeriesOption,
  TitleComponentOption,
  LegendComponentOption,
  // GraphicComponentOption,
} from 'echarts';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';
import { color2AColor } from '../Charts/utils';

interface ChartData {

  /** 数据维度 */
  keys: string[];

  /** 数据组 */
  list: {

    /** 数据名称 */
    label: string;
    value?: string | number;

    /** 各维度数据 */
    data: Record<string, number>;
  }[];
}

export interface CurveGroupChartProps extends Omit<ChartsProps, 'options'> {
  data: ChartData;
  config?: ChartConfig;
}

interface ChartConfig {

  /** 标题 */
  title?: string;

  /** 图标标题颜色 */
  titleColor?: string;

  /** 图标标题文字大小 */
  titleSize?: number;

  /** 图标标题文字粗细 */
  titleWeight?: number;

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

  /** 曲线是否平滑 */
  smooth?: boolean;

  /** bar的大小 */
  barWidth?: number;

  /** x坐标文案大小 */
  xLabelSize?: number;

  /** x坐标文案颜色 */
  xLabelColor?: string;

  /** x坐标文本旋转角度 */
  xLabelRotate?: number;

  /** y坐标文案大小 */
  yLabelSize?: number;

  /** y坐标文案颜色 */
  yLabelColor?: string;

  /** 是否显示图例 */
  showLegend?: boolean;

  /** 图例文字大小 */
  legendTextSize?: number;

  /** 图例文字颜色 */
  legendTextColor?: string;

  /** 是否显示hover时提示框 */
  showTooltip?: boolean;

  /** 图例图标大小 */
  legendShapeSize?: number;

  /** 曲线宽 */
  lineWidth?: number;

  /** 曲线点的大小 */
  lineSymbolSize?: number;

  /** 是否显示曲线面积 */
  showArea?: boolean;

  /** 是否显示值 */
  showValue?: boolean;

  valueTextRender?: (v: unknown, key: string) => string;
}

function getChartOptionsByData(data: ChartData, config: ChartConfig = {}): EChartsOption {
  const { keys, list = [] } = data;
  const {
    title,
    titleColor = '#00E5FF',
    titleSize = 20,
    titleWeight = 500,
    colors = ['#004EFF', '#00E5FF', '#512AFB'],
    gridTop = 40,
    gridLeft = 40,
    gridRight = 0,
    gridBottom = 40,
    showLegend = true,
    legendTextSize = 12,
    legendTextColor = '#fff',
    legendShapeSize = 10,
    smooth = false,
    showTooltip = false,
    showValue = true,
    valueTextRender = (v, k) => `${v}`,
    xLabelSize = 16,
    xLabelColor = '#fff',
    yLabelSize = 16,
    yLabelColor = '#fff',
    lineWidth = 2,
    lineSymbolSize = 5,
    showArea = false,
    xLabelRotate = 0,
  } = config;
  const labels: string[] = [];
  const values: Record<string, unknown[]> = {};
  const series: SeriesOption[] = [];

  list.forEach((it) => {
    labels.push(it.label);
    keys.forEach((key) => {
      values[key] ??= [];
      values[key].push(it.data[key]);
    });
  });

  keys.forEach((key, i) => {
    series.push({
      name: key,
      type: 'line',
      // stack: 'total',
      smooth,
      symbol: 'circle',
      symbolSize: lineSymbolSize,
      lineStyle: {
        width: lineWidth,
      },
      data: values[key] as number[],
      areaStyle: showArea
        ? {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: color2AColor(colors[i] ?? '#FFF', 1) },
            { offset: 1, color: color2AColor(colors[i] ?? '#FFF', 0) },
          ]),
        }
        : undefined,
      label: {
        show: showValue,
        color: colors[i] ?? '#fff',
        fontFamily: 'DIN-Regular',
        formatter: ({ value: d }) => valueTextRender(d, key),
      },
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
        color: legendTextColor,
        fontSize: legendTextSize,
      },
      itemHeight: legendShapeSize,
      selectedMode: false,
    }
    : undefined;

  const titleCom: TitleComponentOption | undefined = title
    ? {
      text: title,
      textStyle: {
        color: titleColor,
        fontSize: titleSize,
        fontWeight: titleWeight,
      },
    }
    : undefined;

  const option: EChartsOption = {
    color: colors,
    grid: {
      top: gridTop,
      left: gridLeft,
      right: gridRight,
      bottom: gridBottom,
    },
    xAxis: [
      {
        splitLine: { show: false },
        data: labels,
        axisTick: {
          inside: true,
          alignWithLabel: true,
        },
        axisLabel: {
          color: xLabelColor,
          fontSize: xLabelSize,
          rotate: xLabelRotate,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        splitLine: {
          lineStyle: {
            type: 'dotted',
          },
        },
        axisLabel: {
          color: yLabelColor,
          fontSize: yLabelSize,
        },
      },
    ],
    // @ts-expect-error
    tooltip: showTooltip
      ? {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderWidth: 0,
        textStyle: {
          color: '#fff',
        },
        position: (pos, params, div, rect, size) => {
          const [px] = pos;
          const obj: Record<string, unknown> = {
            top: (size.viewSize[1] - size.contentSize[1]) / 2,
            left: undefined,
            right: undefined,
          };
          if (px < size.contentSize[0]) {
            obj.left = px;
          } else if (px + size.contentSize[0] > size.viewSize[0]) {
            obj.right = size.viewSize[0] - px;
          } else {
            return [pos[0], obj.top];
          }

          return obj;
        },
      }
      : undefined,
    legend,
    title: titleCom,
    series: [
      // 动态
      ...series,
    ],
  };

  return option;
}

export function CurveGroupChart(props: CurveGroupChartProps) {
  const { data, config = {}, ...otherProps } = props;
  const opt = getChartOptionsByData(data, config);
  return <Charts className="b100x100" {...otherProps} options={opt} />;
}
