import React from 'react';
import { graphic } from 'echarts';
import type { EChartsOption } from 'echarts';

import Charts from '../Charts';

export interface DataConfig {
  label: string;
  value: number;
}

export const demoData: DataConfig[] = [
  {
    label: '00:00',
    value: 82,
  },
  {
    label: '04:00',
    value: 34,
  },
  {
    label: '08:00',
    value: 12,
  },
  {
    label: '12:00',
    value: 56,
  },
  {
    label: '16:00',
    value: 74,
  },
  {
    label: '24:00',
    value: 94,
  },
];

interface _ChartOptions {
  unit?: string;
  rotate?: number;
  gridTop?: number;
}

export function getCurveChartOptions(data: DataConfig[], opts: _ChartOptions = {}): EChartsOption {
  const labelData: string[] = [];
  const valueData: number[] = [];
  data.forEach((d, i) => {
    labelData.push(d.label);
    valueData.push(d.value);
  });

  const { unit = '', rotate = -45, gridTop = 36 } = opts;

  const option: EChartsOption = {
    grid: {
      top: gridTop,
      left: 36,
      right: 0,
      bottom: 40,
    },
    xAxis: {
      type: 'category',
      data: labelData,
      axisLabel: {
        color: '#ffffff80',
        fontSize: 16,
        rotate,
        fontWeight: 'lighter',
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#ffffffa6',
        fontSize: 16,
      },
      splitLine: {
        lineStyle: {
          type: 'dotted',
          color: '#D8D8D880',
        },
      },
    },
    series: [
      {
        name: 'bar',
        type: 'line',
        smooth: true,
        data: valueData,
        symbol: 'circle',
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#23B8F0E6' },
            { offset: 1, color: '#23B8F000' },
          ]),
        },
        itemStyle: {
          color: '#00E5FF',
        },
        label: {
          show: true,
          position: 'top',
          color: '#00E5FF',
          formatter: `{c}${unit}`,
        },
      },
    ],
  };

  return option;
}

interface Props {
  data: DataConfig[];
  valueUnit?: string;
  rotate?: number;
  gridTop?: number;
}

export default function CurveChart(props: Props) {
  const { data = demoData, valueUnit, rotate, gridTop } = props;
  const opt = getCurveChartOptions(data, { unit: valueUnit, rotate, gridTop });
  return <Charts className="b100x100" options={opt} />;
}

CurveChart.defaultProps = {
  valueUnit: '',
  rotate: -45,
  gridTop: 36,
};
