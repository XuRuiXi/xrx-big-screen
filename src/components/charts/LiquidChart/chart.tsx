import React from 'react';
import type { EChartsOption, GraphicComponentOption } from 'echarts';
import Charts from '../Charts';
import 'echarts-liquidfill';

export interface LiquidChartProps {
  data: ChartData;
  config?: ChartConfig;
}

export interface ChartData {
  value: number;
  label?: string;

  tips?: string;
  max?: number;
  colors?: [string, string];
  tipsColor?: string;
  outlineColor?: string;
  outlineWidth?: number;
}

export interface ChartConfig {
  texts?: TextRenderConfig[];
}

export interface TextRenderConfig {

  /** 文本 */
  text: string;

  /** 颜色 */
  color?: string;

  /** 字体大小 */
  fontSize?: number;

  /** 字粗 */
  fontWeight?: number;

  /** 字体 */
  fontFamily?: string;

  /** 水平位置，可为具体大小，百分比，center，left，right */
  x?: number | 'center' | 'left' | 'right' | string;

  /** 垂直位置，可为具体大小，百分比，center，top，bottom*/
  y?: number | 'center' | 'top' | 'bottom' | string;
}

export const GetDefaultTextConfig = (a: string, n: string, t: string): TextRenderConfig[] => [
  {
    text: a,
    fontSize: 18,
    x: 'center',
    y: '12%',
    color: '#FFF',
  },
  {
    text: n,
    fontSize: 36,
    fontWeight: 600,
    fontFamily: 'DIN-Regular',
    x: 'center',
    y: 'center',
    color: '#FFF',
  },
  {
    text: t,
    fontSize: 18,
    x: 'center',
    y: '68%',
    color: '#FCC004',
  },
];

function getChartOptionsByData(data: ChartData, config: ChartConfig = {}): EChartsOption {
  const {
    value,
    max = 100,
    colors = ['#0BB0C3E6', '#0AAABD80'],
    outlineColor = '#0AA6B9',
    outlineWidth = 2,
  } = data;

  const { texts = [] } = config;

  const graphic: GraphicComponentOption[] = [];
  texts.forEach((txt, i) => {
    graphic.push({
      zlevel: 10 + i,
      type: 'text',
      top: txt.y ?? 'center',
      left: txt.x ?? 'center',
      style: {
        textAlign: 'center',
        text: txt.text,
        fontSize: txt.fontSize ?? 20,
        fontWeight: txt.fontWeight ?? 500,
        fontFamily: txt.fontFamily,
        fill: txt.color ?? '#fff',
      },
    });
  });

  const percent: number = value / max;
  const options: EChartsOption = {
    series: [
      {
        color: colors,
        // @ts-expect-error
        type: 'liquidFill', // 这个是插件增加的类型，原Echarts类型未收录
        radius: '96%',
        center: ['50%', '50%'],
        data: [percent, percent - 0.1],
        backgroundStyle: {
          color: 'rgb(0,0,0,0)',
        },
        outline: {
          itemStyle: {
            color: 'none',
            borderColor: outlineColor,
            borderWidth: outlineWidth,
          },
        },
        label: {
          show: false,
        },
      },
    ],
    graphic,
  };

  return options;
}

export function LiquidChart(props: LiquidChartProps) {
  const { data, config } = props;
  const opt = getChartOptionsByData(data, config);
  return <Charts className="b100x100" options={opt} />;
}
