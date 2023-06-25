/**
 *  @description 从./chart.tsx逻辑中拆分
 */
import type { EChartsOption } from 'echarts';
import React from 'react';
import type { DataConfig, ItemConfig } from './_type';
import Charts from '../Charts';
import type { ChartsProps } from '../Charts';

const _colors = ['#00E5FF', '#6236FF', '#FCC004', '#FF5757', '#3336C7', '#28EB51'];
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

export default function SimplePieChart(props: SimplePieChartProps) {
  const { data, config = {}, ...otherProps } = props;
  const opt = getSimplePieChart(data, config);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}
