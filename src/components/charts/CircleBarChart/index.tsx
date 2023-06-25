import React from 'react';
import type { EChartsOption } from 'echarts';
import Charts from '../Charts';

export interface CircleBarChartProps {
  data: DataConfig[];
  config?: ChartConfig;
}

export interface ChartConfig {
  colors?: string[];
}

interface DataConfig {
  key?: string;
  label: string;
  value: number;
  area: number;
  name: string;
  fontSize?: number;
}

type NumberLike = string | number;

interface ItemConfig {
  name: string;
  value: NumberLike[];
  itemStyle?: Record<string, any>; // eslint-disable-line
}

const _colors = ['#E4592D80', '#00FEFF80', '#3336C780', '#9156E380'];

export const demoData: DataConfig[] = [
  {
    label: '实有人口',
    value: 400,
    area: 36,
    name: '400\n万元',
  },
  {
    label: '医疗卫生机构',
    value: 804,
    area: 32,
    name: '804',
  },
  {
    label: '学校',
    value: 123,
    area: 28,
    name: '612',
  },
  {
    label: '其他',
    value: 116,
    area: 16,
    name: '...',
  },
];

function getCircleBarChartOption(data: DataConfig[] = [], config: ChartConfig = {}) {
  const { colors = _colors } = config;
  const list: ItemConfig[] = data.map((item, i) => ({
    name: item.label,
    value: [item.label, '2', item.value, item.area, item.name],
    offset: [item.value, item.value],
    symbolSize: item.area,
    label: {
      color: '#fff',
      fontSize: item.fontSize ?? 24,
      fontFamily: 'DIN-Regular',
      verticalAlign: 'middle',
      lineHeight: 28,
      align: 'center',
    },
    itemStyle: {
      color: colors[i],
      opacity: 1,
    },
  }));

  const opts: EChartsOption = {
    color: colors,
    textStyle: {
      color: '#fff',
    },
    tooltip: {
      show: false,
    },
    legend: {
      show: false,
    },
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 52,
    },
    yAxis: {
      data: ['1', '2', '3'],
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#555'],
          type: 'dashed',
        },
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    xAxis: {
      boundaryGap: [0, 0],
      data: data.map(it => it.label),
      axisLine: {
        show: true,
        lineStyle: {
          color: '#555',
        },
      },
      axisLabel: {
        fontSize: '19px',
        color: 'rgba(255,255,255,0.85)',
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: 'value',
        type: 'scatter',
        symbol: 'circle',
        label: {
          show: true,
          formatter: ({ value }) => {
            const vv: unknown = value[4] ?? '';
            const aa = (vv as string).split('\n');
            let str = '';
            aa.forEach((t, i) => {
              if (str) {
                str += '\n';
              }
              str += `{a${i}|${t}}`;
            });
            return str;
          },
          color: '#fff',
          rich: {
            // a0: {
            //   color: '#fff',
            //   fontSize: 24,
            //   fontFamily: 'DIN-Regular',
            //   verticalAlign: 'middle',
            //   lineHeight: 28,
            //   align: 'center',
            // },
            a1: {
              color: '#fff',
              fontSize: 16,
              fontFamily: 'DIN-Regular',
              verticalAlign: 'middle',
              align: 'center',
            },
          },
        },
        data: list,
      },
    ],
  };

  return opts;
}

export function CircleBarChart(props: CircleBarChartProps) {
  const { data, config } = props;
  const opt = getCircleBarChartOption(data, config);
  return <Charts className="b100x100" options={opt} />;
}

export default CircleBarChart;
