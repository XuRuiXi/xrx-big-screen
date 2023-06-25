import React from 'react';
import type { EChartsOption } from 'echarts';
import type { ChartsProps } from '../Charts';
import Charts from '../Charts';

export interface PieChartProps extends Omit<ChartsProps, 'options'> {
  data: DataConfig[];
  config: PieChartConfig;
}

export interface DataConfig {
  label: string;
  value: number;
  itemStyle?: Record<string, any>; // eslint-disable-line
  extra?: number;
  tooltip?: string;
}

interface PieChartConfig {
  title?: string;
  colors?: string[];
  radius?: [string | number, string | number];
  hoverTip?: boolean;
  fontSize?: number; // 中间hover文案中的数值字体大小
  nameFontSize?: number; // 中间hover文案中的文案描述字体大小
  shadowColor?: string;
  borderColor?: string;
}

interface ItemConfig {
  name: string;
  value: number;
  percent: string;
  tooltip?: string;
  itemStyle?: Record<string, any>; // eslint-disable-line
}

const _colors = ['#00E5FF', '#6236FF', '#FCC004', '#FF5757', '#3336C7', '#28EB51'];

export function getPieChartOptions(data: DataConfig[], config: PieChartConfig): EChartsOption {
  const list: ItemConfig[] = [];
  let total = 0;
  data.forEach((it) => {
    total += it.value;
  });
  data.forEach((d) => {
    list.push({
      name: d.label,
      value: d.value,
      percent: ((d.value / total) * 100).toFixed(2),
      itemStyle: d.itemStyle,
    });
  });
  const options: EChartsOption = {
    color: config.colors ?? _colors,
    grid: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderColor: config?.borderColor,
          borderWidth: 4,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowBlur: 25,
          shadowColor: config.shadowColor ?? 'rbga(0,0,0,0)',
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            formatter: (data) => {
              const info = data.data;
              const str = `{a|${`${info.value}%`}}\n{b|${info.name}}`; // 这里对不同的内容进行标识 a，b，或者可以随便自己起个别的名字
              return str;
            },
            color: '#FFFFFF',
            rich: {
              a: {
                fontSize: 34,
                color: '#02EAFF',
                lineHeight: 41,
                fontFamily: 'DIN-BoldItalic',
              },
              b: {
                fontSize: 16.27906976744187,
                lineHeight: 23,
              },
            },
          },
        },
        labelLine: { show: true },
        data: list,
      },
    ],
  };
  return options;
}

export function PieChart(props: PieChartProps) {
  const { data, config, ...otherProps } = props;
  const opt = getPieChartOptions(data, config);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}

export interface SimplePieChartProps extends Omit<ChartsProps, 'options'> {
  data: DataConfig[];
  config?: SimplePieChartConfig;
}

interface SimplePieChartConfig {
  title?: string;
  colors?: string[];
  radius?: [string | number, string | number];
  hoverTip?: boolean;
  fontSize?: number; // 中间hover文案中的数值字体大小
  nameFontSize?: number; // 中间hover文案中的文案描述字体大小
}

function getSimplePieChart(data: DataConfig[], config: SimplePieChartConfig): EChartsOption {
  const { colors = _colors, radius = ['80%', '90%'], fontSize = 26, nameFontSize = 20 } = config;
  const total = data.reduce((t, i) => t + i.value, 0);
  const list: ItemConfig[] = [];
  data.forEach((it) => {
    list.push({
      name: it.label,
      value: it.value,
      tooltip: it.tooltip,
      percent: ((it.value / total) * 100).toFixed(2),
    });
    list.push({
      name: '',
      value: total / 128,
      percent: '0',
      itemStyle: {
        label: { show: false },
        labelLine: { show: false },
        color: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0,
      },
    });
  });

  const options: EChartsOption = {
    color: colors,
    legend: { show: false },
    series: [
      {
        type: 'pie',
        radius,
        itemStyle: { borderRadius: 0, borderWidth: 0 },
        data: list,
        label: {
          show: false,
          position: 'center',
          formatter: (dd) => {
            const _d: unknown = dd.data;
            const { tooltip, percent } = _d as ItemConfig;
            if (dd.name === '') return '';
            const _tooltip = tooltip ?? `${percent}%`;
            return `{n1|${_tooltip}}\n{t1|${dd.name}}`;
          },
          color: '#fff',
          rich: {
            n1: {
              fontSize,
              opacity: 0.85,
              lineHeight: 40,
              fontFamily: 'DIN-Regular',
            },
            t1: {
              fontSize: nameFontSize,
              color: '#FFFFFF',
              opacity: 0.45,
              width: 1,
            },
          },
        },
        emphasis: {
          scale: false,
          label: { show: true },
        },
      },
    ],
  };

  return options;
}

export function SimplePieChart(props: SimplePieChartProps) {
  const { data, config = {}, ...otherProps } = props;
  const opt = getSimplePieChart(data, config);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}
