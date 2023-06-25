/**
 *  @description 从./chart.tsx逻辑中拆分
 */
import type { EChartsOption } from 'echarts';
import React from 'react';

import type { DataConfig, ItemConfig } from './_type';
import Charts from '../Charts';

import type { ChartsProps } from '../Charts';

const pieSvg =
  'path://M5.664377212524414,0.5450992584228516C2.9564919471740723,0.5450992584228516,0.7613176107406616,2.7402734756469727,0.7613176107406616,5.448158264160156C0.7613176107406616,8.15604305267334,2.9564919471740723,10.351218223571777,5.664377212524414,10.351218223571777C8.372262001037598,10.351218223571777,10.567436218261719,8.15604305267334,10.567436218261719,5.448158264160156C10.567436218261719,2.7402734756469727,8.372262001037598,0.5450992584228516,5.664377212524414,0.5450992584228516ZM5.664377212524414,3.0644640922546387C6.9808549880981445,3.0644640922546387,8.048070907592773,4.131680488586426,8.048070907592773,5.448158264160156C8.048070907592773,6.764636993408203,6.9808549880981445,7.831852912902832,5.664377212524414,7.831852912902832C4.347898483276367,7.831852912902832,3.28068208694458,6.764636993408203,3.28068208694458,5.448158264160156C3.28068208694458,4.131680488586426,4.347898483276367,3.0644640922546387,5.664377212524414,3.0644640922546387Z';

const _colors = ['#00E5FF', '#6236FF', '#FCC004', '#FF5757', '#3336C7', '#28EB51'];

export interface PieChartProps extends Omit<ChartsProps, 'options'> {
  data: DataConfig[];
}

export function getPieChartOptions(data: DataConfig[]): EChartsOption {
  const list: ItemConfig[] = [];
  let total = 0;
  let mores = 0;
  data.forEach((it) => {
    total += it.value;
    mores += it.extra ?? 0;
  });
  const mapper = new Map<string, DataConfig>();
  data.forEach((d) => {
    mapper.set(d.label, d);
    list.push({
      name: d.label,
      value: d.value,
      percent: ((d.value / total) * 100).toFixed(2),
    });
    // 间隔
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
    color: _colors,
    legend: {
      top: 'middle',
      right: '2px',
      // @ts-expect-error
      icon: pieSvg,
      align: 'left',
      selectedMode: false,
      formatter: (label) => {
        let res: string = '';
        const item = mapper.get(label);
        if (item) {
          const f = (item.extra ?? 0) > 0;
          res = `{a|${item.label}}{b|${item.value}}`;
          res += `{r${f ? '1' : '2'}|${f ? '+' : ''}${item.extra ?? 0}%}`;
        }
        return res;
      },
      textStyle: {
        rich: {
          a: {
            color: '#fff',
            fontSize: '16px',
            width: 128,
          },
          b: {
            color: '#00E5FF',
            fontSize: '18px',
            width: 60,
            fontFamily: 'DIN-Regular',
          },
          r2: {
            color: '#FF5757',
            fontSize: '18px',
            fontFamily: 'DIN-Regular',
          },
          r1: {
            color: '#51EB02',
            fontSize: '18px',
            fontFamily: 'DIN-Regular',
          },
        },
      },
    },
    grid: { bottom: 0 },
    series: [
      {
        type: 'pie',
        right: '60%',
        radius: ['60%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderWidth: 0,
        },
        label: { show: false },
        tooltip: { show: false },
        emphasis: { scale: false },
        labelLine: { show: true },
        data: list,
      },
      {
        name: '中间文案',
        type: 'pie',
        right: '60%',
        radius: ['40%', '50%'],
        itemStyle: { color: 'transparent' },
        data: [
          {
            value: total,
            name: '',
            label: {
              show: true,
              position: 'center',
              formatter: (label) => {
                let res: string = `{a|${total}}\n{b|件/}`;
                const f = mores > 0;
                res += `{c${f ? '1' : '2'}|${f ? '+' : ''}${mores}%}`;
                return res;
              },
              rich: {
                a: {
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#fffc',
                  fontFamily: 'DIN-Regular',
                },
                b: {
                  color: '#fffc',
                  fontSize: '18px',
                },
                c2: {
                  color: '#FF5757',
                  fontSize: '18px',
                  fontFamily: 'DIN-Regular',
                },
                c1: {
                  fontSize: '18px',
                  color: '#51EB02',
                  fontFamily: 'DIN-Regular',
                },
              },
            },
          },
        ],
      },
    ],
  };
  return options;
}

export default function PieChart(props: PieChartProps) {
  const { data, ...otherProps } = props;
  const opt = getPieChartOptions(data);
  return <Charts className="b100x100" options={opt} {...otherProps} />;
}
