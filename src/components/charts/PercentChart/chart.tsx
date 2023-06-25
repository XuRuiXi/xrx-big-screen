import React from 'react';
import { graphic } from 'echarts';
import type { EChartsOption, PolarComponentOption } from 'echarts';
import type { graphic as typeGraphic } from 'echarts/core';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';

interface ChartData {
  label: string;
  value: number;
}

interface ChartConfig {
  center?: [string | number, string | number];
  stokeWidth?: number;
  valuePoY?: string | number;
  labelPoY?: string | number;
  type?: 'half' | 'circle';
  startAngle?: number;
  colors?: string[];
  valueTextStyle?: typeGraphic.Text['style'];
  labelTextStyle?: typeGraphic.Text['style'];
  polar?: PolarComponentOption;
}

export interface PercentChartProps extends Omit<ChartsProps, 'options'> {
  data: ChartData;
  config?: ChartConfig;
}

function getChartOptionsByData(data: ChartData, config: ChartConfig = {}): EChartsOption {
  const { label = '', value = 0 } = data;
  const {
    valuePoY = '48%',
    labelPoY = '64%',
    type = 'half',
    startAngle = 180,
    colors = ['#FF444F', '#FFBD00', '#00DDFA', '#3336C7'],
    valueTextStyle = {},
    labelTextStyle = {},
    polar = {},
  } = config;
  const total: number = 360;
  const per: number = value > 1 ? total / value : value;
  const _color = colors.map((c, i) => ({ offset: ((i + 1) * 1) / colors.length, color: c }));
  const { center = ['50%', '96%'], stokeWidth = 20 } = config;
  const option: EChartsOption = {
    polar: {
      radius: '100%',
      center,
      ...polar,
    },
    angleAxis: {
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
      max: type === 'half' ? total * 2 : total,
      startAngle,
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
        show: false,
      },
      data: ['a', 'b', 'c'],
      z: 10,
    },
    series: [
      {
        type: 'bar',
        data: [0, 0, total * per],
        coordinateSystem: 'polar',
        z: 2,
        barMaxWidth: stokeWidth,
        silent: true,
        roundCap: true,
        barGap: '-100%',
        color: new graphic.LinearGradient(0, 0, 1, 0, _color),
      },
      {
        z: 0,
        type: 'bar',
        silent: true,
        roundCap: true,
        barGap: '-100%',
        color: '#4A5A62',
        data: [0, 0, total],
        barMaxWidth: stokeWidth,
        coordinateSystem: 'polar',
      },
    ],
    graphic: [
      {
        type: 'text',
        id: 'percent',
        top: valuePoY,
        left: 'center',
        style: {
          text: `${value * 100}%`,
          fontSize: 30,
          fill: '#ffffff',
          textAlign: 'center',
          fontFamily: 'DIN-Regular',
          ...valueTextStyle,
        },
      },
      {
        type: 'text',
        id: 'percent_label',
        top: labelPoY,
        left: 'center',
        style: {
          text: label,
          fontSize: 18,
          fill: '#ffffff',
          textAlign: 'center',
          opacity: 0.65,
          ...labelTextStyle,
        },
      },
    ],
  };

  return option;
}

export function PercentChart(props: PercentChartProps) {
  const { data, config = {}, ...otherProps } = props;
  const opt = getChartOptionsByData(data, config);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}
