import React from 'react';
import { graphic } from 'echarts';
import type { EChartsOption } from 'echarts';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';

export interface DataConfig extends Omit<ChartsProps, 'options'> {
  label: string;
  value: number;
}

export const demoData: DataConfig[] = [
  {
    label: '机动车乱停',
    value: 85,
  },
  {
    label: '店外经营',
    value: 90,
  },
  {
    label: '垃圾暴露',
    value: 120,
  },
];

export function getLineBarChartOptions(
  data: DataConfig[],
  splitNumber: number,
  hoverValue: boolean,
): EChartsOption {
  const labelData: string[] = [];
  const valueData: number[] = [];
  data.forEach((d, i) => {
    labelData.push(d.label);
    valueData.push(d.value);
  });

  const option: EChartsOption = {
    grid: {
      top: 36,
      bottom: 36,
    },
    xAxis: {
      type: 'category',
      data: labelData,
      axisLabel: {
        color: '#ffffff',
        fontSize: 16,
        interval: 0,
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
      splitNumber,
    },
    series: [
      {
        name: 'bar',
        type: 'bar',
        barWidth: 10.5,
        data: valueData,
        emphasis: {
          label: {
            show: hoverValue,
            position: 'top',
            color: '#fff',
            fontSize: 16,
          },
        },
        itemStyle: {
          borderRadius: 6,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00E5FF' },
            { offset: 1, color: '#3336C7' },
          ]),
        },
      },
    ],
  };

  return option;
}

export interface LineBarChartProps {
  data: DataConfig[];
  splitNumber?: number;
  hoverValue?: boolean;
}

export function LineBarChart(props: LineBarChartProps) {
  const { data = demoData, splitNumber = 0, hoverValue = false, ...otherProps } = props;
  const opt = getLineBarChartOptions(data, splitNumber, hoverValue);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}

export default LineBarChart;
