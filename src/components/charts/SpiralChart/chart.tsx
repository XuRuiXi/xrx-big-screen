import React from 'react';
import { graphic } from 'echarts';
import type { EChartsOption } from 'echarts';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';

interface ChartData {
  label: string;
  value: number;
}

export interface SpiralChartProps extends Omit<ChartsProps, 'options'> {
  data: ChartData[];
  config?: ChartConfig;
}

interface ChartConfig {
  centerLabel?: string;
  center?: [string | number, string | number];
  stokeWidth?: number;
  radius?: string | number | (string | number)[];
  axisLabelMargin?: number;
  axisLabelAlign?: 'left' | 'right' | 'center';
}

function getChartOptionsByData(data: ChartData[], config: ChartConfig = {}): EChartsOption {
  let max: number = 0;
  const list = data.map((it) => {
    max = Math.max(it.value, max);
    return {
      value: it.value,
      name: it.label,
    };
  });
  max += max / 3;
  const {
    center = ['50%', '50%'],
    stokeWidth = 10,
    centerLabel = '',
    radius = ['50%', '100%'],
    axisLabelMargin = 10,
    axisLabelAlign = 'right',
  } = config;

  const option: EChartsOption = {
    polar: {
      center,
      radius,
    },
    angleAxis: {
      show: false,
      clockwise: true,
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      min: 0,
      max,
      boundaryGap: ['0', '100'],
      // startAngle: 180,
    },
    radiusAxis: {
      type: 'category',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        color: '#fff',
        align: axisLabelAlign,
        margin: axisLabelMargin,
        fontSize: 14,
      },
      data: list.map(it => it.name),
      z: 10,
    },
    series: [
      {
        z: 2,
        type: 'bar',
        data: list,
        coordinateSystem: 'polar',
        barMaxWidth: stokeWidth,
        silent: true,
        roundCap: true,
        barGap: -100,
        barCategoryGap: -100,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#3336C7' },
          { offset: 1, color: '#00E5FF' },
        ]),
        label: {
          show: true,
          position: 'left',
        },
      },
    ],
    graphic: [
      {
        type: 'text',
        id: 'percent_label',
        top: 'center',
        left: 'center',
        style: {
          text: centerLabel,
          fontSize: 20,
          fill: '#ffffff',
          textAlign: 'center',
        },
      },
    ],
  };

  return option;
}

export function SpiralChart(props: SpiralChartProps) {
  const { data, config = {}, ...otherProps } = props;
  const opt = getChartOptionsByData(data, config);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}
