import React from 'react';
import type { EChartsOption } from 'echarts';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';
import 'echarts-wordcloud';

interface ChartData {
  name: string;
  value: number;
}

export interface WordCloudChartProps extends Omit<ChartsProps, 'options'> {
  data: ChartData[];
  config?: ChartConfig;
}

interface ChartConfig {
  color?: string[];

  /** 间隔大小 */
  gridSize?: number;

  /** 文本大小范围 */
  sizeRange?: [number, number];

  /** 文本旋转角度范围 */
  rotationRange?: [number, number];
}

function getChartOptionsByData(data: ChartData[], config: ChartConfig = {}): EChartsOption {
  const { color, gridSize = 32, sizeRange = [12, 24], rotationRange = [0, 0] } = config;

  const option: EChartsOption = {
    color,
    series: [
      {
        // @ts-expect-error
        type: 'wordCloud', // 这个是插件增加的类型，原Echarts类型未收录
        shape: 'circle',
        gridSize,
        sizeRange,
        rotationRange,
        drawOutOfBound: true,
        textStyle: {
          color: ({ dataIndex }) => {
            const len = data.length;
            const r = ((dataIndex as number) + 1) / len;
            return `rgba(0,229,255,${1 - r})`;
          },
        },
        emphasis: {
          // focus: 'self',
          // textStyle: {
          //   shadowBlur: 10,
          // },
        },
        data,
      },
    ],
  };

  return option;
}

export function WordCloudChart(props: WordCloudChartProps) {
  const { data, config = {}, ...otherProps } = props;
  const opt = getChartOptionsByData(data, config);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}
